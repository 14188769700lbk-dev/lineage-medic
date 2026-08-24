import { appendFile } from "node:fs/promises";

const REQUEST_TIMEOUT_MS = 15_000;
const USER_AGENT =
  "LineageMedic-judging-health/1.0 (+https://github.com/14188769700lbk-dev/lineage-medic)";

const urls = {
  demo: "https://14188769700lbk-dev.github.io/lineage-medic/",
  sampleReport:
    "https://14188769700lbk-dev.github.io/lineage-medic/sample-schema-change-risk-review.pdf",
  sitemap: "https://14188769700lbk-dev.github.io/lineage-medic/sitemap.xml",
  readEvidence:
    "https://raw.githubusercontent.com/14188769700lbk-dev/lineage-medic/main/examples/evidence/live-datahub-read-run.json",
  writebackEvidence:
    "https://raw.githubusercontent.com/14188769700lbk-dev/lineage-medic/main/examples/evidence/live-datahub-writeback.json",
  dataHubDecision:
    "https://raw.githubusercontent.com/14188769700lbk-dev/lineage-medic/main/docs/assets/datahub-decision.jpg",
  repository: "https://github.com/14188769700lbk-dev/lineage-medic",
  repairPr: "https://github.com/14188769700lbk-dev/lineage-medic/pull/1",
  upstreamPr: "https://github.com/datahub-project/datahub-skills/pull/36",
  youtubeOEmbed:
    "https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DWohjWxcAYfo&format=json",
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchResponse(url) {
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": USER_AGENT },
        redirect: "follow",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 750));
      }
    }
  }

  throw lastError;
}

async function fetchText(url) {
  return (await fetchResponse(url)).text();
}

async function fetchJson(url) {
  return (await fetchResponse(url)).json();
}

