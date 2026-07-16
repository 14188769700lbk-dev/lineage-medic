# Judging rubric evidence map

This document maps each official criterion to concrete, inspectable evidence. It is an internal final-review checklist and a shortcut for maintainers preparing the Devpost submission.

## 1. Use of DataHub

**Claim:** DataHub is the decision context, not a decorative catalog screenshot.

**Counterfactual:** without DataHub the application could only attempt a global rename. Column lineage, ownership, schemas, domains, and observed-query evidence determine which files receive direct migrations, where compatibility must remain, and who owns the review.

- Live `get_lineage` traces a renamed schema field through three hops.
- Live `get_entities` grounds six assets in schemas, platforms, owners, and domains.
- Live `get_dataset_queries` returns SQL attached to the `shipping_country` schema-field subject.
- DataHub asset identities and metadata are joined to explicit repository contract bindings, producing different repair policies for the producer, an internal consumer, and a public-contract consumer.
- `save_document` stages a Decision containing the evidence, patches, validation results, related asset URNs, and removal date.

**Evidence:** `examples/evidence/live-datahub-read-run.json`, `scripts/seed-fiction-retail.py`, and the live-mode recording.

**Remaining gate:** capture a persisted `save_document` result and DataHub document view after explicit approval.

## 2. Technical execution

**Claim:** The application works end to end and blocks unsafe output.

- The engine edits isolated copies of three repositories and never mutates source examples.
- Path resolution prevents writes outside the owned workspace.
- Four deterministic validators gate `ready-for-review`.
- Live HTTP and stdio MCP transports share one typed provider contract.
- CI executes type checking, the full Vitest suite, and production builds.
- The hosted replay is stateless and cannot persist a DataHub mutation.

**Evidence:** `src/core`, `src/adapters`, `.github/workflows`, `docs/judge-testing.md`, and green GitHub Actions runs.

## 3. Originality

**Claim:** LineageMedic goes beyond DataHub's built-in impact view.

The product treats lineage as an executable migration plan. It generates owner-specific code changes, preserves compatibility where public contracts require it, validates complete repair coverage, and writes durable migration memory back to the graph.

**Evidence:** the three repair policies in `src/core/repair-engine.ts` and the four distinct generated artifacts.

## 4. Real-world usefulness

**Claim:** Schema renames are small producer changes with expensive distributed consequences.

The Fiction Retail scenario covers a producer model, dbt consumers, an Airflow job, operational and board dashboards, six owner groups, and a timed deprecation window. The output is designed for review and merge rather than as advice in a chat window.

**Evidence:** public demo, generated examples, decision document, and repository bindings.

## 5. Submission quality

- Public no-login replay.
- Public Apache-2.0 repository with one-command fixture path.
- Ninety-second judge testing guide.
- Sanitized raw live evidence.
- Under-three-minute narrated demo with captions.
- English Devpost description and README.

## 6. Open-source bonus

DataHub Skills PR [#36](https://github.com/datahub-project/datahub-skills/pull/36) implements the missing `datahub-audit` workflow, report template, metric reference, routing metadata, command, and validations.

## Final red-team questions

- Can a judge distinguish live MCP evidence from a public replay at a glance?
- Does every claim have a file, UI state, terminal result, or DataHub entity that proves it?
- Is any capability described more strongly than its validator actually guarantees?
- Can the complete core flow be understood before the video reaches two minutes?
- Are all credentials, personal data, and machine-specific paths absent from public artifacts?
