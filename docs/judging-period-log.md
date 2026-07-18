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
- The official rules allow judges to score solely from the description, images, and video without running the project. The README now opens with a six-link, 90-second evidence table, and both README and Devpost explain the bounded agent loop—observe, plan, act, prove, remember—without weakening the deterministic validation and approval boundaries. The public Devpost page was rechecked after saving and renders the explanation exactly once.
- A scheduled `Judging assets health` workflow now runs twice daily and on demand. It verifies the hosted replay plus bundled JavaScript/CSS, the semantic contents of both live DataHub evidence files, the DataHub Decision screenshot, YouTube oEmbed visibility, the generated repair PR, and the upstream contribution. Devpost itself remains a manual signed-in browser check because its Cloudflare policy blocks non-interactive probes; treating that response as a failure would create false alerts.
- A signed-in YouTube watch-page check reports `PT2M45S` metadata and a `164.541`-second media duration, proving the submitted video is below the three-minute limit. The public GitHub repository page renders an `Apache-2.0 license` link to the root `LICENSE` file. The health workflow now also fails if GitHub stops recognizing the license or the judge-first README entry disappears; YouTube duration remains a recorded manual check because unattended player requests are challenged as bots, while oEmbed visibility is monitored automatically.

### Monitoring triggers

- Respond to organizer or maintainer feedback when it appears; do not post empty status comments.
- Recheck the public Devpost page, replay, repository, evidence links, video, CI, and Pages after any deployment or repository change.
- Keep all public judging artifacts available until the competition results and any required verification are complete.
- Treat any DataHub writeback, Devpost attestation, or legal acceptance as a separate approval-gated action.

### Public communication and announcements

- Devpost notifications are empty, the hackathon discussion board has no topics, and the project gallery has not been published yet.
- The organizer announced a free `From Zero to a Working DataHub Agent in 30 Minutes` build session for July 21, 2026 at 14:00 UTC. Attendance requires a person to register and join; monitor the official updates page for a recording or reusable references after the session rather than claiming attendance.
- Published the factual Devpost update [Live DataHub MCP proof is public](https://devpost.com/software/lineagemedic/updates/797949). It links the no-login replay, sanitized live-read evidence, and approved writeback proof, and makes no new capability claim beyond already published artifacts.

### Clean-clone reproducibility audit

- A first shallow clone of the public repository on Windows exposed a real portability defect: Git's default CRLF checkout changed the checked-in SQL/YAML bytes while the engine emitted LF, causing the strict sample-parity test to fail even though the generated code was semantically identical.
- Added `.gitattributes` rules that preserve LF for all source and published text artifacts. The byte-level assertion was intentionally kept strict rather than weakened through newline normalization. Vitest now also ignores the local `tools/` directory so nested audit clones cannot be mistaken for project tests.
- A second public shallow clone at commit `3196e16`, forced to `core.autocrlf=true` and using only D-drive npm cache/temp paths, completed `npm ci`, `npm run demo`, `npm run verify`, and `npm run health:public`. It produced three complete fixture MCP reads, four patches, four passed validators, and nine files contained beneath `.lineage-medic/runs/LM-204/`; `git status --porcelain` remained empty.
