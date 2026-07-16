# Generated campaign LM-204

These files are the exact review artifacts produced by a verified live self-hosted DataHub MCP run for the `shipping_country → country_code` migration.

## Producer repository

- [`orders.sql`](fiction-retail/warehouse/models/core/orders.sql) introduces `country_code` while retaining a temporary `shipping_country` compatibility alias.
- [`orders.yml`](fiction-retail/warehouse/models/core/orders.yml) adds the replacement field and marks the legacy field for removal after `2026-09-01`.

## Consumer repositories

- [`shipping_performance.sql`](fiction-retail/fulfillment-analytics/models/marts/shipping_performance.sql) migrates an internal fulfillment model directly to `country_code`.
- [`revenue_by_market.sql`](fiction-retail/finance-metrics/models/revenue/revenue_by_market.sql) reads `country_code` while preserving the public `shipping_country` output used by board reporting.

## Durable context

- [`datahub-decision.md`](datahub-decision.md) is the human-readable Decision staged for DataHub `save_document`.
- [`live-datahub-read-run.json`](../../evidence/live-datahub-read-run.json) contains full before/after patches, live MCP responses, tool arguments, and validation evidence.

Reproduce the artifacts with `npm ci && npm run demo`. The command writes to an isolated `.lineage-medic/runs/LM-204/` workspace and does not modify source examples.
