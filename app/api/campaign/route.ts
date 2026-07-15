import { createHostedInitialCampaign } from "../../../src/server/fixtures/replay-campaign";

export function GET() {
  return Response.json({
    campaign: createHostedInitialCampaign(),
    message: "Breaking change loaded from the recorded Fiction Retail scenario.",
  });
}
