#!/usr/bin/env node
/**
 * One-off: rewrite the smoketest-roofing siteSettings.mainNav.links into a
 * tiered structure (services has child links). Avoids re-running the full
 * AI engine just to test the nested-nav feature.
 *
 *   pnpm --filter @outerbox/ai-engine exec node scripts/patch-smoketest-nav.mjs
 */

import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";
import { readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const repoRoot = resolve(packageRoot, "..", "..");
loadDotenv({ path: join(packageRoot, ".env") });

// Read the smoketest client env for its write token + project ID.
const clientEnvPath = join(repoRoot, "clients", "smoketest-roofing", ".env.local");
const raw = readFileSync(clientEnvPath, "utf8");
const env = {};
for (const line of raw.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-14",
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const k = () => Math.random().toString(36).slice(2, 12);

const links = [
  { _key: k(), label: "About", href: "/about" },
  {
    _key: k(),
    label: "Services",
    href: "/services",
    children: [
      { _key: k(), label: "Residential Roofing", href: "/services/residential-roofing" },
      { _key: k(), label: "Commercial Flat Roofs", href: "/services/commercial-flat-roofs" },
      { _key: k(), label: "Inspections", href: "/services/inspections" },
    ],
  },
  { _key: k(), label: "Projects", href: "/projects" },
  { _key: k(), label: "Contact", href: "/contact" },
];

console.log("→ Patching siteSettings.mainNav.links on", env.NEXT_PUBLIC_SANITY_PROJECT_ID);
const result = await client
  .patch("siteSettings")
  .set({ "mainNav.links": links })
  .commit();
console.log("✓ Patched. Updated at:", result._updatedAt);
console.log(`  ${links.length} top-level links (${links.find((l) => l.children)?.children?.length ?? 0} children under Services)`);
