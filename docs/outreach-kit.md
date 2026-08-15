# Outreach kit

Every message below is grounded in public evidence. Replace bracketed fields with verified facts; do not invent experience, customers, certifications, location, or availability.

## Positioning sentence

> I built LineageMedic, an open-source DataHub and dbt repair workflow that traces a breaking schema change, drafts contract-aware SQL/YAML repairs across repositories, and keeps every external mutation behind human approval.

## Upwork proposal — dbt migration or governance work

> Hi [name] — your requirement around [exact requirement from the post] matches a workflow I have already built and made publicly inspectable. LineageMedic takes a proposed schema change, traces downstream impact, drafts repository-specific dbt/SQL repairs, and validates parser, ref, contract, and coverage gates before review.
>
> Relevant proof: the hosted replay, a four-file repair PR, and a sanitized DataHub MCP trace are linked at https://github.com/14188769700lbk-dev/lineage-medic.
>
> For this engagement I would start with [one concrete first milestone], deliver [specific artifact], and explicitly exclude production writes until you approve the result. If that approach fits, I can turn your first representative change into a fixed-scope assessment before estimating the wider migration.

Do not add years of experience, client names, revenue, or certifications unless the account owner can verify them.

## Direct message — data platform lead

> I noticed [company/team] is working on [verified migration or catalog signal]. I built an open-source workflow for the risky part of schema changes: tracing DataHub lineage, choosing compatibility policy per consumer, and producing validated repair drafts across repositories. The public demo and generated PR are here: https://github.com/14188769700lbk-dev/lineage-medic.
>
> I am testing a five-day, read-only schema-change risk review. It needs only one representative change and sanitized metadata/repository snapshots; no production write access. Is reducing coordination risk for an upcoming migration relevant to your team this quarter?

## Community post — educational, not disguised solicitation

> I built a reproducible example of treating column lineage as a repair plan rather than only a diagram. One `shipping_country → country_code` proposal becomes three different policies: producer compatibility, direct internal migration, and public-output preservation. The repo includes the MCP evidence, generated PR, validators, and explicit writeback gate. I would value technical feedback on the contract policy and coverage checks: https://github.com/14188769700lbk-dev/lineage-medic.

Use this only where project sharing is permitted. Do not post the same copy repeatedly or hide the commercial connection.

## Discovery-call structure

1. Ask for the next concrete breaking change, not a generic platform wish list.
2. Quantify repositories, owners, review steps, and historical failures.
3. Identify the buyer and acceptance authority.
4. Confirm whether sanitized exports and read-only access are possible.
5. Offer the smallest paid scope that can prove or disprove value.

## Objection responses

**“Why not global search and replace?”**

Search finds matching text but does not determine whether a public output must stay compatible, whether a transitive asset has no repository binding, or whether every code-bound consumer received a repair.

**“Why should we trust generated code?”**

You should not trust it by default. The pilot works on isolated copies, retains full patches and evidence, runs deterministic gates, and requires human review before any external write.

**“Can you guarantee no outage?”**

No. The service reduces a defined class of migration risk and makes gaps visible; the client still owns integration tests, deployment controls, and production approval.
