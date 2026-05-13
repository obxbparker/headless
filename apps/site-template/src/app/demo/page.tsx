import {
  HeroBanner,
  MediaContent5050,
  ThreeColumnContent,
  Callout,
  FormBlock,
} from "@outerbox/ui";

export const metadata = {
  title: "Component Demo — OuterBox Site Template",
  description: "All 5 priority blocks rendered with sample content.",
};

export default function DemoPage() {
  return (
    <main>
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

      <Callout
        eyebrow="Limited spots"
        heading="Booking now for late summer installs"
        body="Lock in 2026 pricing before the fall surge. Free inspections through July."
        cta={{ label: "Schedule inspection", href: "#form" }}
        secondaryCta={{ label: "Call (555) 123-4567", href: "tel:5551234567" }}
        background="obx-blue"
        headingLevel="h2"
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
    </main>
  );
}
