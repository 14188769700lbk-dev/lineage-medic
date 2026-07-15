import type { DataHubContextProvider } from "./context-provider.js";
import { executeRepairCampaign } from "./repair-engine.js";
import type { RepairCampaign } from "../shared/types.js";

export interface RunRepairCampaignOptions {
  provider: DataHubContextProvider;
  sourceRoot: string;
  runRoot: string;
  approveWriteback?: boolean;
  now?: () => Date;
}

export function runRepairCampaign(
  campaign: RepairCampaign,
  options: RunRepairCampaignOptions,
) {
  return executeRepairCampaign(campaign, options);
}

export function resetRepairCampaign(campaign: RepairCampaign): RepairCampaign {
  return {
    ...campaign,
    status: "change-detected",
    patches: [],
    validations: campaign.validations.map((check) => ({
      ...check,
      status: "pending",
      durationMs: undefined,
    })),
    evidence: campaign.evidence.slice(0, 1),
    writeback: {
      ...campaign.writeback,
      status: "pending",
    },
    execution: {
      ...campaign.execution,
      workspacePath: undefined,
      manifestPath: undefined,
      writebackPersisted: false,
    },
    summary: {
      ...campaign.summary,
      patches: 0,
    },
  };
}
