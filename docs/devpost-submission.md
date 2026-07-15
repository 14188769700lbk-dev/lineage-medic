# Devpost submission draft

## Project name

LineageMedic

## Tagline

Renovate for breaking data changes.

## Short description

LineageMedic uses DataHub column lineage, ownership, and production-query evidence to turn a proposed schema change into a validated, cross-repository repair campaign before the breaking PR merges.

## Inspiration

A column rename is rarely hard in the producer repository. The real cost appears downstream: a dbt model owned by fulfillment, a finance mart with a public output contract, an Airflow SLA, and dashboards nobody remembered to check. Existing impact tools surface the blast radius but leave humans to coordinate and implement every repair.

We wanted an agent that does the next responsible thing: preserve compatibility, generate reviewable code changes for each owner, prove coverage, and leave the decision beside the affected assets in DataHub.

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

The review application uses React, TypeScript, Vite, Fastify, and the official Model Context Protocol TypeScript SDK. A live adapter supports DataHub Cloud over Streamable HTTP and self-hosted DataHub through the official `mcp-server-datahub` stdio package. The same typed provider contract powers a credential-free recorded fixture for reproducible judging.

The repair engine is deterministic. It works on isolated repository copies, applies an explicit policy per lineage-bound asset, and blocks review status unless all validators pass. Full before/after patches and raw live MCP responses are retained in the run manifest.

## Challenges

The hardest design problem was not generating a string replacement. It was deciding when a rename may propagate and when a public downstream contract must remain stable. DataHub's transitive lineage and query evidence provide that distinction. A second challenge was keeping the demo honest: fixture evidence is visibly labeled, `dbt ref resolution` is not misrepresented as a warehouse-backed compile, and no PR or DataHub write is claimed until it exists.

## Accomplishments

- End-to-end repair of four real files across three repositories.
- One-click visual demo plus a headless `npm run demo` path.
- Live and fixture DataHub MCP adapters with identical semantics.
- Explicit writeback approval aligned with the `save_document` safety contract.
- Machine-readable evidence manifest and automated CI.

## What we learned

Metadata-aware code generation becomes much more useful when lineage is treated as an execution plan rather than a diagram. Ownership tells us who must review, observed queries reveal compatibility obligations, and a catalog document can carry migration memory across agents and teams.

## What's next

- GitHub App support for opening coordinated draft PRs and tracking merge order.
- Native `dbt compile` and warehouse dry-run adapters when profiles are available.
- Generalized type-change and removal policies.
- Reconciliation that re-queries DataHub after deployment and closes the compatibility window only when legacy usage reaches zero.

## Submission checklist

- [ ] Public GitHub repository URL
- [ ] Hosted demo URL
- [ ] 2–3 minute public video URL
- [ ] Live DataHub MCP recording
- [ ] DataHub Decision document screenshot/URL
- [ ] Upstream open-source contribution URL
- [ ] Final testing instructions
- [ ] Team and eligibility fields completed by entrant
