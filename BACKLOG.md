# OuterBox Platform — Backlog

**Living document.** Updated as items get added/shipped. The TL;DR checklist at the top is for fast scanning; details and file pointers live below.

---

## Checklist (TL;DR)

### Production blockers
- [ ] Upgrade Cloudflare to Workers Paid ($5/mo) so the in-portal Generate button runs the engine end-to-end without CLI fallback

### Phase 2.5 — Quality + correctness
- [ ] AI guardrails — anti-repetition across pages + intake-meta-leakage fix (#2)
- [ ] Page-type model — first-class `pageType` field + per-block `validOn`/`invalidOn` flags (combines old backlog #4 with designer-flagging request)
- [ ] Block-spec template — markdown form designers fill out → I generate the 4 block files
- [ ] Image variety — beyond client-supplied URLs (curated stock library or AI gen)
- [ ] Smarter cross-page CTAs — link to most-relevant destination, not just /contact
- [ ] Re-run preservation — don't wipe direct Sanity edits when re-running Generate

### Phase 2.5 — Editor experience
- [ ] Global/reusable blocks — single-source CTA, footer-callout, etc. (#4)
- [ ] Intake form split — public-facing copy vs. internal context (so internal notes don't leak into content)

### Phase 3
- [ ] Per-client design customization — colors, fonts, button corners, logo placement, text alignment (#1)
- [ ] Visual sitemap builder — drag/drop tree for 50+ page sites (#3)
- [ ] Client-facing portal — auth + client submits intake + client reviews

### Phase 4+
- [ ] Ecommerce blocks (Shopify Storefront API headless)
- [ ] Blog/article system with Article JSON-LD
- [ ] Real email backend for form-submit (Resend or worker-mailer)
- [ ] Custom domain wiring runbook

---

## Details

### Production blocker — Cloudflare Workers Paid

**What:** Upgrade the Cloudflare account from free to Workers Paid ($5/mo).

**Why:** Free tier kills any Pages Function after 30 seconds wall-clock, including `ctx.waitUntil` background tasks. The AI engine takes ~5 minutes per site (sequential due to Anthropic's 4k-output-tokens-per-minute org rate limit). The portal Generate button toasts "Generation started" and dies silently mid-run. Workers Paid extends wall-clock to 5 minutes — fits the engine comfortably.

**No code changes needed.** The /api/generate route already uses `ctx.waitUntil`. As soon as the tier is paid, it works.

**Where:** https://dash.cloudflare.com → Workers & Pages → Plans → Paid.

---

### 1. Per-client design customization

**Source:** Bradley flagged 2026-05-15. Clients will want their own brand colors, fonts, button radii, logo placement, text alignment — not OBx defaults.

**Scope:**
- Move design tokens from build-time (`packages/ui/src/tokens/`) to CSS variables resolved at runtime per client
- Add a `design` group to `siteSettings` schema with fields for: primary color, accent color, heading font, body font, button radius (rounded/squared), image radius, logo position in nav (left/center), logo position in footer, default text alignment per block type
- Add a "Design preferences" section to the public intake form so the PM captures these upfront
- Add a "Design system" tab in the embedded Studio for post-generation tweaks
- Components keep their Tailwind classes; classes resolve to CSS vars that the design doc sets at the layout level

**Architectural notes:**
- `packages/ui/src/tokens/*.ts` becomes the *default* token set; siteSettings.design *overrides*
- Tailwind preset needs `colors: { primary: 'var(--c-primary)' }` style declarations so the CSS-var layer works without rewriting every component
- Each client's `layout.tsx` reads siteSettings.design and emits a `<style>` block with the CSS vars

**Dependencies:** none, but recommend doing AFTER the page-type model lands (that improves output quality more)

**Estimate:** see "Timeline philosophy" at the bottom

---

### 2. AI guardrails — anti-repetition + intake-meta-leakage

**Source:** Bradley flagged 2026-05-15 after dry-running ABC Tree Services.

**Two related bugs in the AI's current output:**

**A. Repetition across pages.** The same hero pattern shows up on home AND interior pages ("Roof Replacement and Repair Done Right — From the Same Crew", "Tree Care You Can Trust, From People Who Know Trees"). The AI doesn't see prior pages it generated when working on the next one.

Fix: pass the previous pages' hero headings + section H2s into each subsequent page's system prompt as "patterns to avoid repeating". Single prompt change, no schema work.

**B. Intake-meta leakage into public content.** Bradley wrote "ABC Tree Services never had a website before" in the intake to give context. The AI used that as customer-facing copy. Bad.

Fix path 1 (quick): add a `notes` / `internalContext` field that's explicitly "background only — do NOT publish." Update the engine to pass it as separate context, not concatenated with the existing-copy blob.

Fix path 2 (better, longer): split the intake form into two clearly-labeled sections:
- "Public-facing copy" (existing copy, taglines, body text the AI can use verbatim)
- "Internal context for the AI" (everything else — tone notes, "first website ever", "they hate competitor X", etc.)

**Files:**
- [packages/ai-engine/src/generate-page.ts](packages/ai-engine/src/generate-page.ts) — buildSiteContextBlock currently concatenates everything
- [apps/portal/src/sanity/schema.ts](apps/portal/src/sanity/schema.ts) — intake schema needs the new field split

---

### 3. Page-type model (combines designer flagging request + old backlog #4)

**Source:** Bradley flagged 2026-05-14 (per-page-type rules), expanded 2026-05-15 (designer flagging on new blocks).

**Why:** The AI today has no concept of page type. It sees a slug (`home`, `services/tree-pruning`) and uses a single uniform rubric to pick blocks. Result: hero banners on every page, FAQ blocks on contact pages, callouts everywhere. Tagging each page with a type (`home` | `landing` | `detail` | `listing` | `about` | `contact` | `article` | `generic`) + tagging each block with which types it's valid on lets the AI filter correctly.

**Schema additions:**

```ts
// packages/sanity-schemas/src/documents/page.ts
page.pageType: "home" | "landing" | "detail" | "listing" | "about" | "contact" | "article" | "generic"
// Default inferable from slug; PMs can override.

// packages/ui/src/metadata/selection.ts
blockSelection["hero-banner"] = {
  useWhen: "...",                              // existing prose
  avoidWhen: "...",                            // existing prose
  validOn: ["home", "landing"],                // NEW — explicit allowlist
  invalidOn: ["detail", "contact"],            // NEW — explicit denylist
  maxPerPage: 1,                               // NEW — caps duplication
  positionHint: "first" | "last" | "anywhere", // NEW
}
```

**Engine change:** [packages/ai-engine/src/engine.ts](packages/ai-engine/src/engine.ts) per-page generation filters the block catalogue by the current page's pageType before passing it to the model. Drops invalid blocks entirely from what the AI can choose.

**Designer benefit:** when adding a new block, designers tag which page types it's for via the spec template (#4 below). No prose interpretation needed.

**Estimate:** highest-leverage Phase 2.5 feature. ~1-2 weeks in human-team terms; see Timeline below for the breakdown.

---

### 4. Block-spec template for designers

**Source:** Bradley flagged 2026-05-15 (designer workflow).

**Problem:** Adding a new block today requires writing 4 separate files (React component, Sanity schema, selection metadata, block-reference catalogue entry) by hand. Designers can't do this; devs spend 2-3 hours per new block.

**Solution:** A markdown template at `packages/ui/BLOCK_SPEC_TEMPLATE.md` that designers fill out — name, description, fields (with types + validation), useWhen, avoidWhen, valid page types, variants. Drop the filled-out spec into a chat with me; I parse it and emit all 4 files + a draft Figma-to-React translation. Dev reviews + tests.

Cuts new-block dev time from 2-3 hours to ~15-30 minutes.

**Pairs with #3** — the template includes the `validOn` / `invalidOn` page-type fields.

---

### 5. Global/reusable blocks

**Source:** Bradley flagged 2026-05-15.

**Problem:** Same CTA appears in 8 places across a client site. Edit it once, want it updated everywhere — not 8 individual edits.

**Solution:** Sanity's "module reference" pattern. Define a `globalCta` document type (named, not singleton — clients have multiple shared CTAs). In a page's blocks array, allow EITHER an inline `callout` OR a reference to a `globalCta`. Renderer resolves the reference at fetch time.

**Files to touch:**
- New schema: `packages/sanity-schemas/src/documents/globalCta.ts`
- Update `packages/sanity-schemas/src/documents/page.ts` blocks array to accept the reference type
- Update GROQ projections in [clients/<slug>/src/sanity/queries.ts](clients/smoketest-roofing/src/sanity/queries.ts) to deref the reference
- Update [BlockRenderer](clients/smoketest-roofing/src/components/BlockRenderer.tsx) to handle a `globalCtaReference` block type

**Don't globalize everything.** Pick a few high-frequency block types: CTA / Callout, Contact band, Footer-style mini-form. Over-globalizing makes the Studio confusing.

---

### 6. Visual sitemap builder

**Source:** Bradley flagged 2026-05-15.

**Why:** Some real sites have 50+ pages with complex hierarchy. Text-with-indentation works for ~10-page sites but doesn't scale to enterprise structures.

**Scope:** Visual tree builder (drag/drop nodes), parent/child support, copy-paste between projects, templates ("standard service business" / "ecommerce" / "blog" / "multi-location"), CSV/JSON import.

**Where:** Either a new tab in the portal, or a Sanity Studio custom input for the `sitemap` field on intake.

**Defer until:** you've shipped 5+ real sites and have a feel for the patterns you'd template.

---

### Other quick wins

**Re-run preservation.** Engine writes via `createOrReplace` — direct Sanity edits get wiped on re-run. Make the engine smarter: fetch existing page docs first, only update fields that haven't been hand-edited since last generation. Implementation: store a `lastGeneratedHash` on each page; only overwrite if hash matches.

**Image variety.** Today the AI only uses URLs from the intake's `assetUrls`. If client supplied 5 URLs and we need 20 images, 15 slots are empty. Phase 2.5: integrate Unsplash API (per-page query based on context) or AI image gen.

**Smarter cross-page CTAs.** AI defaults everything to `/contact`. Pass it the full sitemap with page purposes, instruct it to pick the most-relevant destination per CTA.

---

## Timeline philosophy

**When I say "1-2 weeks" or "multi-week" — that's the full human-team timeline, not my coding time.**

My actual coding time for a well-scoped task is hours, sometimes minutes. The wall-clock reality of any feature includes:

- Decision rounds with you (e.g., "which design tokens go per-client?")
- Designer iteration if visual
- Testing on real client sites (you click around, find an edge case, we iterate)
- Production deploys + verifying nothing regressed
- Stakeholder review

**Rough mapping of my estimates ↔ your actual time investment:**

| My estimate | My coding time | Your interactive time | Reason |
|---|---|---|---|
| "Quick fix" | 5-15 min | 15-30 min | Just code |
| "Prompt change" | 10-30 min | 1 hour + a test cycle | Code + verify quality |
| "2-3 days" | 1-3 hours | 4-8 hours over 2-3 sessions | Decisions + iteration |
| "1-2 weeks" | 3-6 hours | 1-2 weeks of *your* attention | Multi-stakeholder + design + real-client testing |
| "Multi-week" / Phase 3 | 1-2 days | 3-6 weeks | Hits architecture + design + change-management |

**Where I'm fast:** writing TypeScript, schemas, prompts, integration code, refactors that span many files. I can do 80% of the per-client design customization (#1) in 1-2 sessions of focused work with you.

**Where I'm not the bottleneck:** decisions ("should buttons be globally configurable, or per-block?"), design taste, client conversations about what they actually want.

So: I would NOT run for weeks on item #1. I'd write the foundational code in a session, you'd test, we'd iterate over 1-2 more sessions, and the wall-clock would stretch to a few weeks because of *your* review cycles and the need to validate against a real client brief.

For prompt-only changes (#2 quick fix, #3 if we keep it scoped) — same-day shippable.

---

## How to use this file

**You:** open it when planning, scan the checklist, dive into details. Move items between phases as priorities shift.

**Me (Claude):** I read this on session resume. When you say "let's work on the page-type model" I pull from section #3. When items ship, I move them to the bottom under a `## Shipped` section with a one-line dated entry.
