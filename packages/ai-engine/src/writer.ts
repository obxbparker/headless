import { createClient, type SanityClient } from "@sanity/client";
import type { TargetClientEnv } from "./config.js";
import type {
  BlockOutput,
  GeneratedPage,
  GeneratedSiteSettings,
  MediaOutput,
} from "./types.js";

export type WriterStats = {
  pagesWritten: number;
  settingsWritten: boolean;
  assetsUploaded: number;
};

const NESTED_ITEM_TYPES: Record<string, string> = {
  "value-prop-bar.items": "valuePropItem",
  "three-column-content.items": "threeColumnItem",
  "content-carousel-4-column.items": "contentCarouselItem",
  "gallery.items": "galleryItem",
  "faq.items": "faqItem",
  "form.fields": "formField",
};

function randKey(): string {
  return Math.random().toString(36).slice(2, 12);
}

/** Cache asset uploads so the same sourceUrl doesn't get uploaded twice per run. */
class AssetCache {
  private map = new Map<string, string>();
  uploaded = 0;
  constructor(private client: SanityClient, private dryRun: boolean) {}

  async resolve(sourceUrl: string): Promise<string> {
    const cached = this.map.get(sourceUrl);
    if (cached) return cached;
    if (this.dryRun) {
      const placeholder = `dryrun-${this.map.size + 1}-${sourceUrl.slice(-24).replace(/[^a-zA-Z0-9]/g, "_")}`;
      this.map.set(sourceUrl, placeholder);
      this.uploaded++;
      return placeholder;
    }
    const res = await fetch(sourceUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image ${sourceUrl} → HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
    const filename = `ai-${randKey()}.${ext}`;
    const asset = await this.client.assets.upload("image", buf, {
      filename,
      contentType,
    });
    this.map.set(sourceUrl, asset._id);
    this.uploaded++;
    return asset._id;
  }
}

/**
 * Walk a block tree, replacing { sourceUrl, alt } objects with full Sanity
 * image references, and injecting _key + nested _type values where needed.
 */
async function normalizeBlock(
  block: BlockOutput,
  assets: AssetCache,
): Promise<BlockOutput> {
  const out: BlockOutput = { ...block, _key: randKey() } as BlockOutput;

  for (const [key, value] of Object.entries(block)) {
    if (key === "_type" || key === "_key") continue;
    out[key] = await normalizeValue(value, block._type, key, assets);
  }
  return out;
}

async function normalizeValue(
  value: unknown,
  parentType: string,
  fieldName: string,
  assets: AssetCache,
): Promise<unknown> {
  if (value === null || value === undefined) return value;

  // Images: shape { sourceUrl, alt } => imageWithAlt with Sanity asset ref.
  if (isImagePayload(value)) {
    const media = value as MediaOutput;
    if (!media.sourceUrl) {
      return undefined;
    }
    const assetId = await assets.resolve(media.sourceUrl);
    return {
      _type: "imageWithAlt",
      alt: media.alt ?? "",
      asset: { _type: "reference", _ref: assetId },
    };
  }

  if (Array.isArray(value)) {
    const nestedType = NESTED_ITEM_TYPES[`${parentType}.${fieldName}`];
    const out: unknown[] = [];
    for (const item of value) {
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const itemWithType: Record<string, unknown> = {
          ...obj,
          _key: randKey(),
        };
        if (nestedType && !itemWithType._type) {
          itemWithType._type = nestedType;
        }
        // Recurse into known nested fields (image, media) on this item.
        for (const [k, v] of Object.entries(obj)) {
          if (k === "_type" || k === "_key") continue;
          itemWithType[k] = await normalizeValue(v, parentType, k, assets);
        }
        // Also: options inside select form fields need _key
        if (Array.isArray(itemWithType.options)) {
          itemWithType.options = (itemWithType.options as unknown[]).map((o) =>
            o && typeof o === "object" ? { ...(o as object), _key: randKey() } : o,
          );
        }
        out.push(itemWithType);
      } else {
        out.push(item);
      }
    }
    return out;
  }

  if (typeof value === "object") {
    // E.g. cta, contactInfo — pass through but recurse into any image payloads.
    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = await normalizeValue(v, parentType, k, assets);
    }
    return result;
  }

  return value;
}

