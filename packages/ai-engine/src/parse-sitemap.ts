import type { PageIntent } from "./types.js";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isHomeTitle(title: string): boolean {
  return /^home\b|homepage|^index$/i.test(title.trim());
}

/**
 * Accepts the intake's sitemap field, which is free text. Tries JSON first;
 * falls back to line-by-line parsing. Hierarchy via leading spaces or `>` is
 * flattened to URL paths (e.g. "Services > Roofing" -> /services/roofing).
 *
 * If no sitemap is provided, returns a sensible default for a service business.
 */
export function parseSitemap(raw: string | undefined, businessName: string): PageIntent[] {
  const text = (raw ?? "").trim();
  if (!text) {
    return defaultSitemap(businessName);
  }

  // Try JSON
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      const pages = Array.isArray(parsed) ? parsed : parsed.pages;
      if (Array.isArray(pages)) {
        return pages
          .map((p): PageIntent | null => {
            if (typeof p === "string") {
              return { title: p, slug: isHomeTitle(p) ? "home" : slugify(p) };
            }
            if (p && typeof p === "object") {
              const title = String(p.title ?? p.name ?? "").trim();
              if (!title) return null;
              const slugRaw = String(p.slug ?? p.path ?? "").trim();
              const slug = slugRaw
                ? slugRaw.replace(/^\//, "")
                : isHomeTitle(title)
                  ? "home"
                  : slugify(title);
              const purpose = p.purpose ? String(p.purpose) : undefined;
              return { title, slug: slug || "home", purpose };
            }
            return null;
          })
          .filter((p): p is PageIntent => p !== null);
      }
    } catch {
      // fall through to line parsing
    }
  }

  // Line-by-line. Track current parent for indented children.
  const lines = text.split("\n").map((l) => l.replace(/\r$/, ""));
  const intents: PageIntent[] = [];
  const stack: { indent: number; slug: string }[] = [];

  for (const line of lines) {
    const trimmed = line.replace(/^[-*•\d.)\s]+/, "").trim();
    if (!trimmed) continue;

    // Heuristic: detect indent level (2-space or 4-space or tab)
    const leadingMatch = line.match(/^(\s+)/);
    const indent = leadingMatch ? leadingMatch[1]!.length : 0;

    while (stack.length > 0 && stack[stack.length - 1]!.indent >= indent) {
      stack.pop();
    }

    // Also support "Parent > Child" inline notation
    if (trimmed.includes(">")) {
      const parts = trimmed.split(">").map((s) => s.trim()).filter(Boolean);
      const last = parts[parts.length - 1]!;
      const slugSegments = parts.map((p) => slugify(p));
      const slug = isHomeTitle(last) ? "home" : slugSegments.join("/");
      intents.push({ title: last, slug });
      continue;
    }

    const parentSlug = stack.length > 0 ? stack[stack.length - 1]!.slug : "";
    const ownSlug = slugify(trimmed);
    const fullSlug = isHomeTitle(trimmed)
      ? "home"
      : parentSlug
        ? `${parentSlug}/${ownSlug}`
        : ownSlug;

    intents.push({ title: trimmed, slug: fullSlug });
    stack.push({ indent, slug: fullSlug });
  }

  if (intents.length === 0) {
    return defaultSitemap(businessName);
  }

  // Ensure exactly one home page, and that it's first.
  const homeIdx = intents.findIndex((p) => p.slug === "home");
  if (homeIdx === -1) {
    intents.unshift({ title: "Home", slug: "home" });
  } else if (homeIdx > 0) {
    const [home] = intents.splice(homeIdx, 1);
    intents.unshift(home!);
  }

  return intents;
}

function defaultSitemap(_businessName: string): PageIntent[] {
  return [
    { title: "Home", slug: "home", purpose: "Overview of the business, value props, services, projects, social proof, and a contact CTA." },
    { title: "About", slug: "about", purpose: "Story, team, credentials, why-us." },
    { title: "Services", slug: "services", purpose: "Overview of every service offered." },
    { title: "Contact", slug: "contact", purpose: "Contact form, phone, email, hours, service areas." },
  ];
}
