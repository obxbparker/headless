import {
  Callout,
  ContentCarousel4Column,
  Faq,
  FormBlock,
  Gallery,
  HeroBanner,
  MediaContent5050,
  ThreeColumnContent,
  ValuePropBar,
} from "@outerbox/ui";
import { SiteChrome } from "@/components/SiteChrome";

export const runtime = "edge";

export const metadata = {
  title: "Component Demo — OuterBox Site Template",
  description: "All 9 platform blocks rendered with sample content.",
};

export default function DemoPage() {
  return (
    <SiteChrome>
      <HeroBanner
        eyebrow="Sample Client"
        heading="Roofing experts trusted across the Pacific Northwest"
        body="Family-owned since 1998. Licensed, insured, and backed by a 50-year workmanship guarantee on every job we touch."
        primaryCta={{ label: "Request a quote", href: "#form" }}
        secondaryCta={{ label: "Our services", href: "#services" }}
        backgroundTreatment="image-dark-overlay"
        media={
          <img
            src="https://picsum.photos/seed/obx-hero/1600/900"
            alt=""
            aria-hidden
          />
        }
      />

      <ValuePropBar
        background="frost"
        items={[
          { title: "25+ years", body: "Family-owned since 1998" },
          { title: "Fully licensed", body: "OR CCB #123456 · WA #ROOFER123XX" },
          { title: "50-year warranty", body: "Workmanship guaranteed in writing" },
          { title: "Same-day quotes", body: "Most estimates within 24 hours" },
        ]}
      />

      <MediaContent5050
        eyebrow="About us"
        heading="Built on craftsmanship, not shortcuts."
        body="Three generations of roofers. The same crew on your job from estimate to final inspection. We don't subcontract, we don't upsell, and we don't disappear after the deposit clears."
        cta={{ label: "Meet the team", href: "#" }}
        mediaShape="rectangle"
        mediaSide="left"
        media={
          <img
            src="https://picsum.photos/seed/obx-about/800/800"
            alt=""
            aria-hidden
          />
        }
      />

      <div id="services">
        <ThreeColumnContent
          eyebrow="Our services"
          heading="What we do"
          body="From a single leaky shingle to a full tear-off and replacement, every project gets the same level of care."
          background="frost"
          items={[
            {
              title: "Residential roofing",
              description:
                "Asphalt, metal, cedar, slate. Full tear-offs, partial replacements, and storm-damage repair.",
              href: "#",
            },
            {
              title: "Commercial flat roofs",
              description:
                "TPO, EPDM, and PVC systems with optional warranty extensions up to 30 years.",
              href: "#",
            },
            {
              title: "Inspections & maintenance",
              description:
                "Annual inspections, gutter cleaning, and preventive maintenance plans for owners and HOAs.",
              href: "#",
            },
          ]}
        />
      </div>

      <ContentCarousel4Column
        eyebrow="Recent projects"
        heading="A few jobs we're proud of"
        body="Scroll through a slice of the work we've finished in the last 12 months."
        cta={{ label: "Full portfolio", href: "#" }}
        items={[
          {
            title: "Beaverton ranch re-roof",
            description: "Tear-off and full architectural shingle replacement on a 2,400 sq ft ranch.",
            href: "#",
            media: <img src="https://picsum.photos/seed/obx-c1/800/600" alt="" aria-hidden />,
          },
          {
            title: "Portland commercial TPO",
            description: "20,000 sq ft TPO membrane install with extended manufacturer warranty.",
            href: "#",
            media: <img src="https://picsum.photos/seed/obx-c2/800/600" alt="" aria-hidden />,
          },
          {
            title: "Lake Oswego standing seam",
            description: "Custom standing-seam metal roof with snow guards and gutters.",
            href: "#",
            media: <img src="https://picsum.photos/seed/obx-c3/800/600" alt="" aria-hidden />,
          },
          {
            title: "Vancouver storm repair",
            description: "Emergency tarp + full re-shingle after a 2024 windstorm. Insurance assist.",
            href: "#",
            media: <img src="https://picsum.photos/seed/obx-c4/800/600" alt="" aria-hidden />,
          },
        ]}
      />

      <MediaContent5050
        eyebrow="Our process"
        heading="No surprises, ever."
        body="Every estimate is fixed-price. We document every step with photos. You'll know what we're doing, why, and when — start to finish."
        cta={{ label: "How it works", href: "#" }}
        mediaShape="circle"
        mediaSide="right"
        background="white"
        media={
          <img
            src="https://picsum.photos/seed/obx-process/800/800"
            alt=""
            aria-hidden
          />
        }
      />

      <Gallery
        eyebrow="Before & after"
        heading="See the difference"
        body="A small sample of recent jobs across residential and commercial projects."
        layout="grid-3"
        items={[
          { image: <img src="https://picsum.photos/seed/obx-g1/900/675" alt="" aria-hidden />, caption: "Asphalt shingle replacement, Tigard" },
          { image: <img src="https://picsum.photos/seed/obx-g2/900/675" alt="" aria-hidden />, caption: "Metal roof install, Hood River" },
          { image: <img src="https://picsum.photos/seed/obx-g3/900/675" alt="" aria-hidden />, caption: "Flat-roof TPO, SE Portland" },
          { image: <img src="https://picsum.photos/seed/obx-g4/900/675" alt="" aria-hidden />, caption: "Cedar shake, Lake Oswego" },
          { image: <img src="https://picsum.photos/seed/obx-g5/900/675" alt="" aria-hidden />, caption: "Skylight retrofit, Beaverton" },
          { image: <img src="https://picsum.photos/seed/obx-g6/900/675" alt="" aria-hidden />, caption: "Gutter + downspout replacement" },
        ]}
      />

      <Callout
        eyebrow="Limited spots"
        heading="Booking now for late summer installs"
        body="Lock in 2026 pricing before the fall surge. Free inspections through July."
        cta={{ label: "Schedule inspection", href: "#form" }}
        secondaryCta={{ label: "Call (555) 123-4567", href: "tel:5551234567" }}
        background="obx-blue"
        headingLevel="h2"
      />

      <Faq
        eyebrow="FAQs"
        heading="Questions we hear a lot"
        body="If we missed yours, give us a call — straight answers, no pressure."
        items={[
          {
            question: "How long does a full roof replacement take?",
            answer:
              "Most residential tear-off and re-roofs take 2–3 days from setup to cleanup. Larger or more complex jobs may run 4–5 days. Weather and access can shift the schedule.",
          },
          {
            question: "Do you offer financing?",
            answer:
              "Yes. We partner with a regional lender to offer 0%-down financing on qualified roof replacements, with terms from 24 to 84 months. We'll walk you through options during your estimate.",
          },
          {
            question: "What warranty do you provide?",
            answer:
              "Our standard workmanship warranty is 50 years and fully transferable. Manufacturer material warranties are passed through directly — typically 25–50 years depending on the product.",
          },
          {
            question: "Are you licensed and insured?",
            answer:
              "Yes. Oregon CCB #123456 and Washington #ROOFER123XX. We carry $2M general liability and full workers' comp on every job.",
          },
        ]}
      />

      <div id="form">
        <FormBlock
          eyebrow="Contact us"
          heading="How can we help you today?"
          body="Fill out the form below and we'll be in touch within one business day."
          contactInfo={{
            phone: "(555) 123-4567",
            email: "hello@samplecontractor.com",
            address: "123 Sample St NW\nPortland, OR 97201",
            hours: "Monday – Friday | 7:00 am – 6:00 pm\nSaturday & Sunday | Closed",
          }}
          destinationEmail="leads@samplecontractor.com"
          subjectLine="New inquiry from samplecontractor.com"
          fields={[
            { name: "firstName", label: "First name", type: "text", required: true, width: "half" },
            { name: "lastName", label: "Last name", type: "text", required: true, width: "half" },
            { name: "email", label: "Email", type: "email", required: true, width: "half" },
            { name: "phone", label: "Phone", type: "tel", required: true, width: "half" },
            {
              name: "service",
              label: "What can we help with?",
              type: "select",
              required: true,
              options: [
                { value: "residential", label: "Residential roofing" },
                { value: "commercial", label: "Commercial roof" },
                { value: "inspection", label: "Inspection or maintenance" },
                { value: "other", label: "Something else" },
              ],
            },
            {
              name: "message",
              label: "Anything else we should know?",
              type: "textarea",
              placeholder: "Tell us about your project, timeline, or questions.",
            },
          ]}
          submitLabel="Send message"
        />
      </div>
    </SiteChrome>
  );
}
