#!/usr/bin/env node
/**
 * Seeds a "Smoketest Roofing" intake doc into the portal Sanity (ka9se3h4)
 * so we can A/B test the AI engine against the hand-written seed.mjs.
 *
 *   pnpm --filter @outerbox/ai-engine exec node scripts/seed-smoketest-intake.mjs
 *
 * Reads PORTAL_SANITY_TOKEN from packages/ai-engine/.env.
 * Idempotent: uses createOrReplace with a deterministic _id.
 */

import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
loadDotenv({ path: join(packageRoot, ".env") });

const projectId = process.env.PORTAL_SANITY_PROJECT_ID || "ka9se3h4";
const dataset = process.env.PORTAL_SANITY_DATASET || "production";
const apiVersion = process.env.PORTAL_SANITY_API_VERSION || "2026-05-14";
const token = process.env.PORTAL_SANITY_TOKEN;

if (!token) {
  console.error("✘ PORTAL_SANITY_TOKEN not set in packages/ai-engine/.env");
  console.error("  Generate one at https://www.sanity.io/manage/project/ka9se3h4/api/tokens");
  console.error("  (Editor role is required to write the intake — Viewer is read-only.)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const intake = {
  _id: "intake-smoketest-roofing",
  _type: "intake",
  businessName: "Smoketest Roofing",
  industry: "Roofing contractor",
  primaryDomain: "smoketestroofing.com",
  primaryContact: "Phase 2 AI engine smoke test",
  targetAudience:
    "Homeowners (35-65) in the Portland, OR metro who own their home and need roof replacement, repair, or maintenance — plus small commercial property owners and HOAs. They've been burned by fly-by-night contractors and care about workmanship + warranty more than the lowest price.",
  tone: "Confident, plainspoken, no-hype",
  toneNotes:
    "Sound like a knowledgeable neighbor, not a salesperson. Avoid roofing-industry hype words (\"amazing\", \"world-class\", \"unmatched\"). Lead with specifics, not adjectives.",
  services: [
    "Residential roofing",
    "Commercial flat roofs",
    "Inspections and maintenance",
    "Storm damage repair",
  ],
  differentiators:
    "Family-owned since 1998. Same crew start-to-finish — we do not subcontract. 50-year transferable workmanship warranty (industry standard is 10-25). Fixed-price estimates with no surprises. Every job documented with photos. Licensed Oregon CCB #123456 and Washington #ROOFER123XX. $2M general liability + full workers' comp.",
  serviceAreas:
    "Portland, OR\nBeaverton, OR\nLake Oswego, OR\nTigard, OR\nVancouver, WA\nHood River, OR",
  existingCopy: [
    "We've been roofing Portland-area homes since 1998. That's three generations of the same family on the same roofs.",
    "",
    "Every estimate is fixed price. Every job is documented with photos. The crew that starts your job is the crew that finishes it. We don't subcontract, we don't disappear after the deposit clears, and we don't upsell you into a roof you don't need.",
    "",
    "Materials we install: asphalt shingles (architectural and 3-tab), standing-seam and exposed-fastener metal, cedar shake, slate, and full TPO/EPDM/PVC flat-roof systems. Manufacturer material warranties pass through directly to you. Our workmanship warranty is 50 years and fully transferable to the next owner.",
    "",
    "Storm damage: we can inspect, document for your insurer, and coordinate with the adjuster. We don't pressure homeowners into a claim — if a small repair is the right call, that's what we'll quote.",
    "",
    "Financing: 0%-down options available on qualified replacements through a regional lender, terms 24-84 months.",
    "",
    "Contact us at (503) 555-0123 or hello@smoketestroofing.com. Office at 1421 NW Front Ave, Portland, OR 97209. Open Monday-Friday, 7am-6pm.",
  ].join("\n"),
  assetUrls: [
    "https://picsum.photos/seed/intake-hero/1920/1080",
    "https://picsum.photos/seed/intake-about/1200/1200",
    "https://picsum.photos/seed/intake-process/1200/1200",
    "https://picsum.photos/seed/intake-project1/900/700",
    "https://picsum.photos/seed/intake-project2/900/700",
    "https://picsum.photos/seed/intake-project3/900/700",
    "https://picsum.photos/seed/intake-project4/900/700",
    "https://picsum.photos/seed/intake-gallery1/1000/750",
    "https://picsum.photos/seed/intake-gallery2/1000/750",
    "https://picsum.photos/seed/intake-gallery3/1000/750",
  ],
  sitemap: [
    "Home",
    "About",
    "Services",
    "  Residential roofing",
    "  Commercial flat roofs",
    "  Inspections",
    "Projects",
    "Contact",
  ].join("\n"),
  notes:
    "Booking now for late summer installs — leverage \"free inspections through July\" angle on the home page. Phone (503) 555-0123 is the canonical contact number; email hello@smoketestroofing.com.",
  status: "ready-for-ai",
};

console.log(`→ Writing intake "${intake._id}" to portal Sanity (${projectId})…`);
await client.createOrReplace(intake);
console.log(`✓ Seeded. Intake ID: ${intake._id}`);
console.log(`\nNext: pnpm ai-engine generate --intake ${intake._id} --target smoketest-roofing --dry-run`);
