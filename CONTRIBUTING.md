# Contributing

Issues and focused pull requests are welcome.

1. Fork the repository and create a branch.
2. Install with `npm ci`.
3. Add or update tests for behavioral changes.
4. Run `npm run verify`.
5. Keep fixture responses synthetic or publicly shareable; never commit DataHub tokens or private metadata.

Repairs should remain reviewable and deterministic. If adding an LLM-backed strategy, keep it behind the existing path checks, validators, and mutation approval boundary.
