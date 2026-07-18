# Judging period log

This file records public availability and external feedback after the Devpost submission. It intentionally separates observed facts from follow-up decisions.

## 2026-07-18

### Confirmed public state

- The authenticated Devpost management view reports `Submitted` and `5/5 steps done`; the public page renders the video, six screenshots, full English story, demo URL, repository, live evidence, and upstream contribution links.
- The [Devpost project](https://devpost.com/software/lineagemedic) returns HTTP 200 and includes the LineageMedic title, the Build with DataHub hackathon association, and the submitted YouTube video.
- The [hosted replay](https://14188769700lbk-dev.github.io/lineage-medic/), [source repository](https://github.com/14188769700lbk-dev/lineage-medic), [repair pull request](https://github.com/14188769700lbk-dev/lineage-medic/pull/1), live-read evidence, and live-writeback evidence all return HTTP 200 without credentials.
- The public video resolves through YouTube oEmbed as `LineageMedic — Metadata-Aware Code Generation with DataHub MCP`.
- The repository's `CI` and `Deploy hosted replay` workflow badges both report `passing`.
- Repair PR #1 is open, has a successful `verify` job, and has no reviews.
- Upstream DataHub Skills PR #36 is open, has a successful conventional-title check, and has no maintainer review or external comment yet.

### Maintenance decision

- GitHub displayed a non-failing Node.js 20 deprecation warning for the v4 `checkout` and `setup-node` actions used by the historical repair PR check.
- The main CI and Pages workflows were upgraded to the current official action releases: `checkout@v7`, `setup-node@v7`, `configure-pages@v6`, `upload-pages-artifact@v5`, and `deploy-pages@v5`. The evidence branches were left unchanged to preserve the submitted repair diff and commit history.
- A desktop judge-flow audit found that the public replay hid the strongest DataHub result behind external submission materials and exposed two non-functional top-bar controls. The replay now surfaces the persisted Decision URN plus direct proof and DataHub screenshot links, while explicitly remaining read-only; the inert controls were replaced by a real change-request link.
- A public-page audit found seven empty template headings before the real story and no captions on the six gallery images. The duplicate heading block was removed and every screenshot now has a concise English caption describing the evidence it shows. The public page was rechecked after saving: it has one `Inspiration` heading, all six captions are rendered, and the submission remains `Submitted` with `5/5 steps done`.

### Monitoring triggers

- Respond to organizer or maintainer feedback when it appears; do not post empty status comments.
- Recheck the public Devpost page, replay, repository, evidence links, video, CI, and Pages after any deployment or repository change.
- Keep all public judging artifacts available until the competition results and any required verification are complete.
- Treat any DataHub writeback, Devpost attestation, or legal acceptance as a separate approval-gated action.
