import type { ReactNode } from "react";
import Image from "next/image";
import {
  FooterA,
  MainNavigation,
  TemplateNavigation,
} from "@outerbox/ui";
import { sanityClient } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";
import { imageSrc, type SanityImageWithAlt } from "@/sanity/image";

type CtaRef = { label: string; href: string } | null | undefined;

type SiteSettings = {
  businessName?: string;
  tagline?: string;
  logo?: SanityImageWithAlt;
  logoOnDark?: SanityImageWithAlt;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
  mainNav?: {
    links?: Array<{
      label: string;
      href: string;
      children?: Array<{ label: string; href: string }>;
    }>;
    primaryCta?: CtaRef;
  };
  utilityBar?: {
    secondaryCta?: CtaRef;
  };
  footer?: {
    columns?: Array<{
      heading: string;
      links?: Array<{ label: string; href: string }>;
    }>;
    legalText?: string;
  };
  socialLinks?: Array<{ platform: string; href: string }>;
};

async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[SiteChrome] siteSettings fetch failed:", err);
    }
    return null;
  }
}

function LogoImg({
  image,
  alt,
  width = 160,
  height = 40,
}: {
  image?: SanityImageWithAlt;
  alt: string;
  width?: number;
  height?: number;
}) {
  const src = imageSrc(image, width * 2);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={image?.alt ?? alt}
      width={width}
      height={height}
      priority
      className="h-auto w-auto max-h-[40px]"
    />
  );
}

export async function SiteChrome({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  const businessName = settings?.businessName;
  const phone = settings?.contactInfo?.phone;
  const email = settings?.contactInfo?.email;

  return (
    <>
      <TemplateNavigation
        phone={phone}
        email={email}
        secondaryCta={settings?.utilityBar?.secondaryCta ?? undefined}
        socialLinks={settings?.socialLinks}
      />
      <MainNavigation
        businessName={businessName}
        logo={
          settings?.logo?.asset ? (
            <LogoImg image={settings.logo} alt={`${businessName ?? "Site"} logo`} />
          ) : undefined
        }
        links={settings?.mainNav?.links}
        primaryCta={settings?.mainNav?.primaryCta ?? undefined}
      />
      <main>{children}</main>
      <FooterA
        businessName={businessName}
        tagline={settings?.tagline}
        logo={
          settings?.logoOnDark?.asset ? (
            <LogoImg
              image={settings.logoOnDark}
              alt={`${businessName ?? "Site"} logo`}
            />
          ) : undefined
        }
        contact={{
          phone,
          email,
          address: settings?.contactInfo?.address,
        }}
        columns={settings?.footer?.columns?.map((col) => ({
          heading: col.heading,
          links: col.links ?? [],
        }))}
        socialLinks={settings?.socialLinks}
        legalText={settings?.footer?.legalText}
      />
    </>
  );
}
