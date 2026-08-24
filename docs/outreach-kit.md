# Outreach kit

Every message below is grounded in public evidence. Replace bracketed fields with verified facts; do not invent experience, customers, certifications, location, or availability.

## Positioning sentence

> I built LineageMedic, an open-source DataHub and dbt repair workflow that traces a breaking schema change, drafts contract-aware SQL/YAML repairs across repositories, and keeps every external mutation behind human approval.

## Fixed-price marketplace service draft

Use this as a private draft for a project catalog or services marketplace. Publishing it, accepting marketplace terms, configuring payouts, or promising availability requires action-time owner approval.

**Title**

> I will map the blast radius of one risky dbt or warehouse schema change

**Price and delivery target**

- USD 750 fixed price.
- Five business days after the agreed, non-sensitive inputs are available.
- The timing and price are an offer, not a claim of prior sales or guaranteed availability.

**Buyer-facing summary**

> Before renaming, removing, or changing a warehouse field, get a reviewable map of the affected assets, owners, and contracts. I will analyze one representative schema change using read-only metadata and up to three repository snapshots, then deliver an evidence-backed risk review and migration sequence. No production system or source repository is modified.

**Included deliverables**

1. Blast-radius inventory for one data domain and up to 25 catalog assets.
2. Ownership and repository-binding gaps that need human resolution.
3. Consumer-by-consumer compatibility recommendation: migrate directly, preserve an alias/output, or block pending evidence.
4. Prioritized risk register and removal-window checklist.
5. One 45-minute handoff call and a written next-step plan.

**Inputs requested from the buyer**

- One concrete proposed field rename, removal, or compatible type change.
- Sanitized lineage/catalog export or read-only metadata access through an agreed private channel.
- Up to three repository snapshots containing the affected SQL, dbt models, or contracts.
- A technical owner who can answer evidence gaps and validate the findings.

**Explicit exclusions**

- Production, catalog, or repository writes.
- Credentials or private schemas in a public ticket.
- A guarantee that no outage, data-quality regression, or downstream break will occur.
- Legal, regulatory, tax, or data-protection certification.
- Unlimited assets, repositories, or custom warehouse adapters.

**Public proof before purchase**

- No-login replay: https://14188769700lbk-dev.github.io/lineage-medic/
- Synthetic sample PDF: https://14188769700lbk-dev.github.io/lineage-medic/sample-schema-change-risk-review.pdf
- Generated four-file repair PR: https://github.com/14188769700lbk-dev/lineage-medic/pull/1
- Source, checks, and sanitized evidence: https://github.com/14188769700lbk-dev/lineage-medic

**Prepared gallery assets — private draft, not published**

- Marketplace cover: `docs/assets/lineage-medic-service-cover-4x3.png` (PNG, 1448×1086, exact 4:3, 1.53 MiB).
- Wider reusable cover: `docs/assets/lineage-medic-service-cover.png` (PNG, 1672×941).
- Delivery sample: `public/sample-schema-change-risk-review.pdf`.
- Product proof: use a clean screenshot of the no-login replay or the architecture section only after checking that no secret, contact information, customer claim, or third-party brand is visible.

The 4:3 cover was prepared against Upwork's current gallery guidance: PNG/JPEG, under 10 MB, no more than 4000 px, and a 4:3 composition (ideally 1000×750). It contains no price, contact information, customer/award/certification claim, or third-party logo. These files are supporting assets only; publishing a listing remains an external representational action requiring action-time owner approval.

**Qualification questions**

1. What exact field or contract is expected to change?
2. Which warehouse/catalog and transformation tools are involved?
3. How many catalog assets and repositories are plausibly in scope?
4. Can you provide sanitized exports or read-only access without placing secrets in a public thread?
5. Who will validate the findings and approve any later implementation work?

**FAQ: Do you change my production code?**

> No. This entry service is read-only. If the review identifies a bounded repair campaign, implementation is separately scoped and remains human-approved.

**FAQ: Can you guarantee the lineage is complete?**

> No. The review distinguishes observed evidence from missing bindings and unknown consumers. An incomplete lineage graph is reported as a risk, not silently treated as complete.

**FAQ: Is this limited to DataHub?**

> The public implementation proves the workflow with DataHub and dbt. Other catalogs or warehouses require a scope check before any compatibility claim or estimate.

## Marketplace profile draft

Use this on Upwork, Contra, or RemoteAI only after replacing the legal-name, location, availability, and payout fields with verified owner information. It deliberately makes no claim about years of experience, prior clients, employment, certifications, or revenue.

**Professional title**

> Data change risk reviews | DataHub, dbt, SQL, TypeScript

**Overview**

