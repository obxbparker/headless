# @outerbox/ai-engine

Phase 2 — Claude-powered content generation for OuterBox client sites.

Takes a portal intake doc + a sitemap, produces structured Sanity content (pages + siteSettings + SEO), and writes it directly to a target client's Sanity project.

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `ANTHROPIC_API_KEY` — from https://console.anthropic.com/settings/keys
   - `PORTAL_SANITY_TOKEN` — Viewer-role token for the portal Sanity (project `ka9se3h4`)
2. The target client site must have its own `.env.local` at `clients/<slug>/.env.local` with `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_WRITE_TOKEN` (this is the existing convention).

## Usage

```bash
# From repo root
pnpm ai-engine generate --intake <intake-doc-id> --target <client-slug>

# Dry run — prints the generated JSON without writing to Sanity
pnpm ai-engine generate --intake <intake-doc-id> --target <client-slug> --dry-run

# List recent intakes from the portal
pnpm ai-engine intakes
```

## How it works

1. Reads the intake from portal Sanity by ID.
2. Parses the sitemap field (free text or JSON) into a list of pages.
3. For each page: calls Claude Sonnet 4.6 with the block catalogue + selection rubric + site context + page intent. Static parts are prompt-cached so cost scales sub-linearly with page count.
4. The model returns JSON conforming to the block schemas — block selection, copy, SEO.
5. Generates `siteSettings` from the intake (business info, contact, footer).
6. Uploads any client-supplied image URLs as Sanity assets.
7. Writes pages + siteSettings to the target client Sanity via `createOrReplace`.

## Output shape

See `clients/smoketest-roofing/scripts/seed.mjs` for the canonical example of what the engine produces — same `_id`/`_type`/`_key` Sanity document shape, just generated instead of hand-written.
