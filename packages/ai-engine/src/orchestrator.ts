import { fetchIntake } from "./portal.js";
import { parseSitemap } from "./parse-sitemap.js";
import { generatePage } from "./generate-page.js";
import { generateSettings } from "./generate-settings.js";
import { writeSite } from "./writer.js";
import { loadTargetClientEnv } from "./config.js";
import type { GeneratedPage, SiteContext } from "./types.js";

export type GenerateOptions = {
  intakeId: string;
  targetSlug: string;
  dryRun?: boolean;
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
  preview?: { settings: unknown; pages: unknown[] };
};

const noop = () => {};

export async function generate(opts: GenerateOptions): Promise<GenerateReport> {
  const log = opts.onProgress ?? noop;

  log(`Loading target client env for "${opts.targetSlug}"…`);
  const targetEnv = loadTargetClientEnv(opts.targetSlug);

  log(`Fetching intake ${opts.intakeId} from portal Sanity…`);
  const intake = await fetchIntake(opts.intakeId);
  log(`  Business: ${intake.businessName}`);

  const pageIntents = parseSitemap(intake.sitemap, intake.businessName);
  log(`Parsed sitemap → ${pageIntents.length} pages: ${pageIntents.map((p) => p.slug).join(", ")}`);

  const primaryUrl = intake.primaryDomain
    ? intake.primaryDomain.startsWith("http")
      ? intake.primaryDomain
      : `https://${intake.primaryDomain.replace(/^\/+/, "")}`
    : `https://${opts.targetSlug}.pages.dev`;

  const destinationEmail =
    extractEmail(intake.existingCopy) ||
    extractEmail(intake.notes) ||
    `contact@${intake.primaryDomain?.replace(/^https?:\/\//, "") ?? `${opts.targetSlug}.example.com`}`;

  const context: SiteContext = {
    intake,
    pages: pageIntents,
    primaryUrl,
    destinationEmail,
  };

  const pages: GeneratedPage[] = [];
  let tokensIn = 0;
  let tokensOut = 0;
  let cacheReads = 0;

  for (let idx = 0; idx < pageIntents.length; idx++) {
    const intent = pageIntents[idx]!;
    log(`  [${idx + 1}/${pageIntents.length}] generating /${intent.slug === "home" ? "" : intent.slug}…`);
    const { result, tokens } = await generatePage(context, intent);
    pages.push(result);
    tokensIn += tokens.in;
    tokensOut += tokens.out;
    cacheReads += tokens.cacheRead ?? 0;
    log(
      `      ↳ ${result.blocks.length} blocks · in=${tokens.in} out=${tokens.out}${
        tokens.cacheRead ? ` cacheRead=${tokens.cacheRead}` : ""
      }`,
    );
  }

  log(`Generating site settings (tagline + llms.txt)…`);
  const settings = await generateSettings(context, pages);

  log(`Writing to target Sanity project ${targetEnv.projectId} (dataset=${targetEnv.dataset})…`);
  const { stats, preview } = await writeSite(targetEnv, { settings, pages }, { dryRun: opts.dryRun });
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
    targetProjectId: targetEnv.projectId,
    tokensIn,
    tokensOut,
    cacheReads,
    preview: opts.dryRun ? preview : undefined,
  };
}

function extractEmail(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const m = text.match(/[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : undefined;
}
