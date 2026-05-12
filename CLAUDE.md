# OuterBox Headless Web Platform

## What This Is

An internal production platform for OuterBox to build and launch client websites faster and more consistently. The current workflow (sitemap → Figma → dev build → content population → QA) bottlenecks on development and content population. This platform replaces those two steps with a pre-built component system and AI-driven content automation.

**The output:** A Next.js website, populated with client content, staged for review, and ready to launch — in 1–2 weeks from signature instead of 4–6 weeks.

---

## How It Works (Elevator Pitch)

**For the client:** Pay a project fee, fill out an intake form, provide any existing copy/assets. Review a staged site. Approve it, go live, pay $60/mo hosting.

**For us:**
1. Sales/marketing builds the strategic sitemap (pages, hierarchy) — provided as a structured file
2. PM sends client intake form, collects responses + assets
3. PM uploads sitemap + intake to the platform
4. AI arranges components per page, maps existing client content to fields, generates copy where content is missing, writes all SEO/GEO fields
5. AI writes everything directly into Sanity CMS
6. PM reviews in Sanity Studio, adjusts, approves
7. PM does internal QA on staging, client reviews, PM launches

**Human touchpoints:** Sitemap creation, client intake, PM content review, internal QA, client QA, launch.
**Automated:** Component arrangement, content → CMS mapping, copy gap-fill, SEO/GEO fields, CMS population, deployment.

---

## Tech Stack (Confirmed)

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + design tokens |
| Component base | Shadcn/ui (customized to OBx design system) |
| CMS | Sanity.io |
| AI engine | Claude API (`claude-sonnet-4-6`) |
| Hosting | Cloudflare Pages + Workers |
| Monorepo | Turborepo |
| Package manager | pnpm |
| Portal | Next.js app (internal → eventually client-facing) |

---

## Monorepo Architecture

```
outerbox-platform/
├── packages/
│   ├── ui/                  ← Component library (all blocks + design tokens)
│   ├── sanity-schemas/      ← Shared Sanity schema definitions
│   └── ai-engine/           ← Claude API: arrangement, copy gen, SEO/GEO, CMS population
├── apps/
│   ├── portal/              ← Internal (eventually client-facing) portal
│   └── site-template/       ← Base every client site is scaffolded from
└── scripts/
    └── spawn-site           ← CLI to scaffold a new client site
```

Per-client sites are created by `spawn-site`: clones `site-template`, wires to a new Sanity project, deploys to Cloudflare Pages. Each site imports `@outerbox/ui` from the shared library. Library updates are versioned — sites pull updates on release.

---

## Component Library (Critical Path)

The component library is **platform-wide** — defined once, used by every client site. The AI selects and arranges from this fixed set. New components are added to the platform over time, not created per project.

**Each component needs:**
- Built React component (Tailwind-styled, design-token-driven)
- Sanity schema (the fields the CMS and AI can populate)
- AI selection metadata — a plain-English description of when to use it and when not to (e.g., `"hero-with-video": "use when client has video content and a strong visual brand; avoid for service businesses without media assets"`)

### Working From Figma

The designer has Figma Dev Mode. The Figma file contains a complete website organized into individual blocks — these blocks map 1:1 to components.

**To extract components:**
1. Share the Figma file link (set to "Anyone with link can view") OR share Dev Mode exports/screenshots
2. Claude Code will identify each distinct block, name it, define its fields, and build the React + Sanity schema for it
3. Design tokens (colors, spacing, type scale) are extracted from Figma variables/styles and codified in `packages/ui/tokens`

**OBx brand tokens (already known):**
```
Dark Blue:  #17212E  (primary text, dark backgrounds)
OBx Blue:   #1D4E89  (headings, accents)
Frost:      #EEF3F6  (light backgrounds)
Orange:     #C75300  (subtitles, bullets, accents)
Gold:       #FFB703  (headings on dark bg)
Slate:      #5C6C80  (callout text, icons)
Font:       Roboto (primary), Helvetica, Arial (fallbacks) — no serif fonts
```

---

## AI Engine — What It Does

Located in `packages/ai-engine`. Takes two inputs, produces structured CMS content.

**Inputs:**
- Strategic sitemap (JSON): page names, hierarchy, page purpose
- Client intake (JSON): business name, industry, services, target audience, tone, existing copy by page/section, asset URLs

**Outputs (written directly to Sanity via API):**
1. Component selection per page — which blocks, in what order
2. Existing client content mapped to correct component fields
3. Gap-fill copy for any fields the client didn't provide
4. SEO metadata per page: title tag, meta description, OG image alt
5. JSON-LD structured data (LocalBusiness, Service, Article, FAQPage as appropriate)
6. `llms.txt` — plain-language site summary for LLM indexing (GEO)

---

## SEO and GEO Requirements

Every site built on this platform must meet these standards.

**SEO:**
- Next.js Metadata API for all title/OG/canonical tags
- `next-sitemap` for automatic sitemap.xml
- JSON-LD structured data per page type
- Semantic HTML hierarchy enforced at component level (H1 → H2 → H3, never skipped)
- ISR/SSG for Core Web Vitals

**GEO (LLM-readable):**
- `llms.txt` at site root (business summary, services, page list)
- Complete entity information on every page (who, what, where, why)
- Key information always in text, never image-only
- FAQ schema on service and landing pages
- Clean internal linking structure

---

## Hosting Model

Each client site targets ~$60/mo recurring hosting revenue.

| Infrastructure | Cost/Month |
|---|---|
| Cloudflare Pages | $0 (free tier) |
| Cloudflare Workers | $0–$5 |
| Sanity (free tier) | $0 (most clients fit: 3 users, 10GB) |
| Sanity (growth) | $15 if more needed |
| **Infrastructure total** | **$0–$20** |
| **Client billing** | **$60** |
| **Gross margin** | **$40–$60/mo** |

