# Paid pilot delivery runbook

This runbook turns the public LineageMedic proof into a bounded client engagement. It is an operating template, not a signed statement of work or legal advice.

## Gate 0 — Qualification

Collect only non-sensitive answers:

- proposed change and target date;
- catalog, warehouse, transformation framework, and version control system;
- approximate number of affected domains and repositories;
- required reviewers and change-management process;
- whether sanitized exports are acceptable;
- budget owner and decision date.

Reject or rescope when the buyer expects unreviewed production mutation, cannot supply a concrete change, or requires unsupported compliance certifications.

## Gate 1 — Written scope

Before receiving access, record:

- exact domain, repositories, and assets in scope;
- permitted actions: read, copy, draft, validate, open draft PR, or write catalog memory;
- prohibited actions and production systems;
- credential channel, expiration, and revocation owner;
- artifact retention and deletion date;
- deliverables, acceptance tests, timeline, price, taxes, and payment milestones;
- client responsibility for final technical and production approval.

No public repository or demo asset is a substitute for a mutually accepted scope.

## Gate 2 — Read-only discovery

1. Verify the repository and asset allowlist.
2. Load lineage, schema, ownership, and observed-query evidence.
3. Record every external tool call and source identifier.
4. Produce a blast-radius report with observed facts separated from assumptions.
5. Stop if coverage is materially incomplete.

Acceptance evidence: inventory, owner map, tool trace, assumptions, and a go/no-go recommendation.

## Gate 3 — Isolated repair

1. Copy repositories into a client-approved isolated workspace.
2. Select a policy per asset: compatibility, direct migration, or preserve output.
3. Generate patches only for allowlisted paths.
4. Run parser, reference, contract, and lineage-coverage gates.
5. Package changes for human review.

Acceptance evidence: before/after patches, validation output, unresolved risks, and the proposed migration order.

## Gate 4 — Optional draft publication

Opening a draft pull request or saving a DataHub Decision is a separate mutation. Require written per-campaign approval, use short-lived credentials, record returned identifiers, and never represent a draft as merged or deployed.

## Handoff

- Review the campaign with the technical owner.
- Mark every result as observed, inferred, proposed, approved, or applied.
- Deliver the run manifest and deletion confirmation.
- Record follow-up work as a new scope rather than silently expanding the pilot.

## Suggested payment milestones

- Risk review: 100% at kickoff for a fixed five-day scope.
- Repair pilot: 50% at kickoff, 50% when the validated patch bundle is delivered.
- Integration sprint: 40% kickoff, 40% after adapter acceptance, 20% after the pilot campaign handoff.

Payment processor, currency conversion, invoicing, tax treatment, and dispute terms must be agreed by the account owner before accepting money.
