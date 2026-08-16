# LineageMedic paid pilot

**A fixed-scope safety sprint for breaking data changes.**

LineageMedic helps a data platform team answer three questions before a warehouse or dbt schema change ships:

1. What downstream assets and owners are actually affected?
2. Which consumers can migrate directly, and which contracts must remain compatible?
3. What reviewable code changes and evidence are needed before approval?

This is a commercial offer draft, not a claim of existing customers, revenue, or guaranteed savings.

## Evidence before claims

Prospects can inspect the complete technical proof before sharing any private data:

- [No-login hosted replay](https://14188769700lbk-dev.github.io/lineage-medic/)
- [2:45 product walkthrough](https://youtu.be/WohjWxcAYfo)
- [Four-file generated repair PR](https://github.com/14188769700lbk-dev/lineage-medic/pull/1)
- [Synthetic sample risk-review report](docs/sample-risk-review.md)
- [Sanitized DataHub MCP run manifest](examples/evidence/live-datahub-read-run.json)
- [Approval-gated writeback proof](examples/evidence/live-datahub-writeback.json)
- [Automated verification](https://github.com/14188769700lbk-dev/lineage-medic/actions)

## Three ways to start

### 1. Schema Change Risk Review — USD 750 fixed

For a team that wants an independent answer before committing to a migration.

- One proposed field rename, removal, or compatible type change
- One data domain and up to 25 catalog assets
- Read-only metadata and up to three repository snapshots
- Blast-radius, ownership, and contract-risk report
- One 45-minute review call and a prioritized next-step plan
- Five business-day target after access is ready

No source repository is modified. This is the lowest-risk entry offer.

### 2. Repair Campaign Pilot — USD 3,500 fixed

For one real change that must cross multiple repositories or owners.

- Everything in the risk review
- Up to three repositories and five code-bound downstream assets
- Isolated SQL/YAML repair drafts
- Parser, reference, compatibility, and coverage checks
- Human-reviewed migration sequence and removal window
- Draft pull-request package or patch bundle
- Audit manifest and handoff session
- Ten business-day target after access is ready

Production writes are excluded. A draft PR is opened only when the client explicitly authorizes it.

### 3. Team Integration Sprint — USD 8,000–15,000

For teams that want repeatable change campaigns inside their workflow.

- DataHub Cloud or OSS adapter configuration
- Repository allowlist and ownership mapping
- Policy and approval workflow
- GitHub draft-PR integration
- One pilot migration plus operator runbook
- Optional BigQuery, Snowflake, or dbt Cloud validation adapter scoped separately

Final price depends on repositories, authentication, deployment, and security review. No estimate becomes binding until both parties approve a written scope.

## What is deliberately excluded

- Unapproved production or catalog mutation
- Credentials pasted into chat, tickets, or public issues
- Claims that generated SQL is production-safe without client-side tests
- Unlimited repositories, warehouses, or custom adapters
- Legal, regulatory, tax, or data-protection certification
- Guaranteed cost savings, migration dates, or business outcomes

## Security boundary

The default engagement uses sanitized metadata exports and isolated repository copies. If live access is required, use short-lived, least-privilege credentials supplied through an agreed private channel. LineageMedic retains a tool trace and generated artifacts for review, but the retention period and deletion process must be agreed before access.

## Good pilot fit

- DataHub, dbt, Snowflake, BigQuery, Redshift, Databricks, or a similar modern stack
- A planned rename, removal, semantic-layer migration, or warehouse consolidation
- More than one code owner or repository in the blast radius
- A need for reviewable evidence rather than a one-off chat answer
- A buyer who can approve access and a technical owner who can validate patches

## Not a good fit yet

- No concrete schema change or migration event
- No access to repository snapshots or lineage evidence
- A request for autonomous production writes without review
- A regulated environment that requires certifications not currently held

## Start a conversation

Use the repository's **Pilot inquiry** issue form. Do not include credentials, private schemas, customer data, or confidential architecture in a public issue. The first step is a scope check using only non-sensitive information.

The delivery process and acceptance criteria are documented in [the pilot runbook](docs/pilot-delivery.md).
