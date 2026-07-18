# Devpost submission draft

## Project name

LineageMedic

## Tagline

Renovate for breaking data changes.

## Challenge category

**Primary:** Metadata-Aware Code Generation & Development

LineageMedic also satisfies the read-act-write loop from Agents That Do Real Work, but the primary submission category is code generation: it converts DataHub context into four validated SQL/YAML repair artifacts across three repositories.

## DataHub technologies

- DataHub OSS / Core Platform
- DataHub MCP Server

## Submission links

- Public demo: <https://14188769700lbk-dev.github.io/lineage-medic/>
- Public 2:45 demo video: <https://youtu.be/WohjWxcAYfo>
- Source repository: <https://github.com/14188769700lbk-dev/lineage-medic>
- Judge testing guide: <https://github.com/14188769700lbk-dev/lineage-medic/blob/main/docs/judge-testing.md>
- Sanitized live MCP evidence: <https://github.com/14188769700lbk-dev/lineage-medic/blob/main/examples/evidence/live-datahub-read-run.json>
- Sanitized live writeback proof: <https://github.com/14188769700lbk-dev/lineage-medic/blob/main/examples/evidence/live-datahub-writeback.json>
- Published DataHub Decision screenshot: <https://github.com/14188769700lbk-dev/lineage-medic/blob/main/docs/assets/datahub-decision.jpg>
- Generated sample outputs: <https://github.com/14188769700lbk-dev/lineage-medic/tree/main/examples/generated/LM-204>
- Generated repair pull request: <https://github.com/14188769700lbk-dev/lineage-medic/pull/1>
- Upstream DataHub contribution: <https://github.com/datahub-project/datahub-skills/pull/36>

## Short description

LineageMedic is Renovate for breaking data changes. It uses DataHub column lineage, schemas, ownership, and observed-query evidence to turn a proposed schema rename into validated SQL and YAML repairs across every affected repository—before the breaking PR merges.

## Judge-first summary

One guided run turns a risky `shipping_country → country_code` proposal into:

- three real DataHub MCP reads: three-hop column lineage, six entity records, and observed production SQL;
- four validated SQL/YAML changes across three repository workspaces;
- four deterministic gates covering SQL parsing, dbt refs, contract compatibility, and lineage repair coverage;
- one real, CI-verified GitHub pull request containing the four generated changes;
- one auditable manifest plus an approval-gated DataHub Decision writeback.

**The DataHub counterfactual:** without the context graph this is a global rename. With DataHub, LineageMedic knows which owners and assets are affected, which consumers still execute the legacy field, and where a public output contract must remain stable. That context changes the generated code, not just the explanation around it.

## Inspiration

A column rename is rarely hard in the producer repository. The real cost appears downstream: a dbt model owned by fulfillment, a finance mart with a public output contract, an Airflow SLA, and dashboards nobody remembered to check. Existing impact tools surface the blast radius but leave humans to coordinate and implement every repair.

We wanted an agent that does the next responsible thing: preserve compatibility, generate reviewable code changes for each owner, prove coverage, and leave the decision beside the affected assets in DataHub.

## Why it is different

DataHub already answers **what will break**. LineageMedic answers **what each owning team should merge, in what order, and why it is safe**.

It does not perform a global string replacement. DataHub identifies the affected assets and their operational context; explicit repository contract bindings then produce three different repair policies for the same rename:

- the producer keeps a temporary compatibility alias;
- an internal fulfillment model migrates directly;
- a board-reporting finance model reads the new field while preserving its public output contract.

Every code-bound lineage asset must receive a repair, and every generated artifact must pass deterministic validation before the campaign becomes reviewable.

## What it does

Given `shipping_country → country_code`, LineageMedic:

- calls DataHub MCP for column lineage, entity context, and observed queries;
- ranks six affected assets across dbt, Airflow, Looker, and Power BI;
- selects a compatibility-window migration plan;
- edits four files across three copied repositories;
- validates SQL syntax, dbt refs, contract compatibility, and lineage coverage;
- produces an auditable JSON manifest and Decision document;
- saves that document to DataHub only after explicit approval.

