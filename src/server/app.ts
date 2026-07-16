import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { existsSync } from "node:fs";
import path from "node:path";

import { FixtureDataHubProvider } from "../adapters/fixture-datahub.js";
import { McpDataHubProvider } from "../adapters/mcp-datahub.js";
import {
  resetRepairCampaign,
  runRepairCampaign,
} from "../core/repair-campaign.js";
import type {
  ContextMode,
  RepairCampaign,
  RunCampaignResponse,
} from "../shared/types.js";
import { createDemoCampaign } from "./fixtures/demo-campaign.js";

function parseMode(value: string | undefined): ContextMode {
  const mode = value ?? "fixture";
  if (mode === "fixture" || mode === "mcp-http" || mode === "mcp-stdio") {
    return mode;
  }

  throw new Error(
    `Unsupported LINEAGE_MEDIC_MODE "${mode}". Expected fixture, mcp-http, or mcp-stdio.`,
  );
}

function createInitialCampaign(mode: ContextMode): RepairCampaign {
  const campaign = createDemoCampaign();
  if (mode === "fixture") return campaign;

  return {
    ...campaign,
    execution: {
      ...campaign.execution,
      contextMode: mode,
      contextLabel: `DataHub MCP ${mode === "mcp-http" ? "HTTP" : "stdio"} configured`,
    },
  };
}

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  const mode = parseMode(process.env.LINEAGE_MEDIC_MODE);
  let campaign = createInitialCampaign(mode);
  const provider =
    mode === "fixture"
      ? new FixtureDataHubProvider()
      : new McpDataHubProvider({
          url: process.env.DATAHUB_MCP_URL,
          token:
            process.env.DATAHUB_MCP_TOKEN ??
            process.env.DATAHUB_GMS_TOKEN ??
            process.env.DATAHUB_TOKEN,
          gmsUrl: process.env.DATAHUB_GMS_URL,
          command: process.env.DATAHUB_MCP_COMMAND,
        });
  const campaignOptions = (approveWriteback: boolean) => ({
    provider,
    sourceRoot:
      process.env.LINEAGE_MEDIC_SOURCE_ROOT ??
      path.resolve(process.cwd(), "examples/repos"),
    runRoot: path.resolve(
      process.cwd(),
      ".lineage-medic/runs",
      campaign.id,
    ),
    approveWriteback,
  });

  app.register(cors, {
    origin: true,
  });

  app.get("/api/health", async () => ({
    ok: true,
    service: "lineage-medic",
    mode,
  }));

  app.get("/api/campaign", async (): Promise<RunCampaignResponse> => ({
    campaign,
    message: "Breaking change loaded from the Fiction Retail demo scenario.",
  }));

  app.post(
    "/api/campaign/run",
    async (): Promise<RunCampaignResponse> => {
      campaign = await runRepairCampaign(campaign, campaignOptions(false));

      return {
        campaign,
        message: `Repair campaign complete. ${campaign.patches.length} validated patches are ready for review.`,
      };
    },
  );

  app.post(
    "/api/campaign/writeback",
    async (_request, reply): Promise<RunCampaignResponse | void> => {
      if (campaign.status !== "ready-for-review") {
        await reply.code(409).send({
          error: "Run and validate the repair campaign before approving writeback.",
        });
        return;
      }

      campaign = await runRepairCampaign(campaign, campaignOptions(true));
      return {
        campaign,
        message: campaign.execution.writebackPersisted
          ? "Migration decision saved to DataHub."
          : "Writeback approval recorded, but this provider cannot persist.",
      };
    },
  );

  app.post("/api/campaign/reset", async (): Promise<RunCampaignResponse> => {
    campaign = resetRepairCampaign(createInitialCampaign(mode));

    return {
      campaign,
      message: "Demo campaign reset.",
    };
  });

  const distPath = path.resolve(process.cwd(), "dist");

  if (existsSync(distPath)) {
    app.register(fastifyStatic, {
      root: distPath,
    });

    app.setNotFoundHandler((request, reply) => {
      if (request.raw.url?.startsWith("/api/")) {
        return reply.code(404).send({ error: "Not found" });
      }

      return reply.sendFile("index.html");
    });
  }

  return app;
}
