# Live DataHub setup

The public demo defaults to fixture mode so every judge can reproduce it without credentials. Live mode uses the same repair engine and swaps only the context provider.

## DataHub Cloud

1. Create a personal access token with read access to the demo assets.
2. Set:

   ```bash
   LINEAGE_MEDIC_MODE=mcp-http
   DATAHUB_MCP_URL=https://your-tenant.acryl.io/integrations/ai/mcp/
   DATAHUB_MCP_TOKEN=your_token
   ```

3. Start with `npm run dev`.
4. Run the campaign. Read-only MCP calls execute immediately; `save_document` remains staged unless the request separately supplies explicit writeback approval.

## Self-hosted DataHub

1. Run a DataHub Quickstart instance and create a personal access token.
2. Install [`uv`](https://docs.astral.sh/uv/).
3. Seed the six-asset Fiction Retail graph and observed query evidence:

   ```bash
   python scripts/seed-fiction-retail.py
   ```

4. Set:

   ```bash
   LINEAGE_MEDIC_MODE=mcp-stdio
   DATAHUB_GMS_URL=http://localhost:8080
   DATAHUB_GMS_TOKEN=your_token
   DATAHUB_MCP_COMMAND=uvx
   ```

5. Start LineageMedic. It launches `uvx mcp-server-datahub@latest` and communicates over stdio.

## Required catalog shape

The included repository map expects these URNs:

- `urn:li:dataset:(urn:li:dataPlatform:dbt,fiction_retail.orders,PROD)`
- `urn:li:dataset:(urn:li:dataPlatform:dbt,fulfillment.shipping_performance,PROD)`
- `urn:li:dataset:(urn:li:dataPlatform:dbt,finance.revenue_by_market,PROD)`
- the Airflow job and two dashboard URNs recorded in the fixture

The seed also creates three DataHub Query entities, including a schema-field subject for `shipping_country`, so the official `get_dataset_queries` MCP tool returns real catalog evidence instead of a fixture fallback.

The sanitized capture from the verified self-hosted read run is checked in at [`examples/evidence/live-datahub-read-run.json`](../examples/evidence/live-datahub-read-run.json). It records the raw lineage, entity, and query responses plus the generated patches and validators, without credentials or machine-specific paths. The later approval-gated write is recorded separately in [`examples/evidence/live-datahub-writeback.json`](../examples/evidence/live-datahub-writeback.json), preserving the distinction between read execution and external mutation.

## Mutation behavior

DataHub's own `save_document` tool instructs clients to confirm before saving. LineageMedic mirrors that requirement:

- normal campaign execution calls only read tools;
- fixture mode cannot persist even if approval is supplied;
- live persistence requires the separate **Approve DataHub writeback** action after validation;
- the manifest records whether persistence happened and the returned document URN.

Never commit `.env`, tokens, or tenant-specific exports containing private metadata.
