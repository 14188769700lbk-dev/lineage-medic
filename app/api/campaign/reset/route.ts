import { createHostedInitialCampaign } from "../../../../src/server/fixtures/replay-campaign";

export function POST() {
  return Response.json({
    campaign: createHostedInitialCampaign(),
    message: "Hosted replay reset.",
  });
}
