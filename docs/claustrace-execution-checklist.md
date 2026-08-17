# ClauseTrace opening execution checklist

This is a planning artifact, not implementation. It exists in the earlier LineageMedic repository so the new hackathon repository can be created only after the official build window opens.

## Opening gate

Do not initialize the ClauseTrace repository or write implementation code until both checks pass:

1. Local time is at or after **2026-08-18 01:00 +08:00** (2026-08-17 10:00 Pacific).
2. The official Devpost project flow accepts a new submission for the DevNetwork API + Cloud + AI Hackathon.

Record the local timestamp and initial commit timestamp in the new repository. Do not backdate commits or claim pre-window planning as implementation.

## Build order

### 1. Establish the evidence boundary

- Create a genuinely new public repository with an Apache-2.0 license and a README that identifies the event window.
- Add the synthetic addendum PDF and its source text; include a clear fiction/synthetic-data notice.
- Define typed records for extraction evidence, discovered search results, review events, engineering controls, packet generation, and sealing state.
- Add tests proving that search snippets cannot become verified evidence and that missing citations or unresolved contradictions block packet approval.

### 2. Build a deterministic dry run

- Implement the state machine before provider adapters.
- Load checked synthetic Nutrient and SerpApi fixtures through the same interfaces used by live adapters.
- Make the public client safe without secrets: no live provider call, signing action, or confidential upload is available from static hosting.
- Produce one deterministic evidence packet fixture that distinguishes extracted, corrected, proposed, unresolved, and sealed content.

### 3. Add trusted-server provider adapters

- Keep `NUTRIENT_API_KEY` and `SERPAPI_API_KEY` server-only and fail closed when either is absent.
- Validate file type, size, page count where available, query domain allowlists, provider response schemas, and retry-safe error states.
- Generate stable idempotency digests from the document hash plus extraction schema, and separately from normalized search intent.
- Redact authorization headers and provider keys from logs, traces, screenshots, fixtures, and test snapshots.

The account owner or an explicitly authorized operator must place credentials into a local ignored environment file or secret store. Keys must never be copied into chat, command output, Git history, browser JavaScript, or a public deployment.

### 4. Prove the two sponsor paths independently

Nutrient acceptance evidence:

- one successful live extraction with real provider-returned confidence and citation coordinates;
- one human correction event tied to the immutable extraction record;
- one successful DWS-built evidence packet;
- signing only after an exact separate confirmation, with the result validated rather than inferred from an icon.

SerpApi acceptance evidence:

- one narrow live query scoped to an official domain allowlist;
- provider search ID/status, normalized query, ranked URL, snippet, and retrieval timestamp stored;
- an opened official source captured with URL and digest before it can support or contradict a constraint;
- a visible workflow change caused by the reviewed live source, not a decorative search result.

### 5. Finish the review console

- Show source value, page, bounds, confidence, current-source discovery state, reviewer decision, and engineering-control mapping together.
- Make `needs_review`, `reviewed_with_open_items`, and `approved_for_packet` visibly distinct.
- Keep every external mutation behind a precise human confirmation and show that `sealed` does not authorize a production migration.
- Test the complete desktop and mobile path: synthetic document → extraction → live discovery → correction → unresolved conflict → packet → optional seal.

### 6. Package truthful submission evidence

- Public repository with setup and test instructions.
- No-login dry-run deployment plus a separately recorded trusted live run.
- Two- to four-minute video showing real Nutrient and SerpApi responses without keys or confidential data.
- Devpost story that selects Nutrient and SerpApi separately and states exactly where each provider materially changes the workflow.
- Final secret scan, clean checkout build, link health check, and submission-field audit before publication.

## Stop conditions

Stop and ask the account owner before any paid upgrade, credit-card entry, provider-support message, public submission, public video publication, production document upload, or signing operation. Stop immediately if a provider flow asks for an unexpected identity, phone, or payment verification.
