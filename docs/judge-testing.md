# Judge testing guide

LineageMedic is designed for a self-hosted or cloud DataHub environment. The public URL is a safe, stateless replay of a captured live MCP run; the repository contains both credential-free and live test paths.

## Path A: public review (about 90 seconds)

1. Open <https://14188769700lbk-dev.github.io/lineage-medic/>.
2. Select **Run guided repair**.
3. Confirm six affected assets, four generated patches, and four passed validators.
4. Open a patch to inspect the complete before/after SQL or YAML.
5. Review the DataHub MCP evidence timeline.
6. In **Shared agent memory**, open **Proof JSON** or **DataHub view** to inspect the separate approval-gated live `save_document` result without implying that the public replay can mutate DataHub.
7. Compare the result with [`examples/evidence/live-datahub-read-run.json`](../examples/evidence/live-datahub-read-run.json), the separate [`save_document` proof](../examples/evidence/live-datahub-writeback.json), and the [checked-in generated files](../examples/generated/LM-204/).

The public build cannot write to DataHub and does not claim a live connection.

## Path B: credential-free engine test (about 2 minutes)

Requirements: Node.js 22.13+.

```bash
npm ci
npm run verify
npm run demo
```

The generated workspace, patches, decision document, and manifest appear beneath `.lineage-medic/runs/LM-204/`. Source examples are never modified.

## Path C: live DataHub MCP test

Follow [`live-datahub-setup.md`](live-datahub-setup.md). The checked-in seed creates the exact six-asset graph and schema-field query evidence used by the hackathon scenario. Run the campaign before considering writeback: `save_document` is deliberately gated behind a separate approval action.

## Expected invariants

- campaign status: `ready-for-review`;
- affected assets: 6;
- generated patches: 4 across 3 repositories;
- validators: 4 passed, 0 failed;
- checked-in generated files: byte-identical to a fresh engine run;
- public live MCP evidence: complete and free of local endpoints, host paths, and authentication material;
- public replay writeback: never persisted;
- live writeback: persisted only after explicit approval, with the returned non-preview URN recorded in the separate proof.
