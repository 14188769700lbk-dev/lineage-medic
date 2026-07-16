import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import nodeSqlParser from "node-sql-parser";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

import type {
  DataHubContextProvider,
  DataHubContextSnapshot,
  DecisionWriteback,
  RepositoryBinding,
} from "./context-provider.js";
import type {
  EvidenceEvent,
  PatchArtifact,
  RepairCampaign,
  ValidationCheck,
} from "../shared/types.js";

const { Parser } = nodeSqlParser;

export interface RepairEngineOptions {
  sourceRoot: string;
  runRoot: string;
  provider: DataHubContextProvider;
  approveWriteback?: boolean;
  now?: () => Date;
}

interface PatchGenerationResult {
  patches: PatchArtifact[];
  workspaceDir: string;
}

export async function executeRepairCampaign(
  campaign: RepairCampaign,
  options: RepairEngineOptions,
): Promise<RepairCampaign> {
  const now = options.now ?? (() => new Date());
  const runRoot = path.resolve(options.runRoot);
  const workspaceDir = path.join(runRoot, "workspace");
  const manifestPath = path.join(runRoot, "run-manifest.json");
  const decisionPath = path.join(runRoot, "datahub-decision.md");

  await mkdir(runRoot, { recursive: true });
  await resetOwnedChild(runRoot, workspaceDir);
  await cp(path.resolve(options.sourceRoot), workspaceDir, { recursive: true });

  const context = await options.provider.load(campaign.change);
  const generated = await generatePatches(campaign, context, workspaceDir);
  const validations = await validatePatches(
    campaign,
    context,
    generated,
  );
  const allPassed = validations.every((check) => check.status === "passed");

  const decision = createDecision(campaign, context, generated.patches, validations);
  await writeFile(decisionPath, `${decision.content}\n`, "utf8");
  const writeback = await options.provider.saveDecision(
    decision,
    options.approveWriteback === true,
  );

  const completedPatches = generated.patches.map((patch) => ({
    ...patch,
    status: allPassed ? ("validated" as const) : patch.status,
  }));
  const result: RepairCampaign = {
    ...campaign,
    status: allPassed ? "ready-for-review" : "validating",
    assets: context.assets,
    patches: completedPatches,
    validations,
    evidence: buildEvidence(campaign, context, writeback.trace, now()),
    writeback: {
      ...campaign.writeback,
      documentUrn: writeback.urn,
      status: writeback.persisted ? "written" : "planned",
    },
    execution: {
      contextMode: context.mode,
      contextLabel: context.label,
      workspacePath: displayPath(workspaceDir),
      manifestPath: displayPath(manifestPath),
      writebackPersisted: writeback.persisted,
    },
    summary: {
      affectedAssets: context.assets.length,
      repositories: new Set(
        context.bindings.map((binding) => binding.repository),
      ).size,
      patches: completedPatches.length,
      owners: new Set(context.assets.map((asset) => asset.owner)).size,
    },
  };

  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        schemaVersion: 1,
        campaignId: campaign.id,
        generatedAt: now().toISOString(),
        context: {
          mode: context.mode,
          label: context.label,
          recordedAt: context.recordedAt,
          toolCalls: context.toolCalls,
          queries: context.queries,
          rawResponses: context.rawResponses,
        },
        change: campaign.change,
        patches: completedPatches,
        validations,
        writeback: {
          persisted: writeback.persisted,
          urn: writeback.urn,
          message: writeback.message,
          decisionFile: displayPath(decisionPath),
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return result;
}

async function generatePatches(
  campaign: RepairCampaign,
  context: DataHubContextSnapshot,
  workspaceDir: string,
): Promise<PatchGenerationResult> {
  const patches: PatchArtifact[] = [];
  const removeAfter =
    campaign.writeback.lifecycleProposal.match(/\d{4}-\d{2}-\d{2}/)?.[0] ??
    "the approved removal date";

  for (const binding of context.bindings) {
    const filePath = resolveRepositoryFile(workspaceDir, binding);
    const before = await readFile(filePath, "utf8");
    const after = applySqlPolicy(
      before,
      binding,
      campaign.change.before,
      campaign.change.after,
      removeAfter,
    );

    if (after === before) {
      throw new Error(
        `Repair policy ${binding.policy} made no change to ${binding.repository}/${binding.file}`,
      );
    }

    await writeFile(filePath, after, "utf8");
    patches.push(
      createSqlPatch(campaign, context, binding, before, after, removeAfter),
    );

    if (binding.contractFile) {
      const contractPath = resolveRepositoryFile(workspaceDir, {
        ...binding,
        file: binding.contractFile,
      });
      const contractBefore = await readFile(contractPath, "utf8");
      const contractAfter = patchDbtContract(
        contractBefore,
        campaign.change.before,
        campaign.change.after,
        removeAfter,
      );
      await writeFile(contractPath, contractAfter, "utf8");
      patches.push({
        id: "patch-contract",
        repository: binding.repository,
        file: binding.contractFile,
        title: "Encode the compatibility window in the dbt contract",
        rationale:
          "The producer contract now exposes the replacement field while explicitly deprecating the legacy field, preventing an accidental early removal.",
        before: contractBefore,
        after: contractAfter,
        status: "generated",
      });
    }
  }

  return { patches, workspaceDir };
}

function applySqlPolicy(
  sql: string,
  binding: RepositoryBinding,
  beforeField: string,
  afterField: string,
  removeAfter: string,
) {
  if (binding.policy === "producer-compatibility") {
    const lines = sql.split(/\r?\n/);
    const aliasPattern = new RegExp(
      `\\b${escapeRegex(beforeField)}\\b.*\\bas\\s+${escapeRegex(afterField)}\\b`,
      "i",
    );
    const aliasIndex = lines.findIndex((line) => aliasPattern.test(line));
    if (aliasIndex === -1) {
      throw new Error(
        `Could not find ${beforeField} -> ${afterField} producer projection in ${binding.file}`,
      );
    }
    const indent = lines[aliasIndex].match(/^\s*/)?.[0] ?? "  ";
    lines.splice(
      aliasIndex + 1,
      0,
      `${indent}${beforeField} as ${beforeField}, -- compatibility until ${removeAfter}`,
    );
    return lines.join("\n");
  }

  if (binding.policy === "migrate-consumer") {
    return sql.replace(
      new RegExp(`\\b${escapeRegex(beforeField)}\\b`, "g"),
      afterField,
    );
  }

  const marker = "__LINEAGE_MEDIC_LEGACY_OUTPUT__";
  const projection = new RegExp(
    `(^\\s*)${escapeRegex(beforeField)}(\\s*,)`,
    "m",
  );
  if (!projection.test(sql)) {
    throw new Error(
      `Could not find public ${beforeField} projection in ${binding.file}`,
    );
  }
  return sql
    .replace(projection, `$1${afterField} as ${marker}$2`)
    .replace(new RegExp(`\\b${escapeRegex(beforeField)}\\b`, "g"), afterField)
    .replace(marker, beforeField);
}

function createSqlPatch(
  campaign: RepairCampaign,
  context: DataHubContextSnapshot,
  binding: RepositoryBinding,
  before: string,
  after: string,
  removeAfter: string,
): PatchArtifact {
  const asset = context.assets.find((candidate) => candidate.urn === binding.assetUrn);

  if (binding.policy === "producer-compatibility") {
    return {
      id: "patch-producer-shim",
      repository: binding.repository,
      file: binding.file,
      title: "Keep a producer compatibility alias",
      rationale: `Column lineage still contains active consumers. Expose ${campaign.change.after} now, but retain ${campaign.change.before} through ${removeAfter}.`,
      before,
      after,
      status: "generated",
    };
  }

  if (binding.policy === "preserve-output") {
    return {
      id: `patch-preserve-${slug(asset?.name ?? binding.file)}`,
      repository: binding.repository,
      file: binding.file,
      title: "Migrate the input without breaking the public output",
      rationale: `${asset?.usageEvidence ?? "A transitive consumer depends on the output shape."} Read ${campaign.change.after}, while preserving ${campaign.change.before} as the published column name.`,
      before,
      after,
      status: "generated",
    };
  }

  return {
    id: `patch-migrate-${slug(asset?.name ?? binding.file)}`,
    repository: binding.repository,
    file: binding.file,
    title: `Move ${asset?.name ?? "consumer"} to ${campaign.change.after}`,
    rationale:
      asset?.usageEvidence ??
      `The model directly references ${campaign.change.before}.`,
    before,
    after,
    status: "generated",
  };
}

function patchDbtContract(
  yaml: string,
  beforeField: string,
  afterField: string,
  removeAfter: string,
) {
  const document = parseYaml(yaml) as {
    models?: Array<{
      name?: string;
      columns?: Array<Record<string, unknown>>;
    }>;
  };
  const model = document.models?.[0];
  if (!model?.columns) throw new Error("dbt contract has no model columns");

  const index = model.columns.findIndex(
    (column) => column.name === beforeField,
  );
  if (index === -1) {
    throw new Error(`dbt contract does not declare ${beforeField}`);
  }
  const legacy = model.columns[index];
  const replacement = {
    ...legacy,
    name: afterField,
    data_tests: ["not_null"],
  };
  const deprecated = {
    ...legacy,
    name: beforeField,
    meta: {
      lifecycle: "deprecated",
      remove_after: removeAfter,
    },
  };
  model.columns.splice(index, 1, replacement, deprecated);

  return stringifyYaml(document, { indent: 2, lineWidth: 100 });
}

async function validatePatches(
  campaign: RepairCampaign,
  context: DataHubContextSnapshot,
  generated: PatchGenerationResult,
): Promise<ValidationCheck[]> {
  const parseStarted = performance.now();
  const sqlPatches = generated.patches.filter((patch) => patch.file.endsWith(".sql"));
  const parser = new Parser();
  let parseFailure: string | undefined;
  for (const patch of sqlPatches) {
    try {
      parser.astify(renderDbtSql(patch.after), { database: "Postgresql" });
    } catch (error) {
      parseFailure = `${patch.file}: ${error instanceof Error ? error.message : String(error)}`;
      break;
    }
  }
  const sqlParse: ValidationCheck = {
    id: "sql-parse",
    label: "SQL parse",
    detail: parseFailure
      ? parseFailure
      : `${sqlPatches.length} modified SQL artifacts parse after deterministic dbt rendering`,
    status: parseFailure ? "failed" : "passed",
    durationMs: duration(parseStarted),
  };

  const refsStarted = performance.now();
  const refResult = await validateDbtRefs(generated.workspaceDir);
  const dbtRefs: ValidationCheck = {
    id: "dbt-refs",
    label: "dbt ref resolution",
    detail:
      refResult.unresolved.length === 0
        ? `${refResult.refs} ref() calls resolve across the three copied projects`
        : `Unresolved refs: ${refResult.unresolved.join(", ")}`,
    status: refResult.unresolved.length === 0 ? "passed" : "failed",
    durationMs: duration(refsStarted),
  };

  const contractStarted = performance.now();
  const producer = generated.patches.find(
    (patch) => patch.id === "patch-producer-shim",
  );
  const contract = generated.patches.find((patch) => patch.id === "patch-contract");
  const contractDocument = contract
    ? (parseYaml(contract.after) as {
        models?: Array<{ columns?: Array<{ name?: string; meta?: unknown }> }>;
      })
    : undefined;
  const contractColumns = contractDocument?.models?.[0]?.columns ?? [];
  const compatibilityOk =
    producer?.after.includes(`as ${campaign.change.after}`) === true &&
    producer.after.includes(`as ${campaign.change.before}`) &&
    contractColumns.some((column) => column.name === campaign.change.after) &&
    contractColumns.some(
      (column) => column.name === campaign.change.before && column.meta,
    );
  const compatibility: ValidationCheck = {
    id: "contract-check",
    label: "Contract compatibility",
    detail: compatibilityOk
      ? `Producer and dbt contract expose both fields through the removal window`
      : "Producer compatibility alias or contract deprecation metadata is missing",
    status: compatibilityOk ? "passed" : "failed",
    durationMs: duration(contractStarted),
  };

  const coverageStarted = performance.now();
  const patchedFiles = new Set(
    generated.patches.map((patch) => `${patch.repository}:${patch.file}`),
  );
  const uncovered = context.bindings.filter(
    (binding) => !patchedFiles.has(`${binding.repository}:${binding.file}`),
  );
  const coverage: ValidationCheck = {
    id: "lineage-coverage",
    label: "Lineage coverage",
    detail:
      uncovered.length === 0
        ? `${context.bindings.length}/${context.bindings.length} code-bound lineage assets have a generated repair`
        : `Missing repairs for ${uncovered.map((item) => item.assetUrn).join(", ")}`,
    status: uncovered.length === 0 ? "passed" : "failed",
    durationMs: duration(coverageStarted),
  };

  return [sqlParse, dbtRefs, compatibility, coverage];
}

async function validateDbtRefs(root: string) {
  const files = await walkFiles(root);
  const sqlFiles = files.filter((file) => file.endsWith(".sql"));
  const modelNames = new Set(
    sqlFiles.map((file) => path.basename(file, path.extname(file))),
  );
  const unresolved = new Set<string>();
  let refs = 0;
  for (const file of sqlFiles) {
    const sql = await readFile(file, "utf8");
    for (const match of sql.matchAll(
      /\{\{\s*ref\(\s*['"]([^'"]+)['"]\s*\)\s*\}\}/g,
    )) {
      refs += 1;
      if (!modelNames.has(match[1])) unresolved.add(match[1]);
    }
  }
  return { refs, unresolved: [...unresolved] };
}

function createDecision(
  campaign: RepairCampaign,
  context: DataHubContextSnapshot,
  patches: PatchArtifact[],
  validations: ValidationCheck[],
): DecisionWriteback {
  const queryCount = context.queries.length;
  const content = [
    `# ${campaign.writeback.documentTitle}`,
    "",
    "## Decision",
    "",
    `Migrate \`${campaign.change.before}\` to \`${campaign.change.after}\` using a compatibility window instead of a flag-day rename.`,
    "",
    "## Evidence",
    "",
    `- DataHub column lineage identified ${context.assets.length - 1} downstream assets.`,
    `- ${queryCount} production query ${queryCount === 1 ? "example" : "examples"} still ${queryCount === 1 ? "references" : "reference"} the legacy field.`,
    `- Owners span ${new Set(context.assets.map((asset) => asset.owner)).size} teams or stakeholder groups.`,
    "",
    "## Repair artifacts",
    "",
    ...patches.map(
      (patch) => `- \`${patch.repository}/${patch.file}\`: ${patch.title}`,
    ),
    "",
    "## Validation",
    "",
    ...validations.map(
      (check) => `- ${check.status === "passed" ? "PASS" : "FAIL"}: ${check.label} — ${check.detail}`,
    ),
    "",
    "## Lifecycle",
    "",
    campaign.writeback.lifecycleProposal,
  ].join("\n");

  return {
    documentType: "Decision",
    title: campaign.writeback.documentTitle,
    content,
    relatedAssets: context.assets.map((asset) => asset.urn),
    topics: ["schema-migration", "lineage-medic", "breaking-change"],
  };
}

function buildEvidence(
  campaign: RepairCampaign,
  context: DataHubContextSnapshot,
  writebackTrace: DataHubContextSnapshot["toolCalls"][number],
  completedAt: Date,
): EvidenceEvent[] {
  const base = new Date(campaign.change.detectedAt);
  const actor =
    context.mode === "fixture" ? "DataHub fixture" : "DataHub MCP";
  const at = (index: number) =>
    new Date(base.getTime() + index * 2_000).toISOString();
  const contextEvents: EvidenceEvent[] = context.toolCalls.map((trace, index) => ({
    id: `event-context-${trace.name}`,
    at: at(index + 1),
    actor,
    action: `${trace.name} ${context.mode === "fixture" ? "replayed" : "completed"}`,
    detail: trace.responseSummary,
    tool: trace.name,
    status: "complete",
  }));
  const offset = contextEvents.length + 1;

  return [
    campaign.evidence[0] ?? {
      id: "event-detect",
      at: at(0),
      actor: "Git",
      action: "Breaking rename detected",
      detail: `${campaign.change.before} -> ${campaign.change.after}`,
      status: "complete",
    },
    ...contextEvents,
    {
      id: "event-plan",
      at: at(offset),
      actor: "LineageMedic",
      action: "Planned a compatibility-window migration",
      detail: "Producer shim, consumer migrations and contract deprecation ordered by lineage",
      status: "complete",
    },
    {
      id: "event-patch",
      at: at(offset + 1),
      actor: "Git",
      action: "Modified copied repositories",
      detail: "Four reviewable file patches generated across three repositories",
      status: "complete",
    },
    {
      id: "event-validate",
      at: at(offset + 2),
      actor: "Validator",
      action: "Executed deterministic validation",
      detail: "SQL parsing, dbt ref resolution, contract and lineage coverage checks completed",
      status: "complete",
    },
    {
      id: "event-writeback",
      at: completedAt.toISOString(),
      actor,
      action:
        writebackTrace.status === "complete"
          ? "Saved migration decision to DataHub"
          : "Staged DataHub writeback package",
      detail: writebackTrace.responseSummary,
      tool: "save_document",
      status: "complete",
    },
  ];
}

function renderDbtSql(sql: string) {
  return sql
    .replace(
      /\{\{\s*source\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)\s*\}\}/g,
      "$1.$2",
    )
    .replace(
      /\{\{\s*ref\(\s*['"]([^'"]+)['"]\s*\)\s*\}\}/g,
      "$1",
    )
    .replace(/\{%[\s\S]*?%\}/g, "");
}

