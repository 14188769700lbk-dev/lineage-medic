# Migration campaign LM-204: orders country code

## Decision

Migrate `shipping_country` to `country_code` using a compatibility window instead of a flag-day rename.

## Evidence

- DataHub column lineage identified 5 downstream assets.
- 1 production query example still references the legacy field.
- Owners span 6 teams or stakeholder groups.

## Repair artifacts

- `fiction-retail/warehouse/models/core/orders.sql`: Keep a producer compatibility alias
- `fiction-retail/warehouse/models/core/orders.yml`: Encode the compatibility window in the dbt contract
- `fiction-retail/fulfillment-analytics/models/marts/shipping_performance.sql`: Move shipping_performance to country_code
- `fiction-retail/finance-metrics/models/revenue/revenue_by_market.sql`: Migrate the input without breaking the public output

## Validation

- PASS: SQL parse — 3 modified SQL artifacts parse after deterministic dbt rendering
- PASS: dbt ref resolution — 2 ref() calls resolve across the three copied projects
- PASS: Contract compatibility — Producer and dbt contract expose both fields through the removal window
- PASS: Lineage coverage — 3/3 code-bound lineage assets have a generated repair

## Lifecycle

Deprecate shipping_country after 2026-09-01
