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

1. Run a DataHub instance and create a personal access token.
2. Install [`uv`](https://docs.astral.sh/uv/).
3. Set:

   ```bash
   LINEAGE_MEDIC_MODE=mcp-stdio
   DATAHUB_GMS_URL=http://localhost:8080
   DATAHUB_GMS_TOKEN=your_token
   DATAHUB_MCP_COMMAND=uvx
   ```

4. Start LineageMedic. It launches `uvx mcp-server-datahub@latest` and communicates over stdio.

## Required catalog shape

The included repository map expects these URNs:

- `urn:li:dataset:(urn:li:dataPlatform:dbt,fiction_retail.orders,PROD)`
- `urn:li:dataset:(urn:li:dataPlatform:dbt,fulfillment.shipping_performance,PROD)`
- `urn:li:dataset:(urn:li:dataPlatform:dbt,finance.revenue_by_market,PROD)`
- the Airflow job and two dashboard URNs recorded in the fixture

For the final hackathon recording, these assets will be loaded from the Fiction Retail demo and the live raw MCP responses will be retained as submission evidence.

## Mutation behavior

DataHub's own `save_document` tool instructs clients to confirm before saving. LineageMedic mirrors that requirement:

- normal campaign execution calls only read tools;
- fixture mode cannot persist even if approval is supplied;
- live persistence requires the separate **Approve DataHub writeback** action after validation;
- the manifest records whether persistence happened and the returned document URN.

Never commit `.env`, tokens, or tenant-specific exports containing private metadata.
