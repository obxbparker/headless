export type Intake = {
  _id: string;
  businessName: string;
  industry?: string;
  primaryDomain?: string;
  primaryContact?: string;
  targetAudience?: string;
  tone?: string;
  toneNotes?: string;
  services?: string[];
  differentiators?: string;
  serviceAreas?: string;
  existingCopy?: string;
  assetUrls?: string[];
  sitemap?: string;
  notes?: string;
  status?: string;
};

export type PageIntent = {
  title: string;
  slug: string;
  purpose?: string;
};

export type SiteContext = {
  intake: Intake;
  pages: PageIntent[];
  destinationEmail: string;
  primaryUrl: string;
};

export type CtaOutput = { label: string; href: string };

export type MediaOutput = {
  sourceUrl?: string;
  alt: string;
};

export type BlockOutput = {
  _type: string;
  [field: string]: unknown;
};

export type SeoOutput = {
  title: string;
  description: string;
  jsonLdType?: "Default" | "LocalBusiness" | "Service" | "Article" | "FAQPage";
  ogImage?: MediaOutput;
};

export type GeneratedPage = {
  title: string;
  slug: string;
  blocks: BlockOutput[];
  seo: SeoOutput;
};

export type GeneratedSiteSettings = {
  businessName: string;
  tagline?: string;
  primaryUrl: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
  mainNav?: {
    links?: {
      label: string;
      href: string;
      children?: { label: string; href: string }[];
    }[];
    primaryCta?: CtaOutput;
  };
  utilityBar?: {
    secondaryCta?: CtaOutput;
  };
  footer?: {
    columns?: {
      heading: string;
      links: { label: string; href: string }[];
    }[];
    legalText?: string;
  };
  socialLinks?: { platform: string; href: string }[];
  llmsTxt?: string;
  defaultSeo?: {
    title: string;
    description: string;
  };
};

export type GeneratedSite = {
  settings: GeneratedSiteSettings;
  pages: GeneratedPage[];
};
