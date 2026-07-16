# Demo script (2 minutes 30 seconds)

## 0:00–0:20 — The failure before it happens

Open the campaign header.

> A warehouse PR renames `shipping_country` to `country_code`. The SQL change is tiny; the blast radius is not. LineageMedic repairs the ecosystem before this PR merges.

Point to six affected assets, three repositories, and the critical risk state.

## 0:20–0:45 — DataHub is the grounding layer

Show the lineage graph.

> This graph is not inferred from filenames. The agent calls DataHub column lineage for three hops, resolves owners and domains, and retrieves production queries that still use the field.

In the public version, point out the visible **Recorded MCP run** label and the checked-in sanitized manifest. In the live recording, show **MCP connected**.

## 0:45–1:25 — Do the work

Select **Run guided repair**.

> The runbook chooses a zero-downtime window: keep a producer alias, migrate fulfillment, preserve finance's public output, and update the dbt contract.

When complete, open each patch briefly:

1. producer compatibility alias;
2. dbt deprecation metadata;
3. fulfillment migration;
4. finance input migration with stable output.

Emphasize that the files came from an isolated copy of three repositories.

## 1:25–1:55 — Prove it

Show the evidence timeline and terminal output from `npm run demo`.

> Each modified SQL file is parsed, every dbt ref resolves, both fields remain in the migration contract, and every code-bound lineage asset has a repair. Failed checks prevent the campaign from becoming reviewable.

Open `run-manifest.json` if time permits.

## 1:55–2:20 — Durable memory, controlled mutation

Show the writeback card.

> The reasoning and removal date become a DataHub Decision document, not a disposable chat transcript. The mutation is a separate approval step, so analysis cannot silently write to the catalog.

In fixture mode, explicitly say that no live write occurred. In live mode, approve and show the returned DataHub document URN.

## 2:20–2:30 — Close

> DataHub already tells teams what will break. LineageMedic gives every affected owner a validated path to merge. It is Renovate for breaking data changes.