> I build evidence-backed workflows for risky warehouse and dbt schema changes. My public LineageMedic project traces downstream impact through DataHub, separates direct migrations from compatibility-preserving changes, drafts reviewable SQL/YAML repairs on isolated repository copies, and blocks external writes until explicit approval.
>
> I offer a fixed-scope, read-only review for one proposed field rename, removal, or compatible type change. The deliverable maps affected assets and owners, records missing evidence, recommends a consumer-by-consumer migration policy, and provides a prioritized migration sequence. I do not need production write access for this entry scope.
>
> Public proof includes a no-login hosted replay, a synthetic sample risk-review PDF, a four-file generated repair pull request with passing checks, and sanitized DataHub MCP evidence. Other catalogs, warehouses, or implementation work are scoped only after the evidence and access boundaries are clear.

**Skills supported by public artifacts**

- DataHub and metadata lineage
- dbt contracts and model migration
- SQL and schema evolution
- TypeScript, React, Fastify, and Vitest
- Model Context Protocol (MCP)
- Evidence capture, validation gates, and human approval boundaries

**Portfolio links**

- Hosted replay: https://14188769700lbk-dev.github.io/lineage-medic/
- Sample deliverable: https://14188769700lbk-dev.github.io/lineage-medic/sample-schema-change-risk-review.pdf
- Source and tests: https://github.com/14188769700lbk-dev/lineage-medic
- Generated repair PR: https://github.com/14188769700lbk-dev/lineage-medic/pull/1

Do not publish an hourly rate or availability that the owner has not confirmed. Keep USD 750 as the fixed-price entry offer; any hourly rate is a separate marketplace setting and financial commitment.

## Marketplace channel decision — 2026-08-23

**Primary candidate: Upwork Project Catalog.** Upwork's current help center explicitly lists China/CNY and Hong Kong among Direct to Local Bank destinations. Project Catalog supports fixed-price service listings, client requirements, PDFs, tiers, and a visibility toggle. It is an inbound route, so the service can be discoverable without buying Connects for outbound proposals. Upwork still applies a contract-specific freelancer fee of 0–15%, reviews each listing before publication, and requires accurate account/payment identity; a withdrawal method can be flagged when its name does not match the account.

**Secondary candidate: Contra.** Contra states that it supports global payouts, CNY currency conversion, local bank/Payoneer/PayPal/crypto options, escrow or milestone projects, and no platform commission for Independents. The actual payout methods depend on the country that issued the user's identification, identity verification is required, and processor/FX fees still apply. Treat it as executable only after the owner confirms the true country, legal name, acceptable payout method, and current terms.

**Experimental candidate: RemoteAI.** A talent profile is currently free, candidates receive 20 free applications per day, and the platform exposes contract and freelance opportunities. Its terms make RemoteAI a facilitator rather than a party to the resulting employment or contract, so payment terms, invoicing, disputes, and a lawful payout rail must be handled directly with the client. The profile requires a truthful full name, email, experience, rate, and availability; public profiles are visible to employers, and the privacy policy allows international data transfers. Use it only after the owner confirms the true identity fields and can lawfully contract and receive payment. This is lower platform-fee friction, not a claim that the platform will produce work.

**Rejected for now: Fiverr.** Fiverr pays freelancers 80% of cleared order value and requires phone verification before offering services. New-freelancer verification can also require a security question, legal-name/address data, an original government ID, a smartphone selfie, and in some cases a one-time verification fee. Those costs and verification steps make it a weaker first channel than Upwork Project Catalog, Contra, or a free RemoteAI profile for the current owner constraints.

**Rejected for now: Opire.** Its work feed was not reliable enough to prove that a listed issue was open and maintainer-accepted, while its normal payout flow depends on a configured Stripe account. Do not create an account or implement a listed issue merely because the aggregator shows a dollar amount.

Do not create an Upwork, Contra, RemoteAI, or Fiverr account, accept platform terms, transmit identity documents, configure a bank/Payoneer/PayPal/crypto payout, or publish a profile or service listing without action-time owner approval. If mainland China is the confirmed residence, Upwork's published CNY local-bank support makes it the cleaner first verification path; this is a channel recommendation, not a guarantee that onboarding or payout approval will succeed.

Official references:

- https://support.upwork.com/hc/en-us/articles/211063888-How-to-withdraw-earnings-with-Direct-to-Local-Bank
- https://support.upwork.com/hc/en-us/articles/360057397533-How-to-create-a-project-in-Project-Catalog
- https://support.upwork.com/hc/en-us/articles/1500011309082-How-to-add-images-and-video-to-your-Project-Catalog-project
- https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee
- https://contra.com/blog/payments
- https://contra.com/blog/setting-up-payments
- https://help.contra.com/en/articles/13754797-how-can-independents-get-paid-on-contra
- https://remoteai.io/terms
- https://remoteai.io/privacy
- https://remoteai.io/trust-safety
- https://remoteai.io/register
- https://help.fiverr.com/hc/en-us/articles/34069565843985-How-Fiverr-works-for-freelancers
- https://help.fiverr.com/hc/en-us/articles/37552021347985-Phone-verification-Secure-your-Fiverr-account
- https://help.fiverr.com/hc/en-us/articles/6348992414097-Verifying-your-identity-as-a-new-freelancer

