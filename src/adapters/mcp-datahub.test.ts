import { describe, expect, it } from "vitest";

import { normalizeDatasetQueries } from "./mcp-datahub.js";

describe("normalizeDatasetQueries", () => {
  it("normalizes live MCP query results into repair evidence", () => {
    const recordedAt = "2026-07-16T04:00:00.000Z";
    const result = normalizeDatasetQueries(
      {
        total: 1,
        queries: [
          {
            properties: {
              source: "SYSTEM",
              statement: {
                value: "select shipping_country, count(*) from analytics.orders group by 1",
              },
            },
            subjects: [
              "urn:li:dataset:(urn:li:dataPlatform:dbt,fiction_retail.orders,PROD)",
            ],
          },
        ],
      },
      recordedAt,
    );

    expect(result).toEqual([
      {
        assetUrn:
          "urn:li:dataset:(urn:li:dataPlatform:dbt,fiction_retail.orders,PROD)",
        sql: "select shipping_country, count(*) from analytics.orders group by 1",
        source: "SYSTEM",
        lastSeenAt: recordedAt,
      },
    ]);
  });

  it("returns no evidence for an empty DataHub response", () => {
    expect(
      normalizeDatasetQueries(
        { start: 0, total: 0, count: 20 },
        "2026-07-16T04:00:00.000Z",
      ),
    ).toEqual([]);
  });
});