const checks = [
  {
    name: "Hosted replay and bundled assets",
    run: async () => {
      const html = await fetchText(urls.demo);
      assert(html.includes("LineageMedic — Data change repair campaigns"), "demo title is missing");

      const assetPaths = [
        ...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g),
      ].map((match) => match[1]);
      assert(assetPaths.length >= 2, "expected JavaScript and CSS assets");

      await Promise.all(
        assetPaths.map((path) => fetchResponse(new URL(path, urls.demo).toString())),
      );
      return `${assetPaths.length} bundled assets reachable`;
    },
  },
  {
    name: "Downloadable synthetic risk-review sample",
    run: async () => {
      const response = await fetchResponse(urls.sampleReport);
      const contentType = response.headers.get("content-type") ?? "";
      const bytes = Buffer.from(await response.arrayBuffer());
      assert(contentType.includes("application/pdf"), `unexpected content type: ${contentType}`);
      assert(bytes.length > 10_000, `PDF is unexpectedly small: ${bytes.length} bytes`);
      assert(bytes.subarray(0, 5).toString("ascii") === "%PDF-", "PDF signature is missing");
      return `${contentType}, ${bytes.length} bytes`;
    },
  },
  {
    name: "Search discovery metadata",
    run: async () => {
      const [html, sitemap] = await Promise.all([
        fetchText(urls.demo),
        fetchText(urls.sitemap),
      ]);

      assert(html.includes('type="application/ld+json"'), "structured service data is missing");
      assert(html.includes("LineageMedic Schema Change Risk Review"), "service name is missing");
      assert(html.includes('rel="sitemap"'), "sitemap link is missing");
      assert(sitemap.includes(urls.demo), "homepage is missing from sitemap");
      assert(sitemap.includes(urls.sampleReport), "sample report is missing from sitemap");
      return "structured service offer and 2 sitemap URLs reachable";
    },
  },
  {
    name: "Live DataHub MCP read evidence",
    run: async () => {
      const evidence = await fetchJson(urls.readEvidence);
      const toolCalls = evidence?.context?.toolCalls ?? [];
      const names = toolCalls.map((call) => call.name);

      assert(evidence?.campaignId === "LM-204", "unexpected campaign id");
      assert(evidence?.context?.mode === "mcp-stdio", "live MCP mode is missing");
      assert(
        ["get_lineage", "get_entities", "get_dataset_queries"].every((name) =>
          names.includes(name),
        ),
        "required DataHub MCP reads are missing",
      );
      assert(toolCalls.every((call) => call.status === "complete"), "an MCP read is incomplete");
      assert(evidence?.patches?.length === 4, "expected four generated patches");
      assert(
        evidence?.validations?.length === 4 &&
          evidence.validations.every((validation) => validation.status === "passed"),
        "expected four passed validations",
      );
      return "3 MCP reads, 4 patches, 4 passed validations";
    },
  },
  {
    name: "Approved DataHub writeback evidence",
    run: async () => {
      const evidence = await fetchJson(urls.writebackEvidence);
      assert(evidence?.approval?.explicitlyGranted === true, "explicit approval is missing");
      assert(evidence?.approval?.afterValidation === true, "approval order is missing");
      assert(evidence?.toolCall?.name === "save_document", "save_document proof is missing");
      assert(evidence?.toolCall?.status === "complete", "save_document is incomplete");
      assert(evidence?.result?.persisted === true, "writeback is not marked persisted");
      assert(
        /^urn:li:document:shared-/.test(evidence?.result?.documentUrn ?? ""),
        "persisted DataHub document URN is invalid",
      );
      return evidence.result.documentUrn;
    },
  },
  {
    name: "Published DataHub Decision screenshot",
    run: async () => {
      const response = await fetchResponse(urls.dataHubDecision);
      const contentType = response.headers.get("content-type") ?? "";
      const bytes = (await response.arrayBuffer()).byteLength;
      assert(contentType.startsWith("image/"), `unexpected content type: ${contentType}`);
      assert(bytes > 100_000, `screenshot is unexpectedly small: ${bytes} bytes`);
      return `${contentType}, ${bytes} bytes`;
    },
  },
  {
    name: "Public Apache-2.0 repository",
    run: async () => {
      const html = await fetchText(urls.repository);
      assert(html.includes("Apache-2.0 license"), "GitHub did not detect Apache-2.0");
      assert(html.includes("Judge it in 90 seconds"), "judge-first README entry is missing");
      return "Apache-2.0 detected and judge-first README rendered";
    },
  },
  {
    name: "Public demo video",
    run: async () => {
      const metadata = await fetchJson(urls.youtubeOEmbed);
      assert(metadata?.title?.includes("LineageMedic"), "YouTube title is missing LineageMedic");
      return metadata.title;
    },
  },
  {
    name: "Generated repair pull request",
    run: async () => {
      const html = await fetchText(urls.repairPr);
      assert(html.includes("feat: generate LM-204 cross-repo repairs"), "repair PR title is missing");
      return "PR #1 reachable";
    },
  },
  {
    name: "Upstream DataHub contribution",
    run: async () => {
      const html = await fetchText(urls.upstreamPr);
      assert(html.includes("feat: add DataHub metadata audit skill"), "upstream PR title is missing");
      return "datahub-skills PR #36 reachable";
    },
  },
];

const results = [];

for (const check of checks) {
  try {
    const detail = await check.run();
    results.push({ name: check.name, status: "PASS", detail });
    console.log(`PASS ${check.name}: ${detail}`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    results.push({ name: check.name, status: "FAIL", detail });
    console.error(`FAIL ${check.name}: ${detail}`);
  }
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results
    .map(
      (result) =>
        `| ${result.status === "PASS" ? "✅" : "❌"} | ${result.name} | ${String(result.detail).replaceAll("|", "\\|")} |`,
    )
    .join("\n");
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    `## Judging assets health\n\n| Status | Check | Detail |\n| --- | --- | --- |\n${rows}\n`,
  );
}

const failures = results.filter((result) => result.status === "FAIL");
if (failures.length > 0) {
  process.exitCode = 1;
}
