import type Anthropic from "@anthropic-ai/sdk";
import { blockCatalogue } from "./block-reference.js";
import { generateJson } from "./claude.js";
import type { GeneratedPage, PageIntent, SiteContext } from "./types.js";

const SYSTEM_ROLE = `You are the OuterBox content generation engine. Your job is to produce a single page of structured CMS content for a real client website.

OUTPUT RULES (strictly enforced):
- Output ONLY a JSON object. No prose, no markdown fences, no preamble, no commentary.
- The JSON must match the page schema described below.
- Every required field listed in the block catalogue must be present.
- Optional fields may be omitted entirely — do not emit empty strings or null placeholders.
- Use ONLY block types listed in the block catalogue.
- Use the client-supplied assetUrls (provided in the user message) for any media. If no asset is a good fit for a media field, OMIT the media field entirely — do not invent URLs.
- Do not include _key fields anywhere. The writer adds them.

CONTENT RULES:
- Match the brand voice and tone given in the site context.
- Use the client's existing copy where it fits the field; rewrite for length/voice if needed. Do not lose specific facts (names, numbers, certifications, locations).
- Where the client did not provide copy for a field, write new copy that is true to the business and never invents specific claims (no fake awards, fake years-in-business, fake certifications, fake numbers).
- Avoid generic SEO filler ("Welcome to our website", "Looking for X? Look no further!"). Lead with specifics — services, locations, distinctive offers.
- Headings: Title-case the hero H1; sentence-case subsequent H2/H3 headings.
- One hero-banner per page, first block.
- A typical page has 4-8 blocks. Home pages can go up to 10. Pages should END with a clear next step — usually a form or a callout linking to the contact page.
- Vary mediaSide ("left" / "right") when two media-content-50-50 blocks are adjacent.

PAGE OUTPUT SHAPE:
{
  "title": string,                  // internal title for Studio
  "slug": string,                   // url path, "home" for homepage
  "blocks": BlockOutput[],          // see block catalogue
  "seo": {
    "title": string,                // 50-60 chars, includes business + value
    "description": string,          // 140-160 chars
    "jsonLdType"?: "Default" | "LocalBusiness" | "Service" | "Article" | "FAQPage"
  }
}
`;

function buildSiteContextBlock(context: SiteContext): string {
  const i = context.intake;
  const lines: string[] = [];
  lines.push(`# Site context\n`);
  lines.push(`Business name: ${i.businessName}`);
  if (i.industry) lines.push(`Industry: ${i.industry}`);
  if (i.primaryDomain) lines.push(`Primary domain: ${i.primaryDomain}`);
  lines.push(`Primary URL: ${context.primaryUrl}`);
  lines.push(`Destination email for forms: ${context.destinationEmail}`);
  if (i.serviceAreas) lines.push(`Service areas: ${i.serviceAreas.replace(/\n/g, ", ")}`);
  if (i.targetAudience) lines.push(`\nTarget audience:\n${i.targetAudience}`);
  if (i.tone || i.toneNotes) {
    lines.push(`\nTone: ${[i.tone, i.toneNotes].filter(Boolean).join(" — ")}`);
  }
  if (i.services?.length) lines.push(`\nServices:\n- ${i.services.join("\n- ")}`);
  if (i.differentiators) lines.push(`\nDifferentiators / proof points:\n${i.differentiators}`);
  if (i.notes) lines.push(`\nAdditional notes:\n${i.notes}`);
  if (i.assetUrls?.length) {
    lines.push(`\nClient-supplied asset URLs (use these for media; omit media if none fit):`);
    for (const url of i.assetUrls) lines.push(`- ${url}`);
  }
  if (i.existingCopy) {
    lines.push(`\nExisting client copy (use verbatim where it fits, rewrite for voice where it doesn't):\n---\n${i.existingCopy}\n---`);
  }
  if (context.pages.length > 1) {
    lines.push(`\nFull sitemap (for cross-page linking context):`);
    for (const p of context.pages) {
      lines.push(`- /${p.slug === "home" ? "" : p.slug} — ${p.title}${p.purpose ? ` (${p.purpose})` : ""}`);
    }
  }
  return lines.join("\n");
}

export async function generatePage(
  claude: { client: Anthropic; model: string },
  context: SiteContext,
  page: PageIntent,
): Promise<{ result: GeneratedPage; tokens: { in: number; out: number; cacheRead?: number; cacheCreation?: number } }> {
  const userMessage = [
    `# Page to generate`,
    `Title: ${page.title}`,
    `Slug: ${page.slug}`,
    page.purpose ? `Purpose: ${page.purpose}` : `Purpose: (infer from title + site context)`,
    ``,
    `Produce a complete page JSON object per the schema in the system prompt. Output JSON only.`,
  ].join("\n");

  const { parsed, usage } = await generateJson<GeneratedPage>({
    client: claude.client,
    model: claude.model,
    systemBlocks: [
      { text: `${SYSTEM_ROLE}\n\n${blockCatalogue}`, cache: true },
      { text: buildSiteContextBlock(context), cache: true },
    ],
    userMessage,
    maxTokens: 6144,
    temperature: 0.6,
  });

  // Defensive: ensure slug is set correctly (model occasionally rewrites it).
  parsed.slug = page.slug;
  if (!parsed.title) parsed.title = page.title;

  return {
    result: parsed,
    tokens: {
      in: usage.inputTokens,
      out: usage.outputTokens,
      cacheRead: usage.cacheReadTokens,
      cacheCreation: usage.cacheCreationTokens,
    },
  };
}
