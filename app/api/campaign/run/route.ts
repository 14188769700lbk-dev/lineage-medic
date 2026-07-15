import { createHostedReplayCampaign } from "../../../../src/server/fixtures/replay-campaign";

export function POST() {
  const campaign = createHostedReplayCampaign();
  return Response.json({
    campaign,
    message: `Hosted replay complete. ${campaign.patches.length} validated patches are ready for review.`,
  });
}
