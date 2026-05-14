#!/usr/bin/env node
/**
 * seed.mjs — populate the smoketest-roofing Sanity project with rich
 * sample content. Run once after `sanity init` (or after creating the
 * project + writing .env.local manually).
 *
 *   pnpm --filter @outerbox-client/smoketest-roofing seed
 *
 * Idempotent:
 *   - Uses createOrReplace for documents (re-running overwrites).
 *   - Image assets are uploaded with deterministic labels; running twice
 *     creates two assets with the same label (Sanity assigns unique IDs).
 *     Cosmetic only — won't break anything.
 *
 * Reads env from .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 *   NEXT_PUBLIC_SANITY_API_VERSION, SANITY_WRITE_TOKEN
 */

import { createClient } from "next-sanity";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// --- Load .env.local manually (no dotenv dep) ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
try {
  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  console.error(`✘ Couldn't read ${envPath} — make sure it exists.`);
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-14";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("✘ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// --- Image upload helper ---
async function uploadPicsum(seed, width, height, alt) {
  const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  console.log(`  · fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`picsum ${seed} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buf, {
    filename: `${seed}.jpg`,
    contentType: "image/jpeg",
  });
  return {
    _type: "imageWithAlt",
    alt,
    asset: { _type: "reference", _ref: asset._id },
  };
}

console.log("→ Uploading images…");
const heroImg = await uploadPicsum("smoketest-hero", 1920, 1080, "Roofing crew at sunset on a residential project");
const aboutImg = await uploadPicsum("smoketest-about", 1000, 1000, "Smoketest Roofing team portrait");
const processImg = await uploadPicsum("smoketest-process", 1000, 1000, "Inspector taking notes on a roof");
const project1 = await uploadPicsum("smoketest-p1", 900, 700, "Beaverton ranch re-roof");
const project2 = await uploadPicsum("smoketest-p2", 900, 700, "Portland commercial TPO install");
const project3 = await uploadPicsum("smoketest-p3", 900, 700, "Lake Oswego standing-seam metal roof");
const project4 = await uploadPicsum("smoketest-p4", 900, 700, "Vancouver emergency storm repair");
const gallery1 = await uploadPicsum("smoketest-g1", 1000, 750, "Asphalt shingle replacement, Tigard");
const gallery2 = await uploadPicsum("smoketest-g2", 1000, 750, "Metal roof install, Hood River");
const gallery3 = await uploadPicsum("smoketest-g3", 1000, 750, "Flat-roof TPO, SE Portland");
const gallery4 = await uploadPicsum("smoketest-g4", 1000, 750, "Cedar shake, Lake Oswego");
const gallery5 = await uploadPicsum("smoketest-g5", 1000, 750, "Skylight retrofit, Beaverton");
const gallery6 = await uploadPicsum("smoketest-g6", 1000, 750, "Gutter + downspout replacement");

// --- Site Settings ---
console.log("→ Creating Site Settings…");
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  businessName: "Smoketest Roofing",
  tagline: "Pacific Northwest residential + commercial roofing since 1998.",
  primaryUrl: "https://smoketest-roofing.pages.dev",
  contactInfo: {
    phone: "(503) 555-0123",
    email: "hello@smoketestroofing.com",
    address: "1421 NW Front Ave\nPortland, OR 97209",
    hours: "Monday – Friday | 7:00 am – 6:00 pm\nSaturday & Sunday | Closed",
  },
  mainNav: {
    links: [
      { _key: "n1", label: "About", href: "#about" },
      { _key: "n2", label: "Services", href: "#services" },
      { _key: "n3", label: "Projects", href: "#projects" },
      { _key: "n4", label: "FAQs", href: "#faq" },
      { _key: "n5", label: "Contact", href: "#contact" },
    ],
    primaryCta: { label: "Free estimate", href: "#contact" },
  },
  utilityBar: {
    secondaryCta: { label: "Call (503) 555-0123", href: "tel:5035550123" },
  },
  footer: {
    columns: [
      {
        _key: "fc1",
        heading: "Services",
        links: [
          { _key: "fc1a", label: "Residential roofing", href: "#services" },
          { _key: "fc1b", label: "Commercial flat roofs", href: "#services" },
          { _key: "fc1c", label: "Inspections", href: "#services" },
          { _key: "fc1d", label: "Storm repair", href: "#services" },
        ],
      },
      {
        _key: "fc2",
        heading: "Company",
        links: [
          { _key: "fc2a", label: "About us", href: "#about" },
          { _key: "fc2b", label: "Our process", href: "#process" },
          { _key: "fc2c", label: "Projects", href: "#projects" },
          { _key: "fc2d", label: "FAQs", href: "#faq" },
        ],
      },
      {
        _key: "fc3",
        heading: "Contact",
        links: [
          { _key: "fc3a", label: "(503) 555-0123", href: "tel:5035550123" },
          { _key: "fc3b", label: "hello@smoketestroofing.com", href: "mailto:hello@smoketestroofing.com" },
          { _key: "fc3c", label: "Get a quote", href: "#contact" },
        ],
      },
    ],
    legalText: "© 2026 Smoketest Roofing LLC. OR CCB #123456 · WA #ROOFER123XX",
  },
  socialLinks: [
    { _key: "s1", platform: "facebook", href: "https://facebook.com/" },
    { _key: "s2", platform: "instagram", href: "https://instagram.com/" },
    { _key: "s3", platform: "google-business", href: "https://google.com/" },
  ],
  llmsTxt:
    "Smoketest Roofing is a family-owned residential and commercial roofing contractor serving the Portland, OR metro area since 1998. Services: residential roofing (asphalt, metal, cedar, slate), commercial flat roofs (TPO/EPDM/PVC), and inspections + maintenance. Licensed in Oregon (CCB #123456) and Washington (#ROOFER123XX). 50-year transferable workmanship warranty. Free same-day estimates. Phone (503) 555-0123. Email hello@smoketestroofing.com.",
  defaultSeo: {
    title: "Smoketest Roofing — Portland's residential + commercial roofers",
    description:
      "Family-owned roofing contractor serving Portland, OR since 1998. Residential, commercial, and inspections — backed by a 50-year warranty.",
  },
};
await client.createOrReplace(siteSettings);