## Upwork proposal — dbt migration or governance work

> Hi [name] — your requirement around [exact requirement from the post] matches a workflow I have already built and made publicly inspectable. LineageMedic takes a proposed schema change, traces downstream impact, drafts repository-specific dbt/SQL repairs, and validates parser, ref, contract, and coverage gates before review.
>
> Relevant proof: the hosted replay, a four-file repair PR, and a sanitized DataHub MCP trace are linked at https://github.com/14188769700lbk-dev/lineage-medic.
>
> For this engagement I would start with [one concrete first milestone], deliver [specific artifact], and explicitly exclude production writes until you approve the result. If that approach fits, I can turn your first representative change into a fixed-scope assessment before estimating the wider migration.

Do not add years of experience, client names, revenue, or certifications unless the account owner can verify them.

## Direct message — data platform lead

> I noticed [company/team] is working on [verified migration or catalog signal]. I built an open-source workflow for the risky part of schema changes: tracing DataHub lineage, choosing compatibility policy per consumer, and producing validated repair drafts across repositories. The public demo and generated PR are here: https://github.com/14188769700lbk-dev/lineage-medic.
>
> I am testing a five-day, read-only schema-change risk review. It needs only one representative change and sanitized metadata/repository snapshots; no production write access. Is reducing coordination risk for an upcoming migration relevant to your team this quarter?

## Community post — educational, not disguised solicitation

> I built a reproducible example of treating column lineage as a repair plan rather than only a diagram. One `shipping_country → country_code` proposal becomes three different policies: producer compatibility, direct internal migration, and public-output preservation. The repo includes the MCP evidence, generated PR, validators, and explicit writeback gate. I would value technical feedback on the contract policy and coverage checks: https://github.com/14188769700lbk-dev/lineage-medic.

Use this only where project sharing is permitted. Do not post the same copy repeatedly or hide the commercial connection.

## Show HN launch

Suggested title:

> Show HN: LineageMedic – turn DataHub column lineage into reviewed dbt repair drafts

Suggested first comment:

> I built LineageMedic after noticing that lineage tools usually stop at showing impact. The harder part is deciding which consumers can migrate directly, which public outputs need compatibility, and whether every code-bound asset received a repair.
>
> The hosted replay uses a synthetic `shipping_country → country_code` change. It traces six affected assets, assigns compatibility policy per consumer, generates a four-file SQL/YAML patch, and runs deterministic parser, ref, contract, and coverage checks. External writes stay behind explicit human approval.
>
> You can try the complete replay without an account: https://14188769700lbk-dev.github.io/lineage-medic/
>
> Source and evidence: https://github.com/14188769700lbk-dev/lineage-medic
>
> I would particularly value criticism of the compatibility-policy model and the cases where lineage evidence is still too weak to generate a safe draft.

This follows Show HN's requirement that the linked artifact be substantial and directly usable. Do not ask for upvotes, hide the commercial pilot offer, or post unless the account owner can stay available to answer technical questions.

## DataHub `#show-and-tell`

> I built a small open-source experiment around a question I keep running into: once DataHub has shown the blast radius of a column change, how much of a safe repair plan can be derived without pretending lineage is complete?
>
> The replay maps each downstream asset to a compatibility policy, drafts dbt/SQL changes, blocks unknown repository bindings, and checks whether every code-bound consumer received a patch. It uses only synthetic metadata and keeps writeback behind human approval.
>
> Demo: https://14188769700lbk-dev.github.io/lineage-medic/
> Source: https://github.com/14188769700lbk-dev/lineage-medic
>
> Feedback on the policy model and missing-evidence boundary would be very useful.

Join and post only after reviewing the current workspace rules and obtaining action-time approval for the public message.

## Discovery-call structure

1. Ask for the next concrete breaking change, not a generic platform wish list.
2. Quantify repositories, owners, review steps, and historical failures.
3. Identify the buyer and acceptance authority.
4. Confirm whether sanitized exports and read-only access are possible.
5. Offer the smallest paid scope that can prove or disprove value.

## Objection responses

**“Why not global search and replace?”**

Search finds matching text but does not determine whether a public output must stay compatible, whether a transitive asset has no repository binding, or whether every code-bound consumer received a repair.

**“Why should we trust generated code?”**

You should not trust it by default. The pilot works on isolated copies, retains full patches and evidence, runs deterministic gates, and requires human review before any external write.

**“Can you guarantee no outage?”**

No. The service reduces a defined class of migration risk and makes gaps visible; the client still owns integration tests, deployment controls, and production approval.
