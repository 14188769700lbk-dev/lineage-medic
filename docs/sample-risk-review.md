# Sample schema-change risk review

**Campaign:** LM-204 — `orders.shipping_country → country_code`  
**Dataset:** Fiction Retail, synthetic  
**Purpose:** demonstrate the proposed USD 750 risk-review deliverable  
**Decision status:** proposed for human approval; not deployed

This is not a customer case study. Every asset, owner, query, and repository is synthetic. The underlying tool trace was captured against a self-hosted DataHub instance populated only with the public Fiction Retail scenario.

## Executive decision

Do not perform a flag-day rename. Introduce `country_code` at the producer, keep `shipping_country` as a temporary compatibility alias, migrate the internal fulfillment consumer, and preserve the public finance output name until its downstream contract is explicitly changed.

The proposed removal date for `shipping_country` is September 1, 2026. That date is a scenario input, not evidence that all consumers will be ready by then.

## Scope and evidence

| Evidence class | Result | Source |
| --- | --- | --- |
| Observed | DataHub column lineage returned five downstream assets across dbt, Airflow, Looker, and Power BI. | [`live-datahub-read-run.json`](../examples/evidence/live-datahub-read-run.json) |
| Observed | Six teams or stakeholder groups own the producer and downstream assets. | DataHub entity responses in the run manifest |
| Observed | One catalog-attached production query still selects `shipping_country`. | DataHub query evidence in the run manifest |
| Observed | Three lineage assets have repository/file bindings and directly use the changed field. | [`fiction-retail-datahub.json`](../examples/context/fiction-retail-datahub.json) |
| Observed | The Airflow job and two dashboards have no code binding in the supplied repository set. | Fixture bindings and entity metadata |
| Inferred | A direct producer rename could break the daily fulfillment model and the board-reporting output. | Lineage plus field-use evidence; requires owner confirmation |
| Proposed | Use producer compatibility, direct internal migration, and public-output preservation as three separate policies. | LineageMedic policy selection |

## Affected assets and disposition

| Asset | Owner | Evidence | Proposed disposition |
| --- | --- | --- | --- |
| `orders` | Retail Platform | Producer PR removes the current public field | Add `country_code`; retain deprecated `shipping_country` through the review window |
| `shipping_performance` | Fulfillment Analytics | Daily model groups by the legacy field | Migrate the internal model to `country_code` |
| `revenue_by_market` | Finance Data | Public mart exposes the legacy name to board reporting | Read `country_code` internally but continue publishing `shipping_country` |
| `fulfillment_daily` | Fulfillment Platform | Schedules the affected model before a 06:00 SLA | Confirm scheduling and rollback expectations; no code patch without a repository binding |
| `Delivery health` | Ops Leadership | 46 weekly viewers through the fulfillment model | Ask the owner to validate unchanged dashboard semantics after the model migration |
| `Global revenue pulse` | FP&A | Board-reporting asset with 19 weekly viewers | Preserve the current output contract and obtain explicit owner sign-off before a later rename |

## Draft repair package

The isolated repair step produced four review artifacts across three repository copies:

1. [`orders.sql`](../examples/generated/LM-204/fiction-retail/warehouse/models/core/orders.sql) adds the replacement field and the temporary compatibility alias.
2. [`orders.yml`](../examples/generated/LM-204/fiction-retail/warehouse/models/core/orders.yml) encodes both fields and the removal date in the dbt contract.
3. [`shipping_performance.sql`](../examples/generated/LM-204/fiction-retail/fulfillment-analytics/models/marts/shipping_performance.sql) migrates the internal consumer.
4. [`revenue_by_market.sql`](../examples/generated/LM-204/fiction-retail/finance-metrics/models/revenue/revenue_by_market.sql) changes the input while preserving the public output name.

## Validation evidence

| Gate | Result | What it proves | What it does not prove |
| --- | --- | --- | --- |
| SQL parse | PASS | Three modified SQL artifacts parse after deterministic dbt rendering. | Warehouse execution or performance |
| dbt reference resolution | PASS | Both `ref()` calls resolve across the copied projects. | Full production dependency completeness |
| Contract compatibility | PASS | Producer SQL and YAML expose both fields through the proposed window. | Consumer acceptance of the date |
| Lineage coverage | PASS | All three code-bound lineage assets received a repair. | Safety of the two dashboards or Airflow job without repository bindings |

## Blocking questions for owners

- Retail Platform: can both fields remain readable through September 1, including ingestion and warehouse retention behavior?
- Fulfillment Analytics: is the 06:00 SLA tested against the changed model and its rollback path?
- Finance Data and FP&A: is `shipping_country` a contractual public name, and what process authorizes its eventual removal?
- Ops Leadership: which dashboard checks establish that the semantic result is unchanged?

## Recommended sequence

1. Obtain owner answers and confirm or revise the removal window.
2. Merge the producer compatibility change and contract update together.
3. Validate both fields in the target warehouse using client-owned integration tests.
4. Migrate the internal fulfillment model and observe its scheduled run.
5. Keep the finance output stable while its consumers are inventoried.
6. Treat final removal as a separate campaign with new evidence and approval.

## Residual risk

The supplied lineage and repositories do not prove that every consumer is cataloged. Ad hoc SQL, exports, notebooks, and downstream systems outside DataHub remain possible. The report reduces uncertainty for the observed graph; it does not certify that the migration is outage-free.

## Acceptance checklist

- [ ] Technical owner confirms the asset inventory and missing-evidence list.
- [ ] Each named owner accepts or corrects the proposed disposition.
- [ ] Client-owned warehouse and integration tests pass.
- [ ] Removal date and rollback owner are recorded.
- [ ] Any draft pull request is separately authorized before publication.

The complete human-readable campaign decision is available in [`datahub-decision.md`](../examples/generated/LM-204/datahub-decision.md). The JSON run manifest remains the authoritative machine-readable trace.
