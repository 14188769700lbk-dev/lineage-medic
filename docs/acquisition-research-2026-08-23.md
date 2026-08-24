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
| 5 | AI Builders Hackathon | The full rules admit individual developers worldwide and the build window runs 2026-08-21 through 2026-09-15, but the public eligibility tag still says students only and the rules list prizes as TBD while the overview advertises a cash award and service credits | Do not register or start another build until the organizer resolves the eligibility and prize contradictions; it does not outrank the two nearly complete entries |

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
- Opire also showed USD 590 for TypeORM issue #3357. The underlying issue is open, but a maintainer pinned a 2026-06-06 notice saying the project is not accepting community PRs for that issue and will close AI-generated attempts. The bounty listing is therefore not authorization to work on the issue and is not an executable earning route.
- Two recent Tenstorrent issues mentioned USD 750 and USD 1,500 in their titles/bodies, but they were opened by a non-member who said they already had the fix, had competing attempts, and contained no verified maintainer payout commitment.
- Opire's terms say payouts are transferred to a developer's Stripe account. Stripe's published Connect account country list includes Hong Kong SAR and Macao SAR but not mainland China. Unless the developer has a lawful supported-country Stripe setup, the payout path is unverified.

Decision: do not spend implementation time or post claims/PRs for this batch. Re-screen only when a primary source satisfies every gate above. This is a rejection of the current candidates, not a claim that paid open-source work never exists.

Primary references: https://algora.io/cal/bounties?status=open, https://github.com/calcom/sans/issues/2, https://app.opire.dev/home, https://app.opire.dev/issues/01HWJNZ5HQMVG2TCW6XHQQJ3QT, https://github.com/typeorm/typeorm/issues/3357, https://opire.dev/terms-of-service, https://github.com/Ikalus1988/MisakaNet/issues/932, https://github.com/bogeeee/restfuncs/issues/6, https://github.com/Tenstorrent/tt-metal/issues/54055, https://github.com/Tenstorrent/tt-metal/issues/54054, and https://docs.stripe.com/connect/how-connect-works.

## Additional live-event screen — 2026-08-23

No newly screened event displaced ChangeFleet / All Things Agentic or ClauseTrace / DevNetwork in expected value and delivery readiness.

- **AI Builders Hackathon:** the full rules say individual software developers and startup founders worldwide are eligible, with new work required from 2026-08-21 through 2026-09-15. However, the public Devpost eligibility block says `Students only`; the rules say prizes are `TBD`; and the overview separately advertises a USD 4,000 cash award plus Tin Computer credits. Until the organizer resolves those contradictions, eligibility and actual prize terms are not strong enough to justify a fresh build.
- **Hyperbloom September** and **Prometheus September AI Challenge 2:** both official pages restrict participation to students. The owner has confirmed being an independent developer but has not claimed student status, so both are ineligible unless truthful student eligibility is separately established.
- **Galuxium Nexus V2:** its page asks visitors to ignore Devpost's student-only eligibility tag, moved the displayed deadline from August 31 to October 31, labels Backboard service credits as cash, requires winners to keep a USD 5/month Backboard account active, and describes the separate seed fund as discretionary. This is not a clean cash-prize opportunity and is rejected.
- **Agents for Humans:** still the strongest technical watchlist candidate after the current deadlines. It requires a newly created Strands Agents project, an AWS Builder ID, and an AWS account; Hong Kong is explicitly excluded, and the account/payment/phone path has not been verified for the owner's true residence. Do not register or create AWS resources until those facts and the current terms are confirmed.

Primary references: https://ai-builders-hackathon-2026.devpost.com/rules, https://ai-builders-hackathon-2026.devpost.com/, https://hyperbloom-september.devpost.com/, https://prometheus-september-ai-2.devpost.com/, https://galuxium-nexus-v2-29411.devpost.com/, https://agentsforhumans.devpost.com/, and https://agentsforhumans.devpost.com/details/faqs.

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

## Opportunity re-screen — 2026-08-24

The latest screen found one credible October watchlist event but no reason to divert from the two August/September entries already under construction.

