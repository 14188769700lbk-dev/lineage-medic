import {
  Activity,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Database,
  ExternalLink,
  FileCode2,
  GitBranch,
  GitPullRequestArrow,
  LayoutDashboard,
  LoaderCircle,
  Network,
  Play,
  RefreshCcw,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  createHostedInitialCampaign,
  createHostedReplayCampaign,
} from "../server/fixtures/replay-campaign.js";
import type {
  AffectedAsset,
  PatchArtifact,
  RepairCampaign,
  RunCampaignResponse,
} from "../shared/types.js";

const staticReplay = import.meta.env.VITE_HOSTED_REPLAY === "true";
const generatedRepairPullRequestUrl =
  "https://github.com/14188769700lbk-dev/lineage-medic/pull/1";
const changeRequestUrl =
  "https://github.com/14188769700lbk-dev/lineage-medic/blob/main/examples/change-orders-country.json";
const liveWritebackProofUrl =
  "https://github.com/14188769700lbk-dev/lineage-medic/blob/main/examples/evidence/live-datahub-writeback.json";
const datahubDecisionScreenshotUrl =
  "https://github.com/14188769700lbk-dev/lineage-medic/blob/main/docs/assets/datahub-decision.jpg";
const pilotInquiryUrl =
  "https://github.com/14188769700lbk-dev/lineage-medic/issues/new?template=pilot-interest.yml";
const sampleRiskReviewUrl = `${import.meta.env.BASE_URL}sample-schema-change-risk-review.pdf`;
const commercialBriefUrl =
  "https://github.com/14188769700lbk-dev/lineage-medic/blob/main/COMMERCIAL.md";
const verifiedWritebackUrn =
  "urn:li:document:shared-2daff315-7440-4ffb-b1db-2fe18c765c30";

const runningPhases = [
  "Tracing column-level lineage",
  "Grounding with production queries",
  "Planning compatibility windows",
  "Generating cross-repository patches",
  "Validating the migration campaign",
  "Writing decision memory to DataHub",
];

const platformIcon: Record<AffectedAsset["type"], typeof Database> = {
  dataset: Database,
  dashboard: LayoutDashboard,
  dataJob: ServerCog,
  chart: Activity,
};