function isImagePayload(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    "sourceUrl" in obj &&
    !("asset" in obj) &&
    (typeof obj.sourceUrl === "string" || obj.sourceUrl === undefined)
  );
}

function normalizeSiteSettings(settings: GeneratedSiteSettings): Record<string, unknown> {
  const out: Record<string, unknown> = {
    _id: "siteSettings",
    _type: "siteSettings",
    businessName: settings.businessName,
    primaryUrl: settings.primaryUrl,
  };
  if (settings.tagline) out.tagline = settings.tagline;
  if (settings.contactInfo) out.contactInfo = settings.contactInfo;
  if (settings.mainNav) {
    out.mainNav = {
      links: (settings.mainNav.links ?? []).map((l) => ({
        _key: randKey(),
        label: l.label,
        href: l.href,
        ...(l.children?.length
          ? { children: l.children.map((c) => ({ _key: randKey(), ...c })) }
          : {}),
      })),
      primaryCta: settings.mainNav.primaryCta,
    };
  }
  if (settings.utilityBar) out.utilityBar = settings.utilityBar;
  if (settings.footer) {
    out.footer = {
      columns: (settings.footer.columns ?? []).map((col) => ({
        _key: randKey(),
        heading: col.heading,
        links: col.links.map((l) => ({ _key: randKey(), ...l })),
      })),
      legalText: settings.footer.legalText,
    };
  }
  if (settings.socialLinks) {
    out.socialLinks = settings.socialLinks.map((s) => ({ _key: randKey(), ...s }));
  }
  if (settings.llmsTxt) out.llmsTxt = settings.llmsTxt;
  if (settings.defaultSeo) out.defaultSeo = settings.defaultSeo;
  return out;
}

async function normalizePage(
  page: GeneratedPage,
  assets: AssetCache,
): Promise<Record<string, unknown>> {
  const blocks: BlockOutput[] = [];
  for (const block of page.blocks) {
    blocks.push(await normalizeBlock(block, assets));
  }

  const seo: Record<string, unknown> = {
    title: page.seo.title,
    description: page.seo.description,
  };
  if (page.seo.jsonLdType) seo.jsonLdType = page.seo.jsonLdType;
  if (page.seo.ogImage?.sourceUrl) {
    const assetId = await assets.resolve(page.seo.ogImage.sourceUrl);
    seo.ogImage = {
      _type: "imageWithAlt",
      alt: page.seo.ogImage.alt ?? "",
      asset: { _type: "reference", _ref: assetId },
    };
  }

  return {
    _id: page.slug === "home" ? "home-page" : `page-${page.slug.replace(/\//g, "-")}`,
    _type: "page",
    title: page.title,
    slug: { _type: "slug", current: page.slug },
    blocks,
    seo,
  };
}

export async function writeSite(
  targetEnv: TargetClientEnv,
  generated: { settings: GeneratedSiteSettings; pages: GeneratedPage[] },
  opts: { dryRun?: boolean } = {},
): Promise<{ stats: WriterStats; preview: { settings: unknown; pages: unknown[] } }> {
  const client = createClient({
    projectId: targetEnv.projectId,
    dataset: targetEnv.dataset,
    apiVersion: targetEnv.apiVersion,
    token: targetEnv.writeToken,
    useCdn: false,
  });

  const assets = new AssetCache(client, opts.dryRun ?? false);

  const settingsDoc = normalizeSiteSettings(generated.settings);
  const pageDocs: Record<string, unknown>[] = [];
  for (const page of generated.pages) {
    pageDocs.push(await normalizePage(page, assets));
  }

  if (opts.dryRun) {
    return {
      stats: { pagesWritten: 0, settingsWritten: false, assetsUploaded: assets.uploaded },
      preview: { settings: settingsDoc, pages: pageDocs },
    };
  }

  await client.createOrReplace(settingsDoc as never);
  for (const page of pageDocs) {
    await client.createOrReplace(page as never);
  }

  return {
    stats: {
      pagesWritten: pageDocs.length,
      settingsWritten: true,
      assetsUploaded: assets.uploaded,
    },
    preview: { settings: settingsDoc, pages: pageDocs },
  };
}