## How we built it

The review application uses React, TypeScript, Vite, Fastify, and the official Model Context Protocol TypeScript SDK. A live adapter supports DataHub Cloud over Streamable HTTP and self-hosted DataHub through the official `mcp-server-datahub` stdio package. A sanitized live-run capture powers the public replay, while a checked-in fixture keeps the repair engine reproducible without credentials.

The repair engine is deterministic. It works on isolated repository copies, applies an explicit policy per lineage-bound asset, and blocks review status unless all validators pass. Full before/after patches and raw live MCP responses are retained in the run manifest.

## Challenges

The hardest design problem was not generating a string replacement. It was deciding when a rename may propagate and when a public downstream contract must remain stable. DataHub's transitive lineage and query evidence provide that distinction. A second challenge was keeping the demo honest: recorded and live modes are visibly distinct, `dbt ref resolution` is not misrepresented as a warehouse-backed compile, and no PR or DataHub write is claimed until it exists.

## Accomplishments

- End-to-end repair of four real files across three repositories.
- One-click visual demo plus a headless `npm run demo` path.
- Live and fixture DataHub MCP adapters with identical semantics.
- Explicit writeback approval aligned with the `save_document` safety contract.
- Machine-readable evidence manifest and automated CI.
- A sanitized self-hosted DataHub MCP capture with live lineage, entity, and query responses.
- Checked-in generated SQL/YAML outputs that judges can inspect without running the application.
- A real generated-repair pull request with a successful CI check and reviewable four-file diff.
- An upstream contribution implementing the missing `datahub-audit` workflow in the official DataHub Skills repository.

## What we learned

Metadata-aware code generation becomes much more useful when lineage is treated as an execution plan rather than a diagram. Ownership tells us who must review, observed queries reveal compatibility obligations, and a catalog document can carry migration memory across agents and teams.

We also learned that a trustworthy agent needs two independent gates: validation proves that a proposed change is structurally safe, while explicit approval controls external mutations. A larger model cannot replace either gate.

## Data and licensing

The metadata scenario is based on DataHub's pre-existing CC0 Fiction Retail datapack. The LineageMedic application, the three synthetic dbt repositories, and all migration code were created during the July 6–August 10, 2026 submission period; the first repository commit is dated July 15, 2026. Standard open-source libraries and the official DataHub MCP server are the only incorporated software dependencies. LineageMedic is released under Apache 2.0. No private tenant metadata or credentials are included in the live evidence capture.

## Testing

Judges can use the public replay with no login, run the deterministic engine with `npm ci && npm run demo`, or connect the application to DataHub OSS/Cloud through the documented MCP modes. The full test path and expected invariants are in `docs/judge-testing.md`.

## What's next

- GitHub App support for opening coordinated draft PRs and tracking merge order.
- Native `dbt compile` and warehouse dry-run adapters when profiles are available.
- Generalized type-change and removal policies.
- Reconciliation that re-queries DataHub after deployment and closes the compatibility window only when legacy usage reaches zero.

## Submission checklist

- [x] Public GitHub repository URL
- [x] Hosted demo URL
- [x] Apache 2.0 license detected in the repository About panel
- [x] Project history begins inside the official submission period
- [x] English README, testing guide, submission copy, narration, and captions
- [x] Live DataHub MCP read-run evidence
- [x] Checked-in sample outputs with automated parity and sanitation tests
- [x] Upstream open-source contribution URL
- [x] Final testing instructions
- [x] Real generated-repair pull request URL
- [x] Public YouTube video URL under three minutes
- [x] Project thumbnail and ordered screenshot gallery uploaded
- [x] DataHub Decision document screenshot and sanitized persisted-URN proof
- [x] Most Valuable Feedback survey completed and opted in
- [x] Team, country, age, eligibility, and entrant attestations completed by the entrant
- [x] Final Devpost submission confirmation
- [ ] Public demo, repository, and video kept available through the judging period