async function loadCampaign(): Promise<RunCampaignResponse> {
  if (staticReplay) {
    return {
      campaign: createHostedInitialCampaign(),
      message: "Breaking change loaded from the captured live Fiction Retail run.",
    };
  }

  const response = await fetch("/api/campaign");
  if (!response.ok) throw new Error("Could not load the repair campaign");
  return response.json() as Promise<RunCampaignResponse>;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function Logo() {
  return (
    <div className="logo-lockup">
      <span className="logo-mark" aria-hidden="true">
        <Stethoscope size={19} strokeWidth={2.2} />
      </span>
      <span>
        <strong>Lineage</strong>Medic
      </span>
    </div>
  );
}

function hasLiveMcpEvidence(campaign: RepairCampaign) {
  return campaign.evidence.some(
    (event) => event.actor === "DataHub MCP" && event.tool === "get_lineage",
  );
}

function Sidebar({ campaign }: { campaign: RepairCampaign }) {
  const platforms = new Set(campaign.assets.map((asset) => asset.platform)).size;
  const live = campaign.execution.contextMode !== "fixture";
  const liveEvidenceLoaded = hasLiveMcpEvidence(campaign);
  const capturedLiveRun = campaign.execution.contextLabel.startsWith("Captured live");
  const contextStatus = live
    ? liveEvidenceLoaded
      ? "MCP connected"
      : "MCP live mode"
    : capturedLiveRun
      ? "Recorded MCP run"
      : "MCP fixture replay";

  return (
    <aside className="sidebar">
      <Logo />

      <nav className="primary-nav" aria-label="Primary">
        <a className="nav-item active" href="#campaign">
          <CircleDot size={17} />
          Campaign
        </a>
        <a className="nav-item" href="#lineage">
          <Network size={17} />
          Lineage
        </a>
        <a className="nav-item" href="#patches">
          <GitPullRequestArrow size={17} />
          Repair PRs
        </a>
        <a className="nav-item" href="#evidence">
          <ShieldCheck size={17} />
          Evidence
        </a>
      </nav>

      <div className="sidebar-label">Active campaign</div>
      <div className="campaign-mini">
        <span className="campaign-pulse" />
        <div>
          <strong>LM-204</strong>
          <span>orders country rename</span>
        </div>
        <ChevronRight size={15} />
      </div>

      <div className="sidebar-spacer" />
      <div className="context-card">
        <div className="context-card-title">
          <Database size={15} />
          DataHub context
        </div>
        <strong>Fiction Retail</strong>
        <span>
          {campaign.assets.length} assets · {platforms} platforms
        </span>
        <div className="context-status">
          <span /> {contextStatus}
        </div>
      </div>
      <div className="user-chip">
        <div className="avatar">LM</div>
        <div>
          <strong>Repair agent</strong>
          <span>{live ? "live workspace" : capturedLiveRun ? "public replay" : "fixture workspace"}</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        Campaigns <ChevronRight size={14} /> <strong>LM-204</strong>
      </div>
      <div className="topbar-actions">
        <span className="branch-chip">
          <GitBranch size={14} /> feature/country-code
        </span>
        <a
          aria-label="Scope a USD 750 schema change risk review"
          className="ghost-button pilot-button"
          href={pilotInquiryUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Users size={14} /> Scope a $750 review
        </a>
        <a
          className="ghost-button"
          href={changeRequestUrl}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink size={14} /> Change request
        </a>
      </div>
    </header>
  );
}

function StatusPill({ campaign }: { campaign: RepairCampaign }) {
  if (campaign.status === "ready-for-review") {
    return (
      <span className="status-pill success">
        <CheckCircle2 size={14} /> Ready for review
      </span>
    );
  }

  return (
    <span className="status-pill danger">
      <Zap size={14} /> Breaking change detected
    </span>
  );
}

function ChangeSummary({ campaign }: { campaign: RepairCampaign }) {
  return (
    <section className="change-summary" id="campaign">
      <div className="change-copy">
        <div className="eyebrow-row">
          <StatusPill campaign={campaign} />
          <span className="campaign-id">{campaign.id}</span>
        </div>
        <h1>{campaign.title}</h1>
        <p>{campaign.subtitle}</p>
        <div className="change-code">
          <span className="removed">− {campaign.change.before}</span>
          <ArrowRight size={14} />
          <span className="added">+ {campaign.change.after}</span>
          <span className="change-kind">column rename</span>
        </div>
      </div>
      <div className="risk-orbit" aria-label="Critical risk, six affected assets">
        <div className="orbit orbit-outer" />
        <div className="orbit orbit-inner" />
        <div className="risk-core">
          <span>Risk</span>
          <strong>{campaign.risk}</strong>
          <small>{campaign.summary.affectedAssets} affected assets</small>
        </div>
      </div>
    </section>
  );
}

function MetricCards({ campaign }: { campaign: RepairCampaign }) {
  const completed = campaign.status === "ready-for-review";
  const metrics = [
    {
      label: "Affected assets",
      value: campaign.summary.affectedAssets,
      detail: "3 direct · 3 transitive",
      icon: Network,
      tone: "coral",
    },
    {
      label: "Repositories",
      value: campaign.summary.repositories,
      detail: "2 teams outside source",
      icon: GitBranch,
      tone: "violet",
    },
    {
      label: "Generated patches",
      value: campaign.summary.patches,
      detail: completed ? "all checks passed" : "waiting for repair run",
      icon: FileCode2,
      tone: "mint",
    },
    {
      label: "Owners coordinated",
      value: campaign.summary.owners,
      detail: "grounded in DataHub",
      icon: Users,
      tone: "amber",
    },
  ];

  return (
    <section className="metrics-grid" aria-label="Campaign metrics">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <article className="metric-card" key={metric.label}>
            <span className={`metric-icon ${metric.tone}`}>
              <Icon size={18} />
            </span>
            <div>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </div>
          </article>
        );
      })}
    </section>
  );
}

const edges = [
  ["orders", "shipping-performance"],
  ["orders", "revenue-market"],
  ["shipping-performance", "fulfillment-job"],
  ["fulfillment-job", "delivery-dashboard"],
  ["revenue-market", "finance-dashboard"],
] as const;

