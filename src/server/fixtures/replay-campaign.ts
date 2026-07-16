import type {
  EvidenceEvent,
  PatchArtifact,
  RepairCampaign,
  ValidationCheck,
} from "../../shared/types.js";
import { createDemoCampaign } from "./demo-campaign.js";

const patches: PatchArtifact[] = [
  {
    id: "patch-producer-shim",
    repository: "fiction-retail/warehouse",
    file: "models/core/orders.sql",
    title: "Keep a producer compatibility alias",
    rationale:
      "Column lineage still contains active consumers. Expose country_code now, but retain shipping_country through 2026-09-01.",
    before: `-- Proposed output in warehouse PR #204: shipping_country -> country_code.
select
  order_id,
  customer_id,
  upper(shipping_country) as country_code,
  total_amount,
  delivery_days
from {{ source('retail', 'orders') }}
`,
    after: `-- Proposed output in warehouse PR #204: shipping_country -> country_code.
select
  order_id,
  customer_id,
  upper(shipping_country) as country_code,
  shipping_country as shipping_country, -- compatibility until 2026-09-01
  total_amount,
  delivery_days
from {{ source('retail', 'orders') }}
`,
    status: "validated",
  },
  {
    id: "patch-contract",
    repository: "fiction-retail/warehouse",
    file: "models/core/orders.yml",
    title: "Encode the compatibility window in the dbt contract",
    rationale:
      "The producer contract exposes the replacement field while explicitly deprecating the legacy field, preventing an accidental early removal.",
    before: `version: 2

models:
  - name: orders
    description: Curated retail orders used by fulfillment and finance.
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: integer
        data_tests: [not_null, unique]
      - name: customer_id
        data_type: integer
      - name: shipping_country
        data_type: text
      - name: total_amount
        data_type: numeric
      - name: delivery_days
        data_type: integer
`,
    after: `version: 2
models:
  - name: orders
    description: Curated retail orders used by fulfillment and finance.
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: integer
        data_tests:
          - not_null
          - unique
      - name: customer_id
        data_type: integer
      - name: country_code
        data_type: text
        data_tests:
          - not_null
      - name: shipping_country
        data_type: text
        meta:
          lifecycle: deprecated
          remove_after: 2026-09-01
      - name: total_amount
        data_type: numeric
      - name: delivery_days
        data_type: integer
`,
    status: "validated",
  },
  {
    id: "patch-migrate-shipping-performance",
    repository: "fiction-retail/fulfillment-analytics",
    file: "models/marts/shipping_performance.sql",
    title: "Move shipping_performance to country_code",
    rationale: "GROUP BY shipping_country in a daily production model",
    before: `select
  shipping_country,
  avg(delivery_days) as avg_delivery_days,
  count(*) as order_count
from {{ ref('orders') }}
group by shipping_country
`,
    after: `select
  country_code,
  avg(delivery_days) as avg_delivery_days,
  count(*) as order_count
from {{ ref('orders') }}
group by country_code
`,
    status: "validated",
  },
  {
    id: "patch-preserve-revenue-by-market",
    repository: "fiction-retail/finance-metrics",
    file: "models/revenue/revenue_by_market.sql",
    title: "Migrate the input without breaking the public output",
    rationale:
      "The finance mart is board-reporting input. Read country_code while preserving shipping_country as its published output.",
    before: `-- The public output name is consumed by board reporting and must not change yet.
select
  shipping_country,
  sum(total_amount) as gross_revenue
from {{ ref('orders') }}
group by 1
`,
    after: `-- The public output name is consumed by board reporting and must not change yet.
select
  country_code as shipping_country,
  sum(total_amount) as gross_revenue
from {{ ref('orders') }}
group by 1
`,
    status: "validated",
  },
];

const validations: ValidationCheck[] = [
  {
    id: "sql-parse",
    label: "SQL parse",
    detail: "3 modified SQL artifacts parse after deterministic dbt rendering",
    status: "passed",
    durationMs: 9,
  },
  {
    id: "dbt-refs",
    label: "dbt ref resolution",
    detail: "2 ref() calls resolve across the three copied projects",
    status: "passed",
    durationMs: 2,
  },
  {
    id: "contract-check",
    label: "Contract compatibility",
    detail: "Producer and dbt contract expose both fields through the removal window",
    status: "passed",
    durationMs: 1,
  },
  {
    id: "lineage-coverage",
    label: "Lineage coverage",
    detail: "3/3 code-bound lineage assets have a generated repair",
    status: "passed",
    durationMs: 1,
  },
];

const evidence: EvidenceEvent[] = [
  {
    id: "event-detect",
    at: "2026-07-15T09:42:00.000Z",
    actor: "Git",
    action: "Breaking rename detected",
    detail: "orders.shipping_country → country_code in warehouse PR #204",
    status: "complete",
  },
  {
    id: "event-context-get_lineage",
    at: "2026-07-15T09:42:02.000Z",
    actor: "DataHub MCP",
    action: "get_lineage captured",
    detail: "Live self-hosted response matched 5 downstream assets across four platforms",
    tool: "get_lineage",
    status: "complete",
  },
  {
    id: "event-context-get_entities",
    at: "2026-07-15T09:42:04.000Z",
    actor: "DataHub MCP",
    action: "get_entities captured",
    detail: "Live self-hosted response resolved metadata for all 6 assets",
    tool: "get_entities",
    status: "complete",
  },
  {
    id: "event-context-get_dataset_queries",
    at: "2026-07-15T09:42:06.000Z",
    actor: "DataHub MCP",
    action: "get_dataset_queries captured",
    detail: "Live self-hosted response returned observed SQL for the renamed field",
    tool: "get_dataset_queries",
    status: "complete",
  },
  {
    id: "event-plan",
    at: "2026-07-15T09:42:08.000Z",
    actor: "LineageMedic",
    action: "Planned a compatibility-window migration",
    detail: "Producer shim, consumer migrations and contract deprecation ordered by lineage",
    status: "complete",
  },
  {
    id: "event-patch",
    at: "2026-07-15T09:42:10.000Z",
    actor: "Git",
    action: "Modified copied repositories",
    detail: "Four reviewable file patches generated across three repositories",
    status: "complete",
  },
  {
    id: "event-validate",
    at: "2026-07-15T09:42:12.000Z",
    actor: "Validator",
    action: "Executed deterministic validation",
    detail: "SQL parsing, dbt ref resolution, contract and lineage coverage checks completed",
    status: "complete",
  },
  {
    id: "event-writeback",
    at: "2026-07-15T09:42:14.000Z",
    actor: "DataHub MCP",
    action: "Staged DataHub writeback package",
    detail: "Recorded preview only; live save_document remains behind explicit approval",
    tool: "save_document",
    status: "complete",
  },
];

export function createHostedInitialCampaign(): RepairCampaign {
  const campaign = createDemoCampaign();
  return {
    ...campaign,
    execution: {
      ...campaign.execution,
      contextLabel: "Captured live DataHub MCP run · public replay",
    },
  };
}

export function createHostedReplayCampaign(): RepairCampaign {
  const campaign = createHostedInitialCampaign();
  return {
    ...campaign,
    status: "ready-for-review",
    patches: patches.map((patch) => ({ ...patch })),
    validations: validations.map((validation) => ({ ...validation })),
    evidence: evidence.map((event) => ({ ...event })),
    writeback: {
      ...campaign.writeback,
      documentUrn:
        "urn:li:document:lineage-medic-preview-migration-campaign-lm-204-orders-country-code",
      status: "planned",
    },
    summary: {
      ...campaign.summary,
      patches: patches.length,
    },
  };
}
