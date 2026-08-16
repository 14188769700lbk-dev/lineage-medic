# ClauseTrace build brief

**Target:** DevNetwork API + Cloud + AI Hackathon 2026 — Nutrient DWS sponsor challenge  
**Build window:** August 17, 2026 10:00 AM PT through September 3, 2026 10:00 AM PT  
**Status:** pre-event product and compliance plan only; no implementation repository has been initialized

## One-line pitch

ClauseTrace turns a contract or API-change notice into cited data-migration constraints, routes uncertain clauses to a human reviewer, and seals the approved evidence packet with Nutrient DWS.

ClauseTrace is an engineering risk tool, not a lawyer. It extracts and organizes obligations for review; it does not provide legal advice or decide whether a contract is enforceable.

## Why this sponsor track fits

The Nutrient challenge asks for trustworthy document workflows where deterministic processing and human review constrain AI. Its public DWS documentation confirms the required primitives:

- [`/extract` maps a document to JSON Schema](https://www.nutrient.io/api/data-extraction-api/) and returns per-field confidence plus source coordinates/citations.
- [DWS Processor accepts declarative document build requests](https://www.nutrient.io/guides/dws-processor/developer-guides/) at `POST https://api.nutrient.io/build`.
- [DWS supports certificate-based PDF signing](https://www.nutrient.io/api/digital-signatures-api/) through `POST https://api.nutrient.io/sign`.
- A free Processor account currently advertises 50 credits per month without payment information, but free outputs can be watermarked. Event access and limits must be checked in the authenticated dashboard before relying on them.

## Product workflow

1. **Select a synthetic document.** The public demo starts with a bundled fictional API/data-processing addendum. Upload is optional and must warn users not to submit confidential material to the public demo.
2. **Extract cited constraints.** The trusted server sends the PDF and a strict JSON Schema to Nutrient `/extract`.
3. **Classify review state.** Required fields with missing citations or confidence below the configured threshold become `needs_review`; the system never silently fills them.
4. **Review against the source.** The UI places the extracted value beside its page number, source bounds, confidence, and quoted fragment. The human can accept, correct, or reject it.
5. **Map to migration controls.** Accepted obligations become engineering controls: compatibility period, notice deadline, retention restriction, approval owner, rollback requirement, or prohibited action.
6. **Generate an evidence packet.** DWS Processor builds a PDF containing the source digest, accepted fields, reviewer changes, unresolved items, and proposed technical controls.
7. **Seal after explicit confirmation.** A separate confirmation calls DWS signing. The signed result proves packet integrity; it does not prove the legal conclusion is correct.

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
  - server-only Nutrient key
  - request digest + idempotency key
        |
        +--> Nutrient /extract
        |      -> typed values + citations + confidence
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

- API key never appears in browser JavaScript, logs, fixtures, screenshots, or Git history.
- Non-PDF, oversized, password-protected, and malformed inputs fail before a paid API call where detectable.
- The same document and extraction schema produce a stable idempotency key.
- Missing citations or low-confidence required fields cannot reach `approved_for_packet`.
- Every correction records previous value, new value, timestamp, and reviewer label.
- Packet generation lists unresolved items and distinguishes extracted, corrected, and proposed content.
- Signing requires a separate exact confirmation phrase and cannot run from the public static demo.
- Provider errors expose a retry-safe state without claiming that extraction or signing succeeded.
- Synthetic fixture, server adapter, and state transitions have deterministic tests.

## Demo sequence (2–4 minutes)

1. State the problem: migration teams often receive obligations in PDFs that never reach the engineering change plan.
2. Load the fictional addendum and show the exact fields requested.
3. Run real Nutrient extraction and open two cited source locations.
4. Correct one deliberately ambiguous field and leave one unresolved.
5. Show how accepted clauses become engineering controls without authorizing a migration.
6. Generate the DWS evidence packet.
7. Explicitly confirm one seal operation and validate that the resulting PDF is tamper-evident.
8. Close with the safety boundary and a link to the public repository.

## Submission claims that require evidence

- “Uses Nutrient meaningfully” requires recorded successful `/extract` and `/build` responses; signing is an additional differentiator.
- “Cited extraction” requires showing page/bounds/confidence returned by DWS, not locally fabricated coordinates.
- “Human in the loop” requires a real correction event reflected in the output packet.
- “Tamper-evident” requires validation of a DWS-signed output, not merely displaying a signature icon.
- “Free to try” is allowed only if the deployed demo actually works without payment; otherwise call it a public dry run.

## External gates

The account owner must confirm before:

- registering for the DevNetwork event;
- creating a Nutrient account and accepting its current terms/privacy policy;
- sending any provider-support message;
- publishing the final Devpost submission or video.

No credit card, paid upgrade, real contract, or confidential document is authorized by this brief.