function LineageGraph({ assets }: { assets: AffectedAsset[] }) {
  const byId = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets],
  );

  return (
    <div className="lineage-canvas">
      <svg
        className="lineage-edges"
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f47d61" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6dd6b0" stopOpacity="0.65" />
          </linearGradient>
          <marker
            id="arrow"
            markerWidth="5"
            markerHeight="5"
            refX="4"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0 L5,2.5 L0,5 z" fill="#7a827e" />
          </marker>
        </defs>
        {edges.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          const fromX = from.x + 8;
          const toX = to.x;
          const midX = (fromX + toX) / 2;
          return (
            <path
              key={`${fromId}-${toId}`}
              d={`M ${fromX} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${toX} ${to.y}`}
              fill="none"
              stroke="url(#edge-gradient)"
              strokeWidth="0.42"
              markerEnd="url(#arrow)"
            />
          );
        })}
      </svg>

      {assets.map((asset) => {
        const Icon = platformIcon[asset.type];
        return (
          <div
            className={`asset-node ${asset.risk}`}
            key={asset.id}
            style={{ left: `${asset.x}%`, top: `${asset.y}%` }}
          >
            <span className="asset-icon">
              <Icon size={14} />
            </span>
            <div>
              <strong>{asset.name}</strong>
              <span>
                {asset.platform} · {asset.owner}
              </span>
            </div>
            {asset.usesChangedField && <span className="field-hit">field hit</span>}
          </div>
        );
      })}
    </div>
  );
}

function GraphPanel({ campaign }: { campaign: RepairCampaign }) {
  const capturedLiveRun = campaign.execution.contextLabel.startsWith("Captured live");
  const liveEvidenceLoaded = hasLiveMcpEvidence(campaign);

  return (
    <section className="panel graph-panel" id="lineage">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">DataHub context graph</span>
          <h2>Blast radius, not guesswork</h2>
        </div>
        <span className="tool-badge">
          <Database size={13} /> get_lineage · 3 hops
          {campaign.execution.contextMode === "fixture"
            ? capturedLiveRun
              ? " · recorded live"
              : " · replay"
            : liveEvidenceLoaded
              ? " · live"
              : " · live ready"}
        </span>
      </div>
      <LineageGraph assets={campaign.assets} />
      <div className="graph-legend">
        <span>
          <i className="legend-dot critical" /> critical
        </span>
        <span>
          <i className="legend-dot high" /> high
        </span>
        <span>
          <Braces size={13} /> direct field reference
        </span>
        <span className="graph-source">Fiction Retail datapack</span>
      </div>
    </section>
  );
}

function WorkflowPanel({
  campaign,
  isRunning,
  phaseIndex,
  onRun,
  onReset,
}: {
  campaign: RepairCampaign;
  isRunning: boolean;
  phaseIndex: number;
  onRun: () => void;
  onReset: () => void;
}) {
  const completed = campaign.status === "ready-for-review";

  return (
    <section className="panel workflow-panel">
      <div className="panel-heading compact">
        <div>
          <span className="section-kicker">Agent runbook</span>
          <h2>{completed ? "Campaign ready" : "Repair before merge"}</h2>
        </div>
        <Sparkles size={18} className="sparkle" />
      </div>

      <div className="runbook-list">
        {runningPhases.map((phase, index) => {
          const done = completed || (isRunning && index < phaseIndex);
          const active = isRunning && index === phaseIndex;
          return (
            <div
              className={`runbook-step ${done ? "done" : ""} ${active ? "active" : ""}`}
              key={phase}
            >
              <span className="step-marker">
                {done ? (
                  <Check size={13} />
                ) : active ? (
                  <LoaderCircle size={13} className="spin" />
                ) : (
                  index + 1
                )}
              </span>
              <div>
                <strong>{phase}</strong>
                <small>
                  {index === 0 && "Column-level dependencies across platforms"}
                  {index === 1 && "Schemas, owners and real query evidence"}
                  {index === 2 && "Producer shim + consumer migration order"}
                  {index === 3 && "Reviewable patches, not prose suggestions"}
                  {index === 4 && "Parse, refs, contract and coverage checks"}
                  {index === 5 && "Shared document + lifecycle proposal"}
                </small>
              </div>
            </div>
          );
        })}
      </div>

      {!completed ? (
        <button className="primary-button" disabled={isRunning} onClick={onRun}>
          {isRunning ? (
            <>
              <LoaderCircle size={17} className="spin" />
              {runningPhases[phaseIndex] ?? "Finalizing campaign"}
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" /> Run guided repair
            </>
          )}
        </button>
      ) : (
        <div className="completion-actions">
          {campaign.patches.some((patch) => patch.pullRequest) ? (
            <a
              className="primary-button"
              href={generatedRepairPullRequestUrl}
              rel="noreferrer"
              target="_blank"
            >
              <GitPullRequestArrow size={17} /> Review the generated PR
            </a>
          ) : (
            <button className="primary-button">
              <GitPullRequestArrow size={17} /> Review {campaign.patches.length} generated patches
            </button>
          )}
          <button className="reset-button" onClick={onReset}>
            <RefreshCcw size={15} /> Reset demo
          </button>
        </div>
      )}

      <p className="approval-note">
        <ShieldCheck size={13} /> Mutations stay behind human approval gates.
      </p>
    </section>
  );
}

