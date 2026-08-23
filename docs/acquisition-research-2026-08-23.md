# Acquisition operating view — 2026-08-23

This document supersedes the August 21 snapshot. It separates verified facts, engineering judgment, and actions that still require account-owner confirmation.

## What changed

The earlier decision treated All Things Agentic as requiring a rushed new build. That premise was incomplete. The separate public ChangeFleet repository has a recorded first commit on 2026-08-16, inside the official August 3–31 build period, and already contains a Google ADK five-agent workflow, a Gemini 3.5 model configuration, FastAPI, React, a Dockerfile, tests, and Cloud Run instructions.

This makes ChangeFleet a real candidate rather than a hypothetical greenfield project. It does not make the entry submission-ready: there is still no verified live Gemini call, Google Cloud deployment, public video, or Devpost submission.

## Execution order

| Order | Opportunity | Confirmed current state | Decision |
| --- | --- | --- | --- |
| 1 | Restore LineageMedic inquiry intake | External GitHub issue creation is enabled and the public issues URL returns HTTP 200 | Observe whether real, qualified inquiries arrive; do not treat configuration repair as demand |
| 2 | ChangeFleet → All Things Agentic | Eligible recorded build timing; 7 backend tests, official-registry frontend install/builds, safety verifier, secret/history scan, and the public fixture demo pass | Obtain verifiable event-registration evidence, request credits before the earlier deadline, then deploy to Cloud Run and record truthful live proof |
| 3 | ClauseTrace → DevNetwork Nutrient + SerpApi | Real provider acceptance exists; repo, screenshots, a verified local 3:26 video, and the public Pages demo exist | Authorize public video and final Devpost submission only after the remaining claims are independently verified |
| 4 | Agents for Humans | Strong technical fit, but a new AWS account can require payment-method and phone verification | Keep as watchlist unless an already usable AWS account exists |

The first item is a conversion repair, not evidence of demand. The second and third are prize attempts, not revenue.

## All Things Agentic facts

- Submission deadline: 2026-08-31 17:00 Pacific Time, or 2026-09-01 08:00 China Standard Time.
- Event-credit request deadline: 2026-08-28 12:00 Pacific Time, or 2026-08-29 03:00 China Standard Time, while supplies last.
- Cash pool: USD 180,000.
- Relevant special prizes include two USD 10,000 Individual/Hobbyist awards and two USD 5,000 Best Architectural Design awards.
- Every entry must use Gemini 3.5 or newer, a listed Google agent framework, and Google Cloud infrastructure.
- The public YouTube or Vimeo video must be no longer than four minutes and must visibly prove the backend ran on Google Cloud.
- Official sources: https://allthingsagentichackathon.devpost.com/ and https://allthingsagentichackathon.devpost.com/rules

## Category judgment

Taskmaster is the honest category for ChangeFleet today. It is a complete autonomous workflow, not a chat loop. Fortified Enterprise Fleet would currently overstate the implementation because ChangeFleet does not yet demonstrate the registry, long-running memory, agent identity, gateway, Model Armor, and observability capabilities described for that category.

This is an engineering recommendation, not an organizer ruling.

## Paid open-source bounty screen

A 2026-08-23 screen of Algora, IssueHunt, Opire, and recent GitHub bounty-labelled issues did not produce a candidate that met all of the operating gates: an open underlying issue, maintainer-backed acceptance and payout terms, fewer than three active claimants, a TypeScript/Python fit without paid API or specialist hardware dependencies, and a payout route verified for the developer's location.

- Algora still listed the calcom/font/sans issue #2 as open even though the underlying GitHub issue was closed.
- IssueHunt surfaced funded issues that were closed or several years stale.
- Opire's public rewards feed was materially unreliable as a work queue. It showed a closed, explicitly `zero-bounty` MisakaNet issue as USD 1,500. Among the four TypeScript/Python/JavaScript/Shell entries with no more than two listed claimants, the MisakaNet and restfuncs issues were closed, the electron-template repository returned 404, and the pixelsocial issue returned GitHub 410 (deleted).
- Two recent Tenstorrent issues mentioned USD 750 and USD 1,500 in their titles/bodies, but they were opened by a non-member who said they already had the fix, had competing attempts, and contained no verified maintainer payout commitment.
- Opire's terms say payouts are transferred to a developer's Stripe account. Stripe's published Connect account country list includes Hong Kong SAR and Macao SAR but not mainland China. Unless the developer has a lawful supported-country Stripe setup, the payout path is unverified.