// --- Home page with all 9 blocks ---
console.log("→ Creating Home page…");
const home = {
  _id: "home-page",
  _type: "page",
  title: "Home",
  slug: { _type: "slug", current: "home" },
  blocks: [
    {
      _key: "hero",
      _type: "hero-banner",
      eyebrow: "Portland's roofing experts",
      heading: "Built on craftsmanship, not shortcuts.",
      body: "Family-owned since 1998. Licensed, insured, and backed by a 50-year workmanship guarantee on every job we touch.",
      primaryCta: { label: "Get a free estimate", href: "#contact" },
      secondaryCta: { label: "See our work", href: "#projects" },
      backgroundTreatment: "image-dark-overlay",
      align: "left",
      media: heroImg,
    },
    {
      _key: "valueprop",
      _type: "value-prop-bar",
      background: "frost",
      items: [
        { _key: "vp1", _type: "valuePropItem", title: "25+ years", body: "Family-owned since 1998" },
        { _key: "vp2", _type: "valuePropItem", title: "Fully licensed", body: "OR CCB #123456 · WA #ROOFER123XX" },
        { _key: "vp3", _type: "valuePropItem", title: "50-year warranty", body: "Workmanship guaranteed in writing" },
        { _key: "vp4", _type: "valuePropItem", title: "Same-day quotes", body: "Most estimates within 24 hours" },
      ],
    },
    {
      _key: "about",
      _type: "media-content-50-50",
      eyebrow: "About us",
      heading: "Three generations on the same roofs.",
      body: "The same crew on your job from estimate to final inspection. We don't subcontract, we don't upsell, and we don't disappear after the deposit clears. Every project is documented with photos, and every estimate is fixed-price.",
      cta: { label: "Meet the team", href: "#about" },
      mediaShape: "rectangle",
      mediaSide: "left",
      background: "white",
      media: aboutImg,
    },
    {
      _key: "services",
      _type: "three-column-content",
      eyebrow: "Our services",
      heading: "What we do",
      body: "From a single leaky shingle to a full tear-off and replacement, every project gets the same level of care.",
      background: "frost",
      items: [
        {
          _key: "svc1",
          _type: "threeColumnItem",
          title: "Residential roofing",
          description:
            "Asphalt, metal, cedar, slate. Full tear-offs, partial replacements, and storm-damage repair across the metro.",
          href: "#contact",
        },
        {
          _key: "svc2",
          _type: "threeColumnItem",
          title: "Commercial flat roofs",
          description:
            "TPO, EPDM, and PVC systems with optional manufacturer warranty extensions up to 30 years.",
          href: "#contact",
        },
        {
          _key: "svc3",
          _type: "threeColumnItem",
          title: "Inspections & maintenance",
          description:
            "Annual inspections, gutter cleaning, and preventive maintenance plans for owners and HOAs.",
          href: "#contact",
        },
      ],
    },
    {
      _key: "projects",
      _type: "content-carousel-4-column",
      eyebrow: "Recent projects",
      heading: "A few jobs we're proud of",
      body: "Scroll through a slice of the work we've finished in the last 12 months across Portland metro and beyond.",
      cta: { label: "Request our full portfolio", href: "#contact" },
      background: "white",
      items: [
        {
          _key: "p1",
          _type: "contentCarouselItem",
          title: "Beaverton ranch re-roof",
          description: "Tear-off and full architectural shingle replacement on a 2,400 sq ft ranch.",
          href: "#projects",
          media: project1,
        },
        {
          _key: "p2",
          _type: "contentCarouselItem",
          title: "Portland commercial TPO",
          description: "20,000 sq ft TPO membrane install with extended manufacturer warranty.",
          href: "#projects",
          media: project2,
        },
        {
          _key: "p3",
          _type: "contentCarouselItem",
          title: "Lake Oswego standing seam",
          description: "Custom standing-seam metal roof with snow guards and integrated gutters.",
          href: "#projects",
          media: project3,
        },
        {
          _key: "p4",
          _type: "contentCarouselItem",
          title: "Vancouver storm repair",
          description: "Emergency tarp + full re-shingle after a 2024 windstorm. Insurance assist included.",
          href: "#projects",
          media: project4,
        },
      ],
    },
    {
      _key: "process",
      _type: "media-content-50-50",
      eyebrow: "Our process",
      heading: "No surprises, ever.",
      body: "Every estimate is fixed-price. We document every step with photos. You'll know what we're doing, why, and when — start to finish. If anything changes, you sign off in writing before we lift a tool.",
      cta: { label: "How it works", href: "#process" },
      mediaShape: "circle",
      mediaSide: "right",
      background: "white",
      media: processImg,
    },
    {
      _key: "gallery",
      _type: "gallery",
      eyebrow: "Before & after",
      heading: "See the difference",
      body: "A small sample of recent jobs across residential and commercial projects.",
      layout: "grid-3",
      background: "white",
      items: [
        { _key: "g1", _type: "galleryItem", image: gallery1, caption: "Asphalt shingle replacement, Tigard" },
        { _key: "g2", _type: "galleryItem", image: gallery2, caption: "Metal roof install, Hood River" },
        { _key: "g3", _type: "galleryItem", image: gallery3, caption: "Flat-roof TPO, SE Portland" },
        { _key: "g4", _type: "galleryItem", image: gallery4, caption: "Cedar shake, Lake Oswego" },
        { _key: "g5", _type: "galleryItem", image: gallery5, caption: "Skylight retrofit, Beaverton" },
        { _key: "g6", _type: "galleryItem", image: gallery6, caption: "Gutter + downspout replacement" },
      ],
    },
    {
      _key: "callout",
      _type: "callout",
      eyebrow: "Limited spots",
      heading: "Booking now for late summer installs",
      body: "Lock in 2026 pricing before the fall surge. Free inspections through July.",
      cta: { label: "Schedule inspection", href: "#contact" },
      secondaryCta: { label: "Call (503) 555-0123", href: "tel:5035550123" },
      background: "obx-blue",
      headingLevel: "h2",
    },
    {
      _key: "faq",
      _type: "faq",
      eyebrow: "FAQs",
      heading: "Questions we hear a lot",
      body: "If we missed yours, give us a call — straight answers, no pressure.",
      background: "frost",
      items: [
        {
          _key: "f1",
          _type: "faqItem",
          question: "How long does a full roof replacement take?",
          answer:
            "Most residential tear-off and re-roofs take 2–3 days from setup to cleanup. Larger or more complex jobs may run 4–5 days. Weather and site access can shift the schedule by a day or two.",
        },
        {
          _key: "f2",
          _type: "faqItem",
          question: "Do you offer financing?",
          answer:
            "Yes. We partner with a regional lender to offer 0%-down financing on qualified roof replacements, with terms from 24 to 84 months. We'll walk you through your options during your free estimate.",
        },
        {
          _key: "f3",
          _type: "faqItem",
          question: "What warranty do you provide?",
          answer:
            "Our standard workmanship warranty is 50 years and fully transferable to the next owner. Manufacturer material warranties pass through directly — typically 25–50 years depending on the product line you select.",
        },
        {
          _key: "f4",
          _type: "faqItem",
          question: "Are you licensed and insured?",
          answer:
            "Yes. Oregon CCB #123456 and Washington #ROOFER123XX. We carry $2M general liability and full workers' compensation coverage on every job, every crew member.",
        },
        {
          _key: "f5",
          _type: "faqItem",
          question: "Can you handle insurance claims?",
          answer:
            "Often, yes. We can inspect storm damage, document it for your insurer, and coordinate with the adjuster. We don't pressure you into a claim — if a small repair is the right call, we'll say so.",
        },
      ],
    },
    {
      _key: "contact",
      _type: "form",
      eyebrow: "Contact us",
      heading: "How can we help you today?",
      body: "Fill out the form and we'll be in touch within one business day. Or call (503) 555-0123 to speak with our team directly.",
      contactInfo: {
        phone: "(503) 555-0123",
        email: "hello@smoketestroofing.com",
        address: "1421 NW Front Ave\nPortland, OR 97209",
        hours: "Monday – Friday | 7:00 am – 6:00 pm\nSaturday & Sunday | Closed",
      },
      destinationEmail: "hello@smoketestroofing.com",
      formType: "contact",
      subjectLine: "New inquiry from smoketestroofing.com",
      submitLabel: "Send message",
      fields: [
        { _key: "f-fn", _type: "formField", name: "firstName", label: "First name", type: "text", required: true, width: "half" },
        { _key: "f-ln", _type: "formField", name: "lastName", label: "Last name", type: "text", required: true, width: "half" },
        { _key: "f-em", _type: "formField", name: "email", label: "Email", type: "email", required: true, width: "half" },
        { _key: "f-ph", _type: "formField", name: "phone", label: "Phone", type: "tel", required: true, width: "half" },
        {
          _key: "f-sv",
          _type: "formField",
          name: "service",
          label: "What can we help with?",
          type: "select",
          required: true,
          options: [
            { _key: "o1", value: "residential", label: "Residential roofing" },
            { _key: "o2", value: "commercial", label: "Commercial roof" },
            { _key: "o3", value: "inspection", label: "Inspection or maintenance" },
            { _key: "o4", value: "storm", label: "Storm damage / emergency" },
            { _key: "o5", value: "other", label: "Something else" },
          ],
        },
        {
          _key: "f-ms",
          _type: "formField",
          name: "message",
          label: "Anything else we should know?",
          type: "textarea",
          placeholder: "Tell us about your project, timeline, or questions.",
        },
      ],
    },
  ],
  seo: {
    title: "Smoketest Roofing — Portland's residential + commercial roofers",
    description:
      "Family-owned roofing contractor serving Portland, OR since 1998. Residential, commercial, and inspections — backed by a 50-year warranty. Free same-day estimates.",
    jsonLdType: "LocalBusiness",
  },
};
await client.createOrReplace(home);

console.log("✓ Seed complete.");
console.log(`  Sanity Studio: https://${projectId}.sanity.studio (after sanity deploy) or via this app's /studio route.`);