function PatchList({
  patches,
  onSelect,
}: {
  patches: PatchArtifact[];
  onSelect: (patch: PatchArtifact) => void;
}) {
  const validatedPatches = patches.filter(
    (patch) => patch.status === "validated",
  ).length;

  return (
    <section className="panel patches-panel" id="patches">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Generated artifacts</span>
          <h2>Changes teams can actually merge</h2>
        </div>
        <span className="success-badge">
          <CheckCircle2 size={14} /> {validatedPatches} / {patches.length} validated
        </span>
      </div>

      <div className="patch-list">
        {patches.map((patch) => (
          <button
            className="patch-row"
            key={patch.id}
            onClick={() => onSelect(patch)}
          >
            <span className="patch-file-icon">
              <Code2 size={16} />
            </span>
            <span className="patch-main">
              <strong>{patch.title}</strong>
              <small>
                {patch.repository} · {patch.file}
              </small>
            </span>
            <span className="line-count">
              <i>+{patch.after.split("\n").length}</i>
              <b>−{patch.before.split("\n").length}</b>
            </span>
            <span className="pr-chip">
              <GitPullRequestArrow size={13} /> {patch.pullRequest ?? "local draft"}
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
    </section>
  );
}

function EvidencePanel({
  campaign,
  isWritingBack,
  onApproveWriteback,
}: {
  campaign: RepairCampaign;
  isWritingBack: boolean;
  onApproveWriteback: () => void;
}) {
  const live = campaign.execution.contextMode !== "fixture";
  const verifiedReplayWriteback =
    staticReplay &&
    hasLiveMcpEvidence(campaign) &&
    !campaign.execution.writebackPersisted;

  return (
    <section className="panel evidence-panel" id="evidence">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Auditable execution</span>
          <h2>Every decision carries evidence</h2>
        </div>
        <span className="tool-badge mint">
          <ShieldCheck size={13} />
          {campaign.execution.writebackPersisted
            ? "written back to DataHub"
            : verifiedReplayWriteback
              ? "live writeback verified"
              : "writeback package ready"}
        </span>
      </div>
      <div className="evidence-grid">
        <div className="timeline">
          {campaign.evidence.map((event) => (
            <div className="timeline-event" key={event.id}>
              <span className="timeline-dot">
                <Check size={11} />
              </span>
              <div>
                <div className="event-title">
                  <strong>{event.action}</strong>
                  <time>
                    {new Date(event.at).toLocaleTimeString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </time>
                </div>
                <p>{event.detail}</p>
                <span>
                  {event.actor}
                  {event.tool ? ` · ${event.tool}` : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="writeback-card">
          <span className="writeback-icon">
            <Database size={19} />
          </span>
          <span className="section-kicker">Shared agent memory</span>
          <h3>{campaign.writeback.documentTitle}</h3>
          <p>
            {campaign.execution.writebackPersisted
              ? "The reasoning, repair patches, validation results and removal window now live beside the affected assets—not in a disposable chat transcript."
              : verifiedReplayWriteback
                ? "This replay prepared the same Decision that a separate, explicitly approved live run persisted to DataHub."
                : "A complete decision document is ready locally. The live save_document mutation remains behind an explicit human approval gate."}
          </p>
          <div className="writeback-row">
            <span>{verifiedReplayWriteback ? "Replay document" : "Document"}</span>
            <code>{campaign.writeback.documentUrn}</code>
          </div>
          <div className="writeback-row">
            <span>Lifecycle</span>
            <strong>{campaign.writeback.lifecycleProposal}</strong>
          </div>
          {verifiedReplayWriteback ? (
            <div className="verified-writeback">
              <div className="verified-writeback-title">
                <CheckCircle2 size={14} />
                <strong>Verified live writeback</strong>
              </div>
              <p>
                A separate approval-gated MCP run persisted this same Decision to
                DataHub. The public replay stays read-only.
              </p>
              <code>{verifiedWritebackUrn}</code>
              <div className="writeback-proof-actions">
                <a
                  className="ghost-button"
                  href={liveWritebackProofUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FileCode2 size={13} /> Proof JSON
                </a>
                <a
                  className="ghost-button"
                  href={datahubDecisionScreenshotUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink size={13} /> DataHub view
                </a>
              </div>
            </div>
          ) : (
            <button
              className="ghost-button wide"
              disabled={!live || campaign.execution.writebackPersisted || isWritingBack}
              onClick={onApproveWriteback}
            >
              {isWritingBack
                ? "Writing decision to DataHub"
                : campaign.execution.writebackPersisted
                  ? "Decision saved to DataHub"
                  : live
                    ? "Approve DataHub writeback"
                    : "Connect live DataHub to write back"}
              {isWritingBack ? (
                <LoaderCircle size={14} className="spin" />
              ) : campaign.execution.writebackPersisted ? (
                <CheckCircle2 size={14} />
              ) : (
                <ShieldCheck size={14} />
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function PilotOffer() {
  return (
    <section className="panel pilot-offer" aria-labelledby="pilot-offer-title">
      <div className="pilot-offer-copy">
        <span className="section-kicker">Fixed-scope commercial pilot</span>
        <h2 id="pilot-offer-title">
          One risky schema change. Five days. No production writes.
        </h2>
        <p>
          Get a read-only blast-radius, ownership, and contract-risk review for
          one proposed rename, removal, or compatible type change. Start with
          sanitized metadata and isolated repository snapshots.
        </p>
        <div className="pilot-proof-row" aria-label="Pilot boundaries">
          <span>
            <ShieldCheck size={13} /> Read-only discovery
          </span>
          <span>
            <Clock3 size={13} /> Five-business-day target
          </span>
          <span>
            <CheckCircle2 size={13} /> Reviewable evidence
          </span>
        </div>
      </div>
      <div className="pilot-offer-action">
        <span>Schema Change Risk Review</span>
        <strong>
          <small>USD</small> 750
        </strong>
        <p>Fixed scope · one data domain · up to 25 catalog assets</p>
        <a
          className="primary-button"
          href={pilotInquiryUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Users size={16} /> Request a non-sensitive scope check
        </a>
        <div className="pilot-offer-links">
          <a href={sampleRiskReviewUrl} download>
            Download sample PDF <ExternalLink size={12} />
          </a>
          <a href={commercialBriefUrl} rel="noreferrer" target="_blank">
            Full scope <ExternalLink size={12} />
          </a>
        </div>
        <small className="pilot-disclosure">
          Offer hypothesis, not a claim of existing customers or revenue.
        </small>
      </div>
    </section>
  );
}

function PatchDrawer({
  patch,
  onClose,
}: {
  patch: PatchArtifact;
  onClose: () => void;
}) {
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        aria-label="Patch details"
        aria-modal="true"
        className="patch-drawer"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className="section-kicker">Repair artifact</span>
            <h2>{patch.title}</h2>
          </div>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="drawer-meta">
          <span>
            <GitBranch size={14} /> {patch.repository}
          </span>
          <span>
            <FileCode2 size={14} /> {patch.file}
          </span>
          <span className="success-badge">
            <CheckCircle2 size={13} /> validated
          </span>
        </div>
        <div className="reasoning-box">
          <Sparkles size={16} />
          <div>
            <strong>Why this patch exists</strong>
            <p>{patch.rationale}</p>
          </div>
        </div>
        <div className="diff-view">
          <div className="diff-filebar">
            <span>{patch.file}</span>
            <span>
              <i>+{patch.after.split("\n").length}</i>
              <b>−{patch.before.split("\n").length}</b>
            </span>
          </div>
          <pre className="diff-block removed-block">
            {patch.before.split("\n").map((line, index) => (
              <span key={`${line}-${index}`}>
                <em>−</em>
                {line}
              </span>
            ))}
          </pre>
          <pre className="diff-block added-block">
            {patch.after.split("\n").map((line, index) => (
              <span key={`${line}-${index}`}>
                <em>+</em>
                {line}
              </span>
            ))}
          </pre>
        </div>
        <div className="drawer-footer">
          <div>
            <CheckCircle2 size={15} /> SQL parse and contract checks passed
          </div>
          {patch.pullRequest ? (
            <a
              className="primary-button compact-button"
              href={generatedRepairPullRequestUrl}
              rel="noreferrer"
              target="_blank"
            >
              <GitPullRequestArrow size={16} />
              Open generated PR {patch.pullRequest}
            </a>
          ) : (
            <button className="primary-button compact-button" disabled>
              <GitPullRequestArrow size={16} /> Draft PR pending
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="loading-screen">
      <Logo />
      <LoaderCircle className="spin" />
      <span>Loading DataHub context…</span>
    </div>
  );
}

export function App() {
  const [campaign, setCampaign] = useState<RepairCampaign | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [selectedPatch, setSelectedPatch] = useState<PatchArtifact | null>(null);
  const [isWritingBack, setIsWritingBack] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaign()
      .then((result) => setCampaign(result.campaign))
      .catch((caught: unknown) =>
        setError(caught instanceof Error ? caught.message : "Unknown error"),
      );
  }, []);

  async function runCampaign() {
    setIsRunning(true);
    setError(null);

    try {
      for (let index = 0; index < runningPhases.length; index += 1) {
        setPhaseIndex(index);
        await wait(index === 0 ? 500 : 380);
      }

      if (staticReplay) {
        setCampaign(createHostedReplayCampaign());
      } else {
        const response = await fetch("/api/campaign/run", { method: "POST" });
        if (!response.ok) throw new Error("Repair run failed");
        const result = (await response.json()) as RunCampaignResponse;
        setCampaign(result.campaign);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Repair run failed");
    } finally {
      setIsRunning(false);
      setPhaseIndex(0);
    }
  }

  async function resetCampaign() {
    setError(null);
    if (staticReplay) {
      setCampaign(createHostedInitialCampaign());
      return;
    }

    const response = await fetch("/api/campaign/reset", { method: "POST" });
    if (!response.ok) {
      setError("Could not reset the demo");
      return;
    }
    const result = (await response.json()) as RunCampaignResponse;
    setCampaign(result.campaign);
  }

  async function approveWriteback() {
    setIsWritingBack(true);
    setError(null);
    try {
      if (staticReplay) {
        setCampaign(createHostedReplayCampaign());
        return;
      }

      const response = await fetch("/api/campaign/writeback", { method: "POST" });
      if (!response.ok) throw new Error("DataHub writeback failed");
      const result = (await response.json()) as RunCampaignResponse;
      setCampaign(result.campaign);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "DataHub writeback failed");
    } finally {
      setIsWritingBack(false);
    }
  }

  if (!campaign && !error) return <EmptyState />;

  if (error || !campaign) {
    return (
      <div className="error-screen">
        <Stethoscope size={32} />
        <h1>LineageMedic could not start</h1>
        <p>{error}</p>
        <button className="primary-button" onClick={() => window.location.reload()}>
          <RefreshCcw size={16} /> Try again
        </button>
      </div>
    );
  }

  const completed = campaign.status === "ready-for-review";

  return (
    <div className="app-shell">
      <Sidebar campaign={campaign} />
      <div className="workspace">
        <Topbar />
        <main>
          <ChangeSummary campaign={campaign} />
          <MetricCards campaign={campaign} />
          <div className="main-grid">
            <GraphPanel campaign={campaign} />
            <WorkflowPanel
              campaign={campaign}
              isRunning={isRunning}
              phaseIndex={phaseIndex}
              onRun={runCampaign}
              onReset={resetCampaign}
            />
          </div>
          {completed && (
            <>
              <PatchList patches={campaign.patches} onSelect={setSelectedPatch} />
              <EvidencePanel
                campaign={campaign}
                isWritingBack={isWritingBack}
                onApproveWriteback={approveWriteback}
              />
            </>
          )}
          <PilotOffer />
          <footer className="app-footer">
            <span>LineageMedic · Built for the DataHub Agent Hackathon</span>
            <span>
              Apache 2.0 · Fiction Retail data is CC0
              <Clock3 size={12} /> Updated just now
            </span>
          </footer>
        </main>
      </div>
      {selectedPatch && (
        <PatchDrawer patch={selectedPatch} onClose={() => setSelectedPatch(null)} />
      )}
    </div>
  );
}
