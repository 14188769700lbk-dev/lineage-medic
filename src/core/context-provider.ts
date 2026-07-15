import type {
  AffectedAsset,
  ContextMode,
  ProposedChange,
} from "../shared/types.js";

export type RepairPolicy =
  | "producer-compatibility"
  | "migrate-consumer"
  | "preserve-output";

export interface RepositoryBinding {
  assetUrn: string;
  repository: string;
  file: string;
  policy: RepairPolicy;
  contractFile?: string;
}

export interface ProductionQueryEvidence {
  assetUrn: string;
  sql: string;
  source: "MANUAL" | "SYSTEM";
  lastSeenAt: string;
}

export interface DataHubToolTrace {
  name: "get_lineage" | "get_entities" | "get_dataset_queries" | "save_document";
  arguments: Record<string, unknown>;
  responseSummary: string;
  status: "complete" | "skipped";
}

export interface DataHubContextSnapshot {
  mode: ContextMode;
  label: string;
  recordedAt?: string;
  assets: AffectedAsset[];
  bindings: RepositoryBinding[];
  queries: ProductionQueryEvidence[];
  toolCalls: DataHubToolTrace[];
  rawResponses?: Record<string, unknown>;
}

export interface DecisionWriteback {
  documentType: "Decision";
  title: string;
  content: string;
  relatedAssets: string[];
  topics: string[];
}

export interface WritebackResult {
  persisted: boolean;
  urn: string;
  message: string;
  trace: DataHubToolTrace;
}

export interface DataHubContextProvider {
  load(change: ProposedChange): Promise<DataHubContextSnapshot>;
  saveDecision(
    decision: DecisionWriteback,
    approved: boolean,
  ): Promise<WritebackResult>;
}
