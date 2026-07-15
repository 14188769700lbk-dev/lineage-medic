# Architecture

LineageMedic separates evidence gathering, repair policy, filesystem mutation, validation, and external writeback. That separation is the product: no model response is treated as a trusted code change or as permission to mutate DataHub.

## Components

### Context providers

`DataHubContextProvider` exposes two operations:

- `load(change)` returns assets, repository bindings, production queries, and an audit trail of DataHub tool calls.
- `saveDecision(decision, approved)` persists only when the provider is live and `approved` is exactly `true`.

`FixtureDataHubProvider` parses and validates `examples/context/fiction-retail-datahub.json`. Its writeback method always returns `persisted: false`.

`McpDataHubProvider` supports:

- Streamable HTTP for DataHub Cloud;
- stdio using the official `mcp-server-datahub` package for self-hosted DataHub.

It calls the official tool names `get_lineage`, `get_entities`, `get_dataset_queries`, and—only after approval—`save_document`. Live results are retained in `rawResponses` inside the run manifest. The checked-in repository map bridges catalog assets to code locations; this is explicit configuration rather than guessed ownership.

### Repair engine

The engine creates a fresh `workspace` child inside a caller-owned run directory, copies the configured repositories, and applies one of three policies:

- `producer-compatibility`: keep both old and new outputs through a removal date;
- `migrate-consumer`: replace the legacy input in a consumer whose output may change;
- `preserve-output`: read the replacement input while retaining a downstream public contract.

A producer binding can also name a dbt schema file. The engine updates it with the replacement column and deprecation metadata for the legacy column.

### Validators

Four deterministic gates run after patch generation:

1. Modified SQL parses after the small, documented rendering of dbt `source()` and `ref()` macros.
2. Every `ref()` points to a model present in the copied workspace.
3. Producer SQL and YAML contracts expose both fields through the compatibility window.
4. Every code-bound asset returned by the context provider has a generated repair.

A campaign is `ready-for-review` only if all gates pass.

### Evidence and writeback

The run manifest contains the input change, MCP traces, retained production queries, complete before/after patches, validation results, and writeback state. The Markdown decision document carries the same reasoning in a human-readable form.

In fixture mode, the document is only staged locally. In live mode, an approved call uses DataHub `save_document` and records the returned URN.

## Trust boundaries

| Boundary | Control |
| --- | --- |
| Untrusted change proposal | Typed campaign input and exact field identifiers |
| External DataHub response | Provider normalization plus checked-in repository bindings |
| Repository paths | Resolve-under-workspace check before every read or write |
| Generated SQL/YAML | Parser, reference, contract, and coverage gates |
| DataHub mutation | Separate boolean approval, false by default |
| GitHub publication | Not performed by the core engine; review/publish is a downstream integration |

## Why deterministic first

The hackathon category rewards metadata-aware code generation, but the safety problem is not solved by using a larger model. LineageMedic first establishes a deterministic repair and validation loop. A model adapter can later propose transformations for unfamiliar SQL shapes, but the proposal still has to satisfy the same path checks, parser checks, contracts, and human review gate.
