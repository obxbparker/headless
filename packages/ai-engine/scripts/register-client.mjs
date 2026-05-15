#!/usr/bin/env node
/**
 * Registers a clientProject doc in the portal Sanity. PMs would normally
 * do this in Studio; the script is for dry-run setup convenience.
 *
 * Usage:
 *   pnpm --filter @outerbox/ai-engine exec node scripts/register-client.mjs \
 *     --slug abc-tree \
 *     --name "ABC Tree Services" \
 *     --sanity-project bz5vifo6 \
 *     --sanity-token sk... \
 *     --pages-name abc-tree \
 *     --primary-url https://abc-tree-506.pages.dev
 */

import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
loadDotenv({ path: join(packageRoot, ".env") });

function flag(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

const slug = flag("slug");
const displayName = flag("name");
const sanityProjectId = flag("sanity-project");
const sanityWriteToken = flag("sanity-token");
const pagesProjectName = flag("pages-name") ?? slug;
const primaryUrl = flag("primary-url");

const missing = [];
if (!slug) missing.push("--slug");
if (!displayName) missing.push("--name");
if (!sanityProjectId) missing.push("--sanity-project");
if (!sanityWriteToken) missing.push("--sanity-token");
if (!primaryUrl) missing.push("--primary-url");
if (missing.length) {
  console.error(`✘ Missing required flags: ${missing.join(", ")}`);
  process.exit(1);
}

const portalProjectId = process.env.PORTAL_SANITY_PROJECT_ID || "ka9se3h4";
const portalDataset = process.env.PORTAL_SANITY_DATASET || "production";
const portalApiVersion = process.env.PORTAL_SANITY_API_VERSION || "2026-05-14";
const portalToken = process.env.PORTAL_SANITY_TOKEN;
if (!portalToken) {
  console.error("✘ PORTAL_SANITY_TOKEN missing in packages/ai-engine/.env");
  process.exit(1);
}

const client = createClient({
  projectId: portalProjectId,
  dataset: portalDataset,
  apiVersion: portalApiVersion,
  token: portalToken,
  useCdn: false,
});

const docId = `clientProject.${slug}`;
const doc = {
  _id: docId,
  _type: "clientProject",
  slug,
  displayName,
  sanityProjectId,
  sanityDataset: "production",
  sanityApiVersion: "2026-05-14",
  sanityWriteToken,
  pagesProjectName,
  primaryUrl,
};

console.log(`→ Writing clientProject "${slug}" to portal Sanity (${portalProjectId})…`);
const result = await client.createOrReplace(doc);
console.log(`✓ Registered. Document ID: ${result._id}`);
console.log(`  Display name : ${displayName}`);
console.log(`  Target Sanity: ${sanityProjectId}`);
console.log(`  Primary URL  : ${primaryUrl}`);
console.log(`\nNext: open https://obx-portal.pages.dev/studio → fill an intake → set targetClient → Generate.`);