Decision: do not spend implementation time or post claims/PRs for this batch. Re-screen only when a primary source satisfies every gate above. This is a rejection of the current candidates, not a claim that paid open-source work never exists.

Primary references: https://algora.io/cal/bounties?status=open, https://github.com/calcom/sans/issues/2, https://app.opire.dev/home, https://opire.dev/terms-of-service, https://github.com/Ikalus1988/MisakaNet/issues/932, https://github.com/bogeeee/restfuncs/issues/6, https://github.com/Tenstorrent/tt-metal/issues/54055, https://github.com/Tenstorrent/tt-metal/issues/54054, and https://docs.stripe.com/connect/how-connect-works.

## Mobile monetization route screened on 2026-08-23

RevenueCat Shipaton 2026 is a credible second-phase opportunity, not an immediate replacement for the two nearly complete submissions above.

- Official deadline: 2026-09-30 23:45 Pacific Time. The official rules list USD 740,000 in cash prizes and do not name mainland China among the excluded locations.
- A non-student entry must be a new iOS, iPadOS, macOS, or Android app first published during the event on Apple App Store, Google Play, or Galaxy Store. It must integrate RevenueCat for at least one real in-app purchase or RevenueCat Ads, provide a public under-two-minute video, and remain downloadable in the United States for judging.
- Google officially supports developer and merchant registration in China, but a new personal Play account requires a USD 25 registration fee, government identity and address verification, access to an Android device, and a closed test with at least 12 opted-in testers continuously for 14 days before production access.
- Galaxy Store has no sign-up or annual publishing fee, but even free apps require commercial seller status. Samsung requires identity and financial verification, says approval and international bank verification can take several business days, and states that seller name, phone number, address, support email, and privacy-policy URL are shown on the public app details page.
- RevenueCat's rules allow monetary prizes to be paid electronically to the entrant's bank account after identity and eligibility verification, with the entrant responsible for tax, foreign-exchange, and bank compliance.

Decision: keep Shipaton as a conditional September build. Do not create the Google Play, Samsung Seller, or RevenueCat accounts, pay a fee, submit identity or bank documents, recruit testers, or publish an app without action-time owner confirmation. The immediate expected-value order remains ChangeFleet / All Things Agentic, then ClauseTrace / DevNetwork, because their code and evidence already exist and their deadlines arrive first.

TikTok TechJam 2026 was rejected. Its official page restricts entry to college students in specified countries. The developer has confirmed being a solo independent developer but has not claimed student status, so eligibility cannot be assumed.

Primary references: https://revenuecat-shipaton-2026.devpost.com/rules, https://support.google.com/googleplay/android-developer/answer/9306917, https://support.google.com/googleplay/android-developer/answer/15633622?co=GENIE.CountryCode%3DCN, https://support.google.com/googleplay/android-developer/answer/14151465, https://developer.samsung.com/galaxy-store/prepare.html, https://developer.samsung.com/galaxy-store/faq.html, and https://tiktoktechjam2026.devpost.com/.

## External action gates

The owner authorized items 1–3 on 2026-08-23, with an explicit stop condition for payment, phone, CAPTCHA, identity, verification-code, and recovery-credential prompts. Current execution state:

1. External GitHub issue creation is enabled for LineageMedic; the public issues URL returns HTTP 200.
2. ClauseTrace Pages and ChangeFleet Pages are enabled with GitHub Actions. Both deployments completed successfully and both public URLs return HTTP 200: https://14188769700lbk-dev.github.io/claustrace/ and https://14188769700lbk-dev.github.io/changefleet/.
3. All Things Agentic registration is verified: the signed-in account can access the event-specific “My hackathon projects” page, which shows “Start a Project” and “Create project.” No Devpost project has been created or submitted. Google Cloud project creation is paused at first-use account onboarding: the page requires an account country/region and acceptance of the current terms before a project can be created. No cloud project or credit request has been verified.
4. Upload public videos and make final Devpost submissions only after the live URLs and claims have been independently verified.

## Current funnel truth

As of this snapshot:

- prize money received: USD 0;
- paid inquiries: 0;
- paying customers: 0;
- recognized revenue: USD 0.

LineageMedic has a public product, a scoped offer, a downloadable sample, and an open issue-intake path. ChangeFleet and ClauseTrace have public fixture demos. None of those facts proves demand, a customer, a prize, or revenue.
