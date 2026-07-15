import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { FixtureDataHubProvider } from "../adapters/fixture-datahub.js";
import { createDemoCampaign } from "../server/fixtures/demo-campaign.js";
import { resetRepairCampaign, runRepairCampaign } from "./repair-campaign.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function execute(approveWriteback = false) {
  const root = await mkdtemp(path.join(tmpdir(), "lineage-medic-test-"));
  tempRoots.push(root);
  const runRoot = path.join(root, "LM-204");
  const result = await runRepairCampaign(createDemoCampaign(), {
    provider: new FixtureDataHubProvider(),
    sourceRoot: path.resolve(process.cwd(), "examples/repos"),
    runRoot,
    approveWriteback,
    now: () => new Date("2026-07-15T09:42:20.000Z"),
  });
  return { result, runRoot };
}

describe("repair campaign", () => {
  it("modifies copied repositories and produces a validated campaign", async () => {
    const { result, runRoot } = await execute();

    expect(result.status).toBe("ready-for-review");
    expect(result.patches).toHaveLength(4);
    expect(result.validations.every((check) => check.status === "passed")).toBe(
      true,
    );
    expect(result.writeback.status).toBe("planned");
    expect(result.execution.writebackPersisted).toBe(false);

    const producer = await readFile(
      path.join(
        runRoot,
        "workspace/fiction-retail/warehouse/models/core/orders.sql",
      ),
      "utf8",
    );
    const fulfillment = await readFile(
      path.join(
        runRoot,
        "workspace/fiction-retail/fulfillment-analytics/models/marts/shipping_performance.sql",
      ),
      "utf8",
    );
    const finance = await readFile(
      path.join(
        runRoot,
        "workspace/fiction-retail/finance-metrics/models/revenue/revenue_by_market.sql",
      ),
      "utf8",
    );
    const manifest = JSON.parse(
      await readFile(path.join(runRoot, "run-manifest.json"), "utf8"),
    ) as { patches: unknown[] };

    expect(producer).toContain("shipping_country as shipping_country");
    expect(producer).toContain("as country_code");
    expect(fulfillment).not.toContain("shipping_country");
    expect(fulfillment).toContain("group by country_code");
    expect(finance).toContain("country_code as shipping_country");
    expect(manifest.patches).toHaveLength(4);
  });

  it("records the real MCP tool contract even when replaying a fixture", async () => {
    const { result } = await execute();

    expect(result.evidence.some((event) => event.tool === "get_lineage")).toBe(
      true,
    );
    expect(
      result.evidence.some((event) => event.tool === "get_dataset_queries"),
    ).toBe(true);
    expect(result.execution.contextLabel).toContain("Recorded");
  });

  it("cannot persist a fixture writeback even when approval is supplied", async () => {
    const { result } = await execute(true);

    expect(result.writeback.status).toBe("planned");
    expect(result.execution.writebackPersisted).toBe(false);
    expect(result.evidence.at(-1)?.action).toBe("Staged DataHub writeback package");
  });

  it("resets generated work without losing the detected change", async () => {
    const { result: completed } = await execute();
    const reset = resetRepairCampaign(completed);

    expect(reset.status).toBe("change-detected");
    expect(reset.patches).toHaveLength(0);
    expect(reset.evidence).toHaveLength(1);
    expect(reset.change.field).toBe("shipping_country");
    expect(reset.execution.manifestPath).toBeUndefined();
  });
});
