import path from "node:path";

import { FixtureDataHubProvider } from "./adapters/fixture-datahub.js";
import { runRepairCampaign } from "./core/repair-campaign.js";
import { createDemoCampaign } from "./server/fixtures/demo-campaign.js";

const campaign = await runRepairCampaign(createDemoCampaign(), {
  provider: new FixtureDataHubProvider(),
  sourceRoot: path.resolve(process.cwd(), "examples/repos"),
  runRoot: path.resolve(process.cwd(), ".lineage-medic/runs/LM-204"),
});

const failed = campaign.validations.filter((check) => check.status === "failed");

console.log(`\nLineageMedic ${campaign.id}`);
console.log(`Context:     ${campaign.execution.contextLabel}`);
console.log(`Assets:      ${campaign.summary.affectedAssets}`);
console.log(`Repositories:${campaign.summary.repositories.toString().padStart(3)}`);
console.log(`Patches:     ${campaign.summary.patches}`);
for (const check of campaign.validations) {
  const marker = check.status === "passed" ? "PASS" : "FAIL";
  console.log(`  ${marker.padEnd(4)}  ${check.label}: ${check.detail}`);
}
console.log(`Manifest:    ${campaign.execution.manifestPath}`);
console.log(`Workspace:   ${campaign.execution.workspacePath}`);
console.log(
  `Writeback:   ${campaign.writeback.status} (${campaign.execution.writebackPersisted ? "DataHub" : "approval required"})\n`,
);

if (failed.length > 0) process.exitCode = 1;
