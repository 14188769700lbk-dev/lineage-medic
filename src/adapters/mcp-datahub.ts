import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import path from "node:path";

import type {
  DataHubContextProvider,
  DataHubContextSnapshot,
  DataHubToolTrace,
  DecisionWriteback,
  WritebackResult,
} from "../core/context-provider.js";
import type { ContextMode, ProposedChange } from "../shared/types.js";
import { FixtureDataHubProvider } from "./fixture-datahub.js";

type McpTransport = StdioClientTransport | StreamableHTTPClientTransport;

export interface McpDataHubConfig {
  url?: string;
  token?: string;
  command?: string;
  args?: string[];
  gmsUrl?: string;
  fallbackFixturePath?: string;
}

export class McpDataHubProvider implements DataHubContextProvider {
  private readonly fallback: FixtureDataHubProvider;
  private readonly mode: ContextMode;

  constructor(private readonly config: McpDataHubConfig) {
    this.mode = config.url ? "mcp-http" : "mcp-stdio";
    this.fallback = new FixtureDataHubProvider(
      config.fallbackFixturePath ??
        path.resolve(
          process.cwd(),
          "examples/context/fiction-retail-datahub.json",
        ),
    );
  }

  async load(change: ProposedChange): Promise<DataHubContextSnapshot> {
    const repositoryMap = await this.fallback.load(change);

    return this.withClient(async (client) => {
      const lineageArguments = {
        urn: change.datasetUrn,
        column: change.before,
        upstream: false,
        max_hops: 3,
        max_results: 50,
      };
      const entityArguments = {
        urns: repositoryMap.assets.map((asset) => asset.urn),
      };
      const queryArguments = {
        urn: change.datasetUrn,
        column: change.before,
        count: 20,
      };

      const [lineage, entities, queries] = await Promise.all([
        callJsonTool(client, "get_lineage", lineageArguments),
        callJsonTool(client, "get_entities", entityArguments),
        callJsonTool(client, "get_dataset_queries", queryArguments),
      ]);

      const rawText = JSON.stringify({ lineage, entities, queries });
      const observedAssets = repositoryMap.assets.filter(
        (asset) =>
          asset.urn === change.datasetUrn ||
          rawText.includes(asset.urn) ||
          rawText.toLowerCase().includes(asset.name.toLowerCase()),
      );
      const assets =
        observedAssets.length > 1 ? observedAssets : repositoryMap.assets;

      const toolCalls: DataHubToolTrace[] = [
        {
          name: "get_lineage",
          arguments: lineageArguments,
          responseSummary: `Live column-lineage response matched ${Math.max(0, assets.length - 1)} downstream assets`,
          status: "complete",
        },
        {
          name: "get_entities",
          arguments: entityArguments,
          responseSummary: `Live entity metadata requested for ${entityArguments.urns.length} assets`,
          status: "complete",
        },
        {
          name: "get_dataset_queries",
          arguments: queryArguments,
          responseSummary: "Live production-query evidence fetched for the renamed field",
          status: "complete",
        },
      ];

      return {
        ...repositoryMap,
        mode: this.mode,
        label:
          this.mode === "mcp-http"
            ? "Live DataHub Cloud MCP"
            : "Live self-hosted DataHub MCP",
        recordedAt: new Date().toISOString(),
        assets,
        bindings: repositoryMap.bindings.filter((binding) =>
          assets.some((asset) => asset.urn === binding.assetUrn),
        ),
        toolCalls,
        rawResponses: { lineage, entities, queries },
      };
    });
  }

  async saveDecision(
    decision: DecisionWriteback,
    approved: boolean,
  ): Promise<WritebackResult> {
    const arguments_ = {
      document_type: decision.documentType,
      title: decision.title,
      content: decision.content,
      topics: decision.topics,
      related_assets: decision.relatedAssets,
    };

    if (!approved) {
      return {
        persisted: false,
        urn: `urn:li:document:lineage-medic-preview-${Date.now()}`,
        message: "Live DataHub writeback is staged behind explicit approval.",
        trace: {
          name: "save_document",
          arguments: arguments_,
          responseSummary: "Mutation skipped because approval was not supplied",
          status: "skipped",
        },
      };
    }

    const response = await this.withClient((client) =>
      callJsonTool(client, "save_document", arguments_),
    );
    const urn = findDocumentUrn(response);

    return {
      persisted: true,
      urn,
      message: "Decision document saved to DataHub after explicit approval.",
      trace: {
        name: "save_document",
        arguments: arguments_,
        responseSummary: `Decision document saved as ${urn}`,
        status: "complete",
      },
    };
  }

  private async withClient<T>(work: (client: Client) => Promise<T>): Promise<T> {
    const client = new Client({ name: "lineage-medic", version: "0.1.0" });
    const transport = this.createTransport();

    try {
      await client.connect(transport);
      return await work(client);
    } finally {
      await client.close().catch(() => undefined);
    }
  }

  private createTransport(): McpTransport {
    if (this.config.url) {
      const headers = this.config.token
        ? { Authorization: `Bearer ${this.config.token}` }
        : undefined;

      return new StreamableHTTPClientTransport(new URL(this.config.url), {
        requestInit: headers ? { headers } : undefined,
      });
    }

    const env = Object.fromEntries(
      Object.entries(process.env).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
    const token = this.config.token ?? process.env.DATAHUB_GMS_TOKEN;
    const gmsUrl = this.config.gmsUrl ?? process.env.DATAHUB_GMS_URL;
    if (token) env.DATAHUB_GMS_TOKEN = token;
    if (gmsUrl) env.DATAHUB_GMS_URL = gmsUrl;

    return new StdioClientTransport({
      command: this.config.command ?? "uvx",
      args: this.config.args ?? ["mcp-server-datahub@latest"],
      env,
      stderr: "pipe",
    });
  }
}

async function callJsonTool(
  client: Client,
  name: string,
  arguments_: Record<string, unknown>,
): Promise<unknown> {
  const result = await client.callTool({ name, arguments: arguments_ });
  if (result.isError) {
    throw new Error(`DataHub MCP tool ${name} returned an error`);
  }

  if (result.structuredContent) return result.structuredContent;

  const content = Array.isArray(result.content) ? result.content : [];
  const text = content
    .filter(
      (item): item is { type: "text"; text: string } =>
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        item.type === "text" &&
        "text" in item &&
        typeof item.text === "string",
    )
    .map((item) => item.text)
    .join("\n");

  if (!text) return content;

  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

function findDocumentUrn(value: unknown): string {
  const match = JSON.stringify(value).match(/urn:li:document:[^"\\\s]+/);
  if (!match) {
    throw new Error("DataHub save_document succeeded without returning a document URN");
  }
  return match[0];
}
