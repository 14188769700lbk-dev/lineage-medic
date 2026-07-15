import { createHostedReplayCampaign } from "../../../../src/server/fixtures/replay-campaign";

export function POST() {
  return Response.json({
    campaign: createHostedReplayCampaign(),
    message:
      "The hosted replay never writes to DataHub. Run the local live-MCP mode to approve save_document.",
  });
}
