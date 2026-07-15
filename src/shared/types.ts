export type CampaignStatus =
  | "change-detected"
  | "analyzing"
  | "planning"
  | "patching"
  | "validating"
  | "ready-for-review";

export type RiskLevel = "critical" | "high" | "medium" | "low";

export type ContextMode = "fixture" | "mcp-http" | "mcp-stdio";

export interface ProposedChange {
  id: string;
  datasetUrn: string;
  datasetName: string;
  platform: string;
  field: string;
  kind: "rename" | "remove" | "type-change";
  before: string;
  after: string;
  pullRequest: string;
  repository: string;
  detectedAt: string;
}

export interface AffectedAsset {
  id: string;
  urn: string;
  name: string;
  type: "dataset" | "dashboard" | "dataJob" | "chart";
  platform: string;
  owner: string;
  domain: string;
  hops: number;
  risk: RiskLevel;
  usesChangedField: boolean;
  usageEvidence: string;
  repository?: string;
  file?: string;
  x: number;
  y: number;
}

export interface PatchArtifact {
  id: string;
  repository: string;
  file: string;
  title: string;
  rationale: string;
  before: string;
  after: string;
  status: "proposed" | "generated" | "validated";
  pullRequest?: string;
}

export interface ValidationCheck {
  id: string;
  label: string;
  detail: string;
  status: "pending" | "passed" | "failed";
  durationMs?: number;
}

export interface EvidenceEvent {
  id: string;
  at: string;
  actor:
    | "DataHub MCP"
    | "DataHub fixture"
    | "LineageMedic"
    | "Git"
    | "Validator";
  action: string;
  detail: string;
  tool?: string;
  status: "waiting" | "running" | "complete";
}

export interface DataHubWriteback {
  documentTitle: string;
  documentUrn: string;
  lifecycleProposal: string;
  status: "pending" | "planned" | "written";
}

export interface CampaignExecution {
  contextMode: ContextMode;
  contextLabel: string;
  workspacePath?: string;
  manifestPath?: string;
  writebackPersisted: boolean;
}

export interface RepairCampaign {
  id: string;
  title: string;
  subtitle: string;
  status: CampaignStatus;
  risk: RiskLevel;
  change: ProposedChange;
  assets: AffectedAsset[];
  patches: PatchArtifact[];
  validations: ValidationCheck[];
  evidence: EvidenceEvent[];
  writeback: DataHubWriteback;
  execution: CampaignExecution;
  summary: {
    affectedAssets: number;
    repositories: number;
    patches: number;
    owners: number;
  };
}

export interface RunCampaignResponse {
  campaign: RepairCampaign;
  message: string;
}