- **Hack Apertus — retain as a qualified watchlist.** The official online stage runs 2026-10-01 through 2026-10-16, is open worldwide to people aged 18+, allows solo teams, and lists three genuine CHF 2,500 cash awards (displayed as approximately EUR 2,670 each). Only 44 participants were shown when checked. The best current fit is the Red-Teaming track: a new, open evaluation harness could test Apertus for unsupported schema-migration claims, evidence gaps, and multilingual enterprise-workflow hallucinations. This is a concept, not an organizer-approved scope. Challenges and final submission requirements are not complete yet; the adoption track explicitly requires a new project started inside the event period; all work must be open sourced under Apache-2.0; organizer terms permit identity checks and event-purpose sharing of name, email, and project details with partners. Do not start the competition code before October 1 or register until the owner accepts the current organizer terms. Re-check whether a public video is required before committing, because the owner has prohibited video uploads.
- **Global Innovation Build Challenge V2 — reject.** Devpost's headline showed USD 148,445 as cash, while the official requirements expressly say there is no cash prize and describe product credits, subscriptions, coupons, and certificates. It is also student-only and requires a public video and real full-name team information. The headline is not reliable evidence of an earning opportunity.
- **Prompt Wars 2026, OneAquaHealth, Hack the Habitat, COMPSPHERE 12, LaunchHacks V, and Arbiter Hacks V1 — reject.** Their official Devpost eligibility blocks or rules require students; COMPSPHERE additionally requires exactly three people, ages 15–25, and code written during a 24-hour period. The owner has identified as a solo independent developer and has not claimed student status.
- **CALL-E — reject under the current action constraints.** Eligibility and its USD 10,000 cash pool are otherwise credible, but every submission must open a public upstream PR and upload a publicly visible YouTube or Vimeo demonstration video. That conflicts with the owner's explicit instruction not to publish messages or upload videos.

Primary references: https://hackapertus.devpost.com/, https://hackapertus.devpost.com/rules, https://hackapertus.ch/terms-and-conditions, https://gibc-v2.devpost.com/, https://prompt-wars-2026.devpost.com/, https://oneaquahealth-ieee-hackathon.devpost.com/, https://hack-the-habitat-2026.devpost.com/rules, https://compsphere12.devpost.com/rules, https://launchhacks-v.devpost.com/, https://arbiter-hacks-v1.devpost.com/, and https://call-e.devpost.com/.

## External action gates

The owner authorized items 1–3 on 2026-08-23, with an explicit stop condition for payment, phone, CAPTCHA, identity, verification-code, and recovery-credential prompts. Current execution state:

1. External GitHub issue creation is enabled for LineageMedic; the public issues URL returns HTTP 200.
2. ClauseTrace Pages and ChangeFleet Pages are enabled with GitHub Actions. Both deployments completed successfully and both public URLs return HTTP 200: https://14188769700lbk-dev.github.io/claustrace/ and https://14188769700lbk-dev.github.io/changefleet/.
3. All Things Agentic registration is verified: the signed-in account can access the event-specific “My hackathon projects” page, which shows “Start a Project” and “Create project.” No Devpost project has been created or submitted. Google Cloud project creation is paused at first-use account onboarding: the page requires an account country/region and acceptance of the current terms before a project can be created. No cloud project or credit request has been verified.
4. Do not upload public videos or make final Devpost submissions. The owner's current instruction prohibits both unless a later action-time authorization explicitly changes that restriction.

## Current funnel truth

As of the read-only funnel audit at 2026-08-24 21:53 China Standard Time:

- prize money received: USD 0;
- paid inquiries: 0;
- paying customers: 0;
- recognized revenue: USD 0.

The authenticated GitHub Traffic API provided this rolling 14-day snapshot:

| Repository | Views / unique viewers | Clones / unique cloners | Stars | Forks | Open non-PR issues |
| --- | ---: | ---: | ---: | ---: | ---: |
| LineageMedic | 34 / 2 | 335 / 115 | 0 | 0 | 0 |
| ChangeFleet | 5 / 1 | 45 / 24 | 0 | 0 | 0 |
| ClauseTrace | 5 / 1 | 37 / 24 | 0 | 0 | 0 |

These counts do not establish audience demand. LineageMedic recorded no referrer, while ChangeFleet and ClauseTrace each recorded only one unique `github.com` referrer. The clone increases occurred alongside high GitHub Actions activity, and there were still no stars, forks, or pilot issues. The reasonable working inference is that much of the clone traffic came from CI or owner activity; the API does not expose enough attribution to prove the exact source. On the current Windows host, re-run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-acquisition-funnel.ps1` for a read-only snapshot without printing the stored GitHub token. The one-process bypass does not change the system execution policy.

LineageMedic's hosted offer now publishes a machine-readable USD 750 fixed-scope service offer and a two-URL sitemap. Commit `f4a6fd5` passed CI, Pages deployment, and the post-deployment public-assets workflow. This improves crawler access and offer clarity; it is not evidence of indexing, traffic, inquiries, or revenue.

The GitHub repository description now leads with the truthful read-only schema-change risk review instead of describing the project only as a hackathon build. Its existing technical topics were retained and `data-engineering`, `impact-analysis`, and `schema-evolution` were added. This is public repository metadata, not a post, customer claim, or demand signal.

The homepage and sample PDF were submitted once to the official IndexNow global endpoint after a scoped ownership key became publicly reachable under `/lineage-medic/`. The endpoint returned HTTP 202, which means the URLs were received while key validation was pending. IndexNow shares notifications with participating search engines; this response does not prove that any engine crawled, indexed, ranked, or sent traffic to the site.

LineageMedic has a public product, a scoped offer, a downloadable sample, and an open issue-intake path. ChangeFleet and ClauseTrace have public fixture demos. None of those facts proves demand, a customer, a prize, or revenue.