Platform operating costs (Claude API at 8 sites/month): ~$4–16/mo total.

---

## Team Context

- **5 project managers** — one should own the platform as a product
- **9 full-stack devs** (frontend-heavy) — 2–3 need to be dedicated to platform build; rest continue client work
- **3 designers** — primary owners of component library definition in Phase 1; this must be their main focus

**Missing roles:**
- DevOps / platform engineer (CI/CD, spawn-site tooling, Cloudflare config) — fill with a dev who leans infra, or a contractor
- Prompt engineer / content strategist — owns AI prompt design and iteration; critical for copy quality; not a dev task

---

## Phasing

### Phase 1 — Foundation
- Monorepo scaffold (Turborepo + pnpm)
- Component library from Figma (packages/ui)
- Sanity schemas for all components (packages/sanity-schemas)
- Site template (apps/site-template): Next.js 15 + Sanity + Tailwind
- spawn-site CLI (scripts/spawn-site)
- Internal portal basic intake form (apps/portal)
- Manual Sanity population (PM pastes AI draft; full automation is Phase 2)
- Launch 2–3 real client sites end-to-end to validate
- **Goal:** Reduce dev time per site from weeks to days

### Phase 2 — AI Automation
- Claude API integration: component arrangement from sitemap + intake
- Existing content → Sanity field mapping
- Gap-fill copy generation
- SEO/GEO field automation
- Direct Sanity population via API
- Portal updated: PM reviews AI output, approves, triggers deploy
- **Goal:** Content population from days to 2–4 hours of PM review

### Phase 3 — Client Portal
- Client auth + project login
- Client-facing intake flow
- Client content review before PM approval
- Client Sanity Studio access post-launch (restricted permissions)

### Phase 4 — Advanced Features
- Ecommerce (Shopify Storefront API headless)
- Blogging with Article schema
- File galleries
- Quote-cart (ecommerce without payment)
- 3rd-party integrations (CRMs, marketing tools)

---

## Design Review — How It Works Now

The staged site replaces Figma as the design review artifact. Clients review a live URL, not a PDF. Layout, spacing, and typography are locked into components — iteration means rearranging or swapping blocks, not redesigning pages. This is faster and eliminates design-to-dev translation issues.

Sales must set expectations upfront: "You'll review a live staged site, not a Figma mockup."

---

## External Accounts and Services

These are required at specific phases. Claude Code should check for each one before starting the work that depends on it — do not proceed past a phase gate without confirming the account exists and credentials are available.

### Before any code is written
- [ ] **Node.js** installed (v20+) — run `node -v` to confirm
- [ ] **pnpm** installed — run `pnpm -v`; if missing, `npm install -g pnpm`
- [ ] **GitHub** — repo created for `outerbox-platform` (or chosen name); user has push access
- [ ] **Figma** — file shared as "Anyone with link can view" OR Dev Mode exports ready

### Before running locally (Phase 1)
- [ ] **Sanity.io account** — free at sanity.io. Once created, run `pnpm dlx sanity@latest init` to create a project and get the Project ID + dataset name. These go in `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
- [ ] **`.env.local`** in `apps/site-template` with Sanity credentials

### Before deploying to Cloudflare (Phase 1)
- [ ] **Cloudflare account** — free at cloudflare.com
- [ ] **Wrangler CLI** — `pnpm add -g wrangler`, then `wrangler login`
- [ ] Cloudflare Pages project created for the site (can be done via dashboard or `wrangler pages project create`)

### Before running the AI engine (Phase 2)
- [ ] **Anthropic API key** — at console.anthropic.com. Goes in `.env.local` as `ANTHROPIC_API_KEY`. Keep this out of git — confirm `.gitignore` covers `.env*` before proceeding.

### For advanced features (Phase 4, when needed)
- [ ] **Shopify Partner account** — only if building ecommerce; free at partners.shopify.com
- [ ] **Shopify Storefront API token** — generated per client store

---

## Starting a New Session

If you're picking this up fresh:

1. **Check prerequisites** — run through the checklist above for whichever phase you're starting. Stop and ask the user to set up any missing account before writing code that depends on it.
2. **Ask for the Figma file** — "Can you share the Figma link set to 'Anyone with link can view', or export screenshots of each component block?"
3. **Scaffold the Turborepo monorepo** with pnpm workspaces
4. **Extract components from Figma** — identify each distinct block, name it, define its fields
5. **Build `packages/ui`** — React components, Tailwind-styled, design-token-driven
6. **Build `packages/sanity-schemas`** — one schema per component
7. **Build `apps/site-template`** — Next.js 15 + Sanity configured, pulls from ui package
8. **Validate end-to-end** with 2–3 components before building the full library

Do not start the AI engine (`packages/ai-engine`) until the component library and Sanity schemas are stable. The AI needs a complete component catalogue to select from.

---

## Key Decisions Already Made

- **Not WordPress** — headless WP fights this architecture; PHP server adds cost and attack surface
- **Not Storyblok** — best visual editor but per-space pricing is expensive at 8+ sites/month
- **Not Vercel (for hosting)** — reseller margin is tighter than Cloudflare at the $60/mo price point
- **Not multi-tenant** — per-client deployments with a shared component library (hybrid model)
- **Component library is platform-wide** — AI arranges from fixed set; no per-project component creation
- **Sitemap is a human deliverable** — sales/marketing provides this as a structured file; AI does not generate it
- **Existing client content takes priority** — AI generates copy only where content is missing, not as a replacement
