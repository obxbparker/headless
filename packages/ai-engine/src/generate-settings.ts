import { generateJson } from "./claude.js";
import type {
  GeneratedSiteSettings,
  GeneratedPage,
  SiteContext,
} from "./types.js";

const SYSTEM = `You produce SHORT site-wide brand content (a tagline + an llms.txt summary) for a client website.

Output ONLY a JSON object of shape:
{
  "tagline": string,        // one line, 6-12 words, captures core value. No exclamation points.
  "llmsTxt": string         // 3-5 short paragraphs of plain text describing who they are, services, locations, contact. No markdown. Used for AI/LLM indexing.
}

Rules:
- Use only facts from the intake. Do not invent certifications, awards, dates, or numbers.
- Plain language, no jargon, no hype.
- llmsTxt should answer "who, what, where, contact" comprehensively in one read.
`;

type AiSettingsOutput = { tagline: string; llmsTxt: string };

export async function generateSettings(
  context: SiteContext,
  pages: GeneratedPage[],
): Promise<GeneratedSiteSettings> {
  const intake = context.intake;

  const intakeSummary = [
    `Business: ${intake.businessName}`,
    intake.industry && `Industry: ${intake.industry}`,
    intake.serviceAreas && `Service areas: ${intake.serviceAreas.replace(/\n/g, ", ")}`,
    intake.services?.length && `Services: ${intake.services.join(", ")}`,
    intake.differentiators && `Differentiators: ${intake.differentiators}`,
    intake.targetAudience && `Audience: ${intake.targetAudience}`,
    intake.tone && `Tone: ${intake.tone}`,
    intake.notes && `Notes: ${intake.notes}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { parsed } = await generateJson<AiSettingsOutput>({
    systemBlocks: [{ text: SYSTEM }],
    userMessage: `Intake:\n${intakeSummary}\n\nProduce the JSON object now.`,
    maxTokens: 1024,
    temperature: 0.5,
  });

  // Build deterministic structural fields from the intake + sitemap.
  const phone = extractPhone(intake);
  const email = context.destinationEmail;
  const navLinks = pages
    .filter((p) => p.slug !== "home")
    .slice(0, 6)
    .map((p) => ({ label: p.title, href: `/${p.slug}` }));

  const settings: GeneratedSiteSettings = {
    businessName: intake.businessName,
    tagline: parsed.tagline,
    primaryUrl: context.primaryUrl,
    contactInfo: {
      phone: phone || undefined,
      email,
      address: intake.serviceAreas || undefined,
    },
    mainNav: {
      links: navLinks.length > 0 ? navLinks : undefined,
      primaryCta: { label: "Get in touch", href: "/contact" },
    },
    utilityBar: phone
      ? {
          secondaryCta: { label: `Call ${phone}`, href: `tel:${phone.replace(/[^0-9+]/g, "")}` },
        }
      : undefined,
    footer: {
      columns: buildFooterColumns(intake, pages),
      legalText: `© ${new Date().getFullYear()} ${intake.businessName}. All rights reserved.`,
    },
    llmsTxt: parsed.llmsTxt,
    defaultSeo: {
      title: `${intake.businessName}${intake.industry ? ` — ${intake.industry}` : ""}`,
      description: parsed.tagline,
    },
  };

  return settings;
}

function extractPhone(intake: { notes?: string; existingCopy?: string }): string | undefined {
  const text = `${intake.notes ?? ""}\n${intake.existingCopy ?? ""}`;
  const m = text.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  return m ? m[0] : undefined;
}

function buildFooterColumns(
  intake: { services?: string[] },
  pages: GeneratedPage[],
): { heading: string; links: { label: string; href: string }[] }[] {
  const cols: { heading: string; links: { label: string; href: string }[] }[] = [];

  if (intake.services?.length) {
    cols.push({
      heading: "Services",
      links: intake.services.slice(0, 5).map((s) => ({ label: s, href: "/services" })),
    });
  }

  const companyLinks = pages
    .filter((p) => p.slug !== "home")
    .slice(0, 5)
    .map((p) => ({ label: p.title, href: `/${p.slug}` }));
  if (companyLinks.length > 0) {
    cols.push({ heading: "Company", links: companyLinks });
  }

  return cols;
}
