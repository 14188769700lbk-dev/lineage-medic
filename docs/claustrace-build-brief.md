# ClauseTrace build brief

**Target:** DevNetwork API + Cloud + AI Hackathon 2026 — Nutrient DWS and SerpApi sponsor challenges
**Build window:** August 17, 2026 10:00 AM PT through September 3, 2026 10:00 AM PT  
**Status:** DevNetwork registration completed August 16; pre-event product and compliance plan only; no implementation repository has been initialized

## One-line pitch

ClauseTrace turns a contract or API-change notice into cited data-migration constraints, discovers current official source material with SerpApi, routes uncertain evidence to a human reviewer, and seals the approved evidence packet with Nutrient DWS.

ClauseTrace is an engineering risk tool, not a lawyer. It extracts and organizes obligations for review; it does not provide legal advice or decide whether a contract is enforceable.

## Why these sponsor tracks fit

The Nutrient challenge asks for trustworthy document workflows where deterministic processing and human review constrain AI. Its public DWS documentation confirms the required primitives:

- [`/extract` maps a document to JSON Schema](https://www.nutrient.io/api/data-extraction-api/) and returns per-field confidence plus source coordinates/citations.
- [DWS Processor accepts declarative document build requests](https://www.nutrient.io/guides/dws-processor/developer-guides/) at `POST https://api.nutrient.io/build`.
- [DWS supports certificate-based PDF signing](https://www.nutrient.io/api/digital-signatures-api/) through `POST https://api.nutrient.io/sign`.
- A free Processor account currently advertises 50 credits per month without payment information, but free outputs can be watermarked. Event access and limits must be checked in the authenticated dashboard before relying on them.

The event's official instructions allow one new project to select multiple sponsor challenges. SerpApi is a coherent second track rather than a bolt-on:

- [SerpApi's Google Search API](https://serpapi.com/search-api) returns structured organic results and a provider search ID/status from `GET https://serpapi.com/search?engine=google`.
- [The free plan](https://serpapi.com/pricing) currently advertises 250 searches per month. Account terms still require explicit acceptance by the account owner.
- The sponsor challenge awards a $1,000 cash first-place component plus $1,000 in credits, and asks for live structured search data that materially improves the AI workflow.
- ClauseTrace uses search for current-source discovery and contradiction detection. It never treats a result title or snippet as proof of an underlying obligation.

## Product workflow

1. **Select a synthetic document.** The public demo starts with a bundled fictional API/data-processing addendum. Upload is optional and must warn users not to submit confidential material to the public demo.
2. **Extract cited constraints.** The trusted server sends the PDF and a strict JSON Schema to Nutrient `/extract`.
3. **Discover current official sources.** The trusted server asks SerpApi for a narrow, reproducible query scoped to the relevant vendor or regulator domains. It stores the provider search ID, query, rank, title, URL, snippet, and retrieval time.
4. **Separate discovery from evidence.** Search metadata is labeled `discovered`, not `verified`. A reviewer can open a result, capture the official source URL and digest, and attach it as supporting or contradictory evidence.
5. **Classify review state.** Required fields with missing citations, low confidence, or unresolved source conflicts become `needs_review`; the system never silently fills them.
6. **Review against the source.** The UI places the extracted value beside its page number, source bounds, confidence, quoted fragment, and any discovered current sources. The human can accept, correct, or reject it.
7. **Map to migration controls.** Accepted obligations become engineering controls: compatibility period, notice deadline, retention restriction, approval owner, rollback requirement, or prohibited action.
8. **Generate an evidence packet.** DWS Processor builds a PDF containing the source digest, search manifest, accepted fields, reviewer changes, unresolved items, and proposed technical controls.
9. **Seal after explicit confirmation.** A separate confirmation calls DWS signing. The signed result proves packet integrity; it does not prove the legal conclusion is correct.

## Extraction contract

The `/extract` request should ask for this logical shape:

```json
{
  "documentTitle": "string",
  "parties": ["string"],
  "effectiveDate": "date|null",
  "affectedSystems": ["string"],
  "affectedFields": [
    {
      "currentName": "string",
      "proposedName": "string|null",
      "classification": "string|null"
    }
  ],
  "compatibilityWindowDays": "integer|null",
  "noticeDeadline": "date|null",
  "retentionConstraint": "string|null",
  "approvalOwner": "string|null",
  "rollbackRequirement": "string|null",
  "prohibitedActions": ["string"],
  "unresolvedTerms": ["string"]
}
```

The application must retain Nutrient's per-field citations, confidence, page, and bounds separately from the accepted business value. Corrections must append a review event rather than overwrite extraction evidence.

## State model

```text
uploaded
  -> extracting
  -> needs_review | extraction_failed
  -> reviewed_with_open_items | approved_for_packet
  -> packet_generated
  -> awaiting_seal_confirmation
  -> sealed | sealing_failed
```

No state authorizes a production schema change. `sealed` means only that the review packet was cryptographically finalized.

## Architecture boundary

```text
React review console
        |
        | synthetic PDF or explicitly uploaded document
        v
Express trusted server
  - size/type/page limits
  - server-only Nutrient and SerpApi keys
  - request digest + idempotency key
        |
        +--> Nutrient /extract
        |      -> typed values + citations + confidence
        |
        +--> SerpApi /search
        |      -> live result metadata + provider search ID
        |      -> discovery only until source review
        |
        +--> local review-event ledger
        |
        +--> Nutrient /build
        |      -> evidence PDF
        |
        +--> explicit seal confirmation --> Nutrient /sign
```

The dry-run path uses a checked synthetic extraction fixture and never contacts Nutrient. The live path must be visibly labeled, server-only, and disabled without an API key.

## Minimum acceptance tests

- Provider API keys never appear in browser JavaScript, logs, fixtures, screenshots, or Git history.
- Non-PDF, oversized, password-protected, and malformed inputs fail before a paid API call where detectable.
- The same document and extraction schema produce a stable idempotency key.
- The same source-search intent produces a normalized query record and stores SerpApi's search ID, status, rank, URL, and retrieval time.
- Search results are always labeled `discovered`; no snippet can become verified evidence without an explicit review event and captured source digest.
- Queries default to a supplied official-domain allowlist and visibly disclose when results fall outside it.
- Missing citations or low-confidence required fields cannot reach `approved_for_packet`.
- An unresolved contradiction between the document and a reviewed current source cannot reach `approved_for_packet`.
- Every correction records previous value, new value, timestamp, and reviewer label.
- Packet generation lists unresolved items and distinguishes extracted, corrected, and proposed content.
- Signing requires a separate exact confirmation phrase and cannot run from the public static demo.
- Provider errors expose a retry-safe state without claiming that extraction or signing succeeded.
- Synthetic fixture, server adapter, and state transitions have deterministic tests.

## Demo sequence (2–4 minutes)

1. State the problem: migration teams often receive obligations in PDFs that never reach the engineering change plan.
2. Load the fictional addendum and show the exact fields requested.
3. Run real Nutrient extraction and open two cited source locations.
4. Run one real SerpApi search scoped to an official vendor domain; show the provider search ID and why snippets remain discovery evidence.
5. Review one current source, correct one deliberately ambiguous field, and leave one conflict unresolved.
6. Show how accepted clauses become engineering controls without authorizing a migration.
7. Generate the DWS evidence packet with the search manifest and unresolved item.
8. Explicitly confirm one seal operation and validate that the resulting PDF is tamper-evident.
9. Close with the safety boundary and a link to the public repository.

## Submission claims that require evidence

- “Uses Nutrient meaningfully” requires recorded successful `/extract` and `/build` responses; signing is an additional differentiator.
- “Uses live search meaningfully” requires a recorded successful SerpApi response whose structured result changes the review workflow; a decorative search box or locally fabricated result is insufficient.
- “Current official source” requires domain and source review evidence. A search snippet alone supports only “discovered through SerpApi.”
- “Cited extraction” requires showing page/bounds/confidence returned by DWS, not locally fabricated coordinates.
- “Human in the loop” requires a real correction event reflected in the output packet.
- “Tamper-evident” requires validation of a DWS-signed output, not merely displaying a signature icon.
- “Free to try” is allowed only if the deployed demo actually works without payment; otherwise call it a public dry run.

## External gates

Completed gate:

- DevNetwork registration was submitted on August 16 as a working-solo `Independent developer` entry in the `1 - 9` range, after the account owner explicitly confirmed eligibility and accepted the Official Rules and Devpost Terms.

The account owner must still confirm before:

- creating a [Nutrient DWS account](https://dashboard.nutrient.io/sign_up/?product=processor) and accepting its [Terms of Service](https://www.nutrient.io/api/terms/). GitHub or Google signup currently receives 50 monthly credits and higher file-size limits; email signup is limited to 5 MB and watermarked output. OAuth would transmit the selected account identity and email to Nutrient;
- creating a [SerpApi free account](https://serpapi.com/users/sign_up?plan=free) and accepting its [Terms and Conditions](https://serpapi.com/legal). GitHub, Google, or direct email signup are available; OAuth would transmit the selected account identity and email to SerpApi;
- sending any provider-support message;
- publishing the final Devpost submission or video.

No credit card, paid upgrade, real contract, or confidential document is authorized by this brief.
