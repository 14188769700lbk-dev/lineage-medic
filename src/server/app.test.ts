import { afterEach, describe, expect, it, vi } from "vitest";

import type { RunCampaignResponse } from "../shared/types.js";
import { buildServer } from "./app.js";

describe("server campaign mode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("preserves live MCP mode before a run and after reset", async () => {
    vi.stubEnv("LINEAGE_MEDIC_MODE", "mcp-stdio");
    const app = buildServer();

    try {
      const initial = await app.inject({ method: "GET", url: "/api/campaign" });
      expect(initial.statusCode).toBe(200);
      expect((initial.json() as RunCampaignResponse).campaign.execution).toMatchObject({
        contextMode: "mcp-stdio",
        contextLabel: "DataHub MCP stdio configured",
      });

      const reset = await app.inject({ method: "POST", url: "/api/campaign/reset" });
      expect(reset.statusCode).toBe(200);
      expect((reset.json() as RunCampaignResponse).campaign.execution).toMatchObject({
        contextMode: "mcp-stdio",
        contextLabel: "DataHub MCP stdio configured",
      });
    } finally {
      await app.close();
    }
  });

  it("rejects unsupported provider modes instead of silently treating them as live", () => {
    vi.stubEnv("LINEAGE_MEDIC_MODE", "typo");
    expect(() => buildServer()).toThrow(/Unsupported LINEAGE_MEDIC_MODE/);
  });
});
