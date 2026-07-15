import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import type {
  DataHubContextProvider,
  DataHubContextSnapshot,
  DecisionWriteback,
  WritebackResult,
} from "../core/context-provider.js";
import type { ProposedChange } from "../shared/types.js";

const assetSchema = z.object({
  id: z.string(),
  urn: z.string(),
  name: z.string(),
  type: z.enum(["dataset", "dashboard", "dataJob", "chart"]),
  platform: z.string(),
  owner: z.string(),
  domain: z.string(),
  hops: z.number().int().nonnegative(),
  risk: z.enum(["critical", "high", "medium", "low"]),
  usesChangedField: z.boolean(),
  usageEvidence: z.string(),
  repository: z.string().optional(),
  file: z.string().optional(),
  x: z.number(),
  y: z.number(),
});

const fixtureSchema = z.object({
  mode: z.literal("fixture"),
  label: z.string(),
  recordedAt: z.string(),
  assets: z.array(assetSchema),
  bindings: z.array(
    z.object({
      assetUrn: z.string(),
      repository: z.string(),
      file: z.string(),
      policy: z.enum([
        "producer-compatibility",
        "migrate-consumer",
        "preserve-output",
      ]),
      contractFile: z.string().optional(),
    }),
  ),
  queries: z.array(
    z.object({
      assetUrn: z.string(),
      sql: z.string(),
      source: z.enum(["MANUAL", "SYSTEM"]),
      lastSeenAt: z.string(),
    }),
  ),
  toolCalls: z.array(
    z.object({
      name: z.enum([
        "get_lineage",
        "get_entities",
        "get_dataset_queries",
        "save_document",
      ]),
      arguments: z.record(z.string(), z.unknown()),
      responseSummary: z.string(),
      status: z.enum(["complete", "skipped"]),
    }),
  ),
});

export class FixtureDataHubProvider implements DataHubContextProvider {
  constructor(
    private readonly fixturePath = path.resolve(
      process.cwd(),
      "examples/context/fiction-retail-datahub.json",
    ),
  ) {}

  async load(change: ProposedChange): Promise<DataHubContextSnapshot> {
    const raw = await readFile(this.fixturePath, "utf8");
    const snapshot = fixtureSchema.parse(JSON.parse(raw));

    if (!snapshot.assets.some((asset) => asset.urn === change.datasetUrn)) {
      throw new Error(
        `Fixture ${this.fixturePath} does not contain ${change.datasetUrn}`,
      );
    }

    return snapshot;
  }

  async saveDecision(
    decision: DecisionWriteback,
    _approved: boolean,
  ): Promise<WritebackResult> {
    const urn = `urn:li:document:lineage-medic-preview-${slug(decision.title)}`;

    return {
      persisted: false,
      urn,
      message:
        "Fixture mode produced a local writeback package; no DataHub mutation was attempted.",
      trace: {
        name: "save_document",
        arguments: {
          document_type: decision.documentType,
          title: decision.title,
          related_assets: decision.relatedAssets,
          topics: decision.topics,
        },
        responseSummary: "Local preview only; live writeback awaits explicit approval",
        status: "skipped",
      },
    };
  }
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
