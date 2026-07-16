# Demo script (target: 2 minutes 35 seconds)

Use the live self-hosted DataHub mode for the recording. Use `public/og.png` as the opening title card. Do not use copyrighted music; narration and application audio only.

## 0:00–0:18 — The failure before it happens

Open the campaign header.

> A warehouse PR renames `shipping_country` to `country_code`. The SQL change is tiny. The blast radius is not. LineageMedic repairs the ecosystem before that breaking PR merges.

Point to six affected assets, three repositories, and the critical risk state.

## 0:18–0:43 — DataHub is the grounding layer

Show the lineage graph.

> This graph is not inferred from filenames. Through the official MCP server, the agent asks DataHub for three-hop column lineage, six entity records, and observed SQL that still uses the field.

Briefly cut to the DataHub asset page or terminal MCP trace, then return to **MCP connected** in LineageMedic.

## 0:43–1:28 — Do the work

Select **Run guided repair**.

> Now it acts. The runbook chooses a zero-downtime window: keep a producer alias, update the dbt contract, migrate fulfillment, and preserve finance's public output while changing its input.

When complete, open three representative patches briefly:

1. producer compatibility alias;
2. dbt deprecation metadata;
3. finance input migration with stable output.

Emphasize that the files came from an isolated copy of three repositories.

## 1:28–1:58 — Prove it

Show the evidence timeline and terminal output from `npm run demo`.

> Generation is not success. Each SQL file must parse, every dbt ref must resolve, both fields must remain in the compatibility contract, and every code-bound lineage asset must have a repair. Any failure blocks review.

Show **4 / 4 validated**, then the checked-in live manifest for two seconds.

## 1:58–2:25 — Durable memory, controlled mutation

Show the writeback card.

> Finally, the reasoning, repair list, validation proof, and removal date become a DataHub Decision document—not a disposable chat transcript. Saving is a separate approval step, so analysis cannot silently mutate the catalog.

Approve the live writeback and show the returned DataHub document URN plus the document in DataHub.

## 2:25–2:35 — Close

> DataHub tells teams what will break. LineageMedic gives every affected owner a validated path to merge. Renovate for breaking data changes.

## Recording checklist

- Resolution: 1920×1080, 30 fps, browser zoom 100%.
- Keep the mouse still during narration; move only to the next proof point.
- Use hard cuts, not decorative transitions.
- Keep every credential, local token, and terminal home path out of frame.
- Include captions burned into the final video.
- Final duration must remain below 2:55; target 2:35 leaves safety margin.