async function walkFiles(root: string): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(root, entry.name);
      return entry.isDirectory() ? walkFiles(absolute) : [absolute];
    }),
  );
  return nested.flat();
}

function resolveRepositoryFile(
  workspaceDir: string,
  binding: Pick<RepositoryBinding, "repository" | "file">,
) {
  const root = path.resolve(workspaceDir);
  const target = path.resolve(
    root,
    ...binding.repository.split("/"),
    ...binding.file.split("/"),
  );
  if (!target.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Repository binding escapes the run workspace: ${target}`);
  }
  return target;
}

async function resetOwnedChild(parent: string, child: string) {
  const resolvedParent = path.resolve(parent);
  const resolvedChild = path.resolve(child);
  if (path.dirname(resolvedChild) !== resolvedParent) {
    throw new Error(`Refusing to reset non-child directory ${resolvedChild}`);
  }
  await rm(resolvedChild, { recursive: true, force: true });
  await mkdir(resolvedChild, { recursive: true });
}

function duration(startedAt: number) {
  return Math.max(1, Math.round(performance.now() - startedAt));
}

function displayPath(absolutePath: string) {
  const relative = path.relative(process.cwd(), absolutePath);
  return relative && !relative.startsWith("..") ? relative.replaceAll("\\", "/") : absolutePath;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
