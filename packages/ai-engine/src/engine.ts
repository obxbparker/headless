/**
 * runGeneration() — the edge-safe entrypoint for the AI engine. Takes all
 * credentials as arguments (no fs, no dotenv). Used by:
 *   - the portal's /api/generate route (Cloudflare Pages edge runtime)
 *   - the CLI (via orchestrator.ts, which resolves creds via config-node.ts)
 *
 * Page generations run in parallel via Promise.all to fit Cloudflare Pages
 * Functions' 30-second wall-clock budget. The Anthropic prompt cache is
 * shared by prefix, so cache hits work the same regardless of request order.
 */
import { createAnthropic } from "./claude.js";
import type { EngineCredentials } from "./config.js";
import { generatePage } from "./generate-page.js";
import { generateSettings } from "./generate-settings.js";
import { parseSitemap } from "./parse-sitemap.js";
import { createPortalClient, fetchIntake } from "./portal.js";
import type { GeneratedPage, SiteContext } from "./types.js";
import { writeSite } from "./writer.js";

export type RunGenerationOptions = {
  credentials: EngineCredentials;
  intakeId: string;
  /** Override the target client slug used for fallback URL building. Defaults to credentials.target.projectId. */
  targetSlug?: string;
  dryRun?: boolean;
  /**
   * Max concurrent page-generation requests. Default 1 (sequential) to
   * stay under Anthropic's default 4k-output-tokens/minute org limit on
   * standard accounts. Raise to 2-4 once you've requested a higher rate
   * limit (see https://docs.claude.com/en/api/rate-limits).
   */
  concurrency?: number;
  onProgress?: (msg: string) => void;
};

export type GenerateReport = {
  pagesGenerated: number;
  pagesWritten: number;
  settingsWritten: boolean;
  assetsUploaded: number;
  targetProjectId: string;
  tokensIn: number;
  tokensOut: number;
  cacheReads: number;
  durationMs: number;
  preview?: { settings: unknown; pages: unknown[] };
};

const noop = () => {};

export async function runGeneration(opts: RunGenerationOptions): Promise<GenerateReport> {
  const log = opts.onProgress ?? noop;
  const startedAt = Date.now();
  const { credentials } = opts;

  const claude = {
    client: createAnthropic(credentials.anthropic.apiKey),
    model: credentials.anthropic.model,
  };
  const portal = createPortalClient(credentials.portal);

  log(`Fetching intake ${opts.intakeId}…`);
  const intake = await fetchIntake(portal, opts.intakeId);
  log(`  Business: ${intake.businessName}`);

  const pageIntents = parseSitemap(intake.sitemap, intake.businessName);
  log(`Parsed sitemap → ${pageIntents.length} pages: ${pageIntents.map((p) => p.slug).join(", ")}`);

  const fallbackSlug = opts.targetSlug ?? credentials.target.projectId;
  const primaryUrl = intake.primaryDomain
    ? intake.primaryDomain.startsWith("http")
      ? intake.primaryDomain
      : `https://${intake.primaryDomain.replace(/^\/+/, "")}`
    : `https://${fallbackSlug}.pages.dev`;

  const destinationEmail =
    extractEmail(intake.existingCopy) ||
    extractEmail(intake.notes) ||
    `contact@${intake.primaryDomain?.replace(/^https?:\/\//, "") ?? `${fallbackSlug}.example.com`}`;

  const context: SiteContext = {
    intake,
    pages: pageIntents,
    primaryUrl,
    destinationEmail,
  };

  const concurrency = Math.max(1, opts.concurrency ?? 1);
  log(`Generating ${pageIntents.length} pages (concurrency=${concurrency})…`);
  const results = await mapConcurrent(pageIntents, concurrency, async (intent, idx) => {
    const { result, tokens } = await generatePage(claude, context, intent);
    log(
      `  [${idx + 1}/${pageIntents.length}] /${intent.slug === "home" ? "" : intent.slug} → ${result.blocks.length} blocks · in=${tokens.in} out=${tokens.out}${
        tokens.cacheRead ? ` cacheRead=${tokens.cacheRead}` : ""
      }`,
    );
    return { result, tokens };
  });

  const pages: GeneratedPage[] = results.map((r) => r.result);
  const tokensIn = results.reduce((s, r) => s + r.tokens.in, 0);
  const tokensOut = results.reduce((s, r) => s + r.tokens.out, 0);
  const cacheReads = results.reduce((s, r) => s + (r.tokens.cacheRead ?? 0), 0);

  log(`Generating site settings (tagline + llms.txt)…`);
  const settings = await generateSettings(claude, context, pages);

  log(`Writing to target Sanity project ${credentials.target.projectId} (dataset=${credentials.target.dataset})…`);
  const { stats, preview } = await writeSite(credentials.target, { settings, pages }, { dryRun: opts.dryRun });
  log(
    opts.dryRun
      ? `  DRY-RUN: ${pages.length} pages prepared, ${stats.assetsUploaded} assets would be uploaded.`
      : `  ✓ wrote siteSettings + ${stats.pagesWritten} pages, uploaded ${stats.assetsUploaded} assets.`,
  );

  return {
    pagesGenerated: pages.length,
    pagesWritten: stats.pagesWritten,
    settingsWritten: stats.settingsWritten,
    assetsUploaded: stats.assetsUploaded,
    targetProjectId: credentials.target.projectId,
    tokensIn,
    tokensOut,
    cacheReads,
    durationMs: Date.now() - startedAt,
    preview: opts.dryRun ? preview : undefined,
  };
}

function extractEmail(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const m = text.match(/[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : undefined;
}

async function mapConcurrent<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const idx = next++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx]!, idx);
    }
  }
  const n = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: n }, () => worker()));
  return results;
}
