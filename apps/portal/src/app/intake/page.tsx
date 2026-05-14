import Link from "next/link";
import { submitIntake } from "./actions";
import { PortalChrome } from "@/components/PortalChrome";

export const runtime = "edge";

export const metadata = {
  title: "New client intake — OuterBox Portal",
};

const TONE_OPTIONS = [
  "Professional & polished",
  "Friendly & approachable",
  "Bold & confident",
  "Warm & local",
  "Technical & expert",
  "Playful & quirky",
];

export default function IntakePage() {
  return (
    <PortalChrome>
    <div className="mx-auto flex max-w-[820px] flex-col gap-xl">
      <header className="flex flex-col gap-sm">
        <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
          New client
        </p>
        <h1 className="font-heading text-heading-2 font-bold leading-tight text-dark-blue">
          Project intake
        </h1>
        <p className="max-w-body text-base leading-body text-slate">
          Capture everything we need to build the site. Fields marked * are
          required. Anything you skip becomes a gap the AI will gap-fill or
          flag for review.
        </p>
      </header>

      <form
        action={submitIntake}
        className="flex flex-col gap-xl rounded-element bg-white p-xl shadow-sm"
      >
        <Fieldset legend="Business basics">
          <Field label="Business name *" name="businessName" required />
          <Field label="Industry *" name="industry" required placeholder="e.g. Residential roofing" />
          <Field
            label="Primary domain (if known)"
            name="primaryDomain"
            placeholder="example.com"
          />
          <Field
            label="Primary contact name"
            name="primaryContact"
            placeholder="Internal PM contact for this project"
          />
        </Fieldset>

        <Fieldset legend="Audience + tone">
          <Textarea
            label="Target audience *"
            name="targetAudience"
            required
            rows={3}
            placeholder="Who are they trying to reach? Demographics, location, decision-maker vs end-user, etc."
          />
          <Select
            label="Brand tone *"
            name="tone"
            required
            options={TONE_OPTIONS}
          />
          <Textarea
            label="Tone notes"
            name="toneNotes"
            rows={2}
            placeholder="Words to use / avoid, voice references, competitors to NOT sound like."
          />
        </Fieldset>

        <Fieldset legend="Services + offering">
          <Textarea
            label="Services offered *"
            name="services"
            required
            rows={4}
            placeholder="One service per line. Group sub-services if needed."
          />
          <Textarea
            label="Differentiators / proof points"
            name="differentiators"
            rows={3}
            placeholder="Years in business, certifications, awards, guarantees, unique process."
          />
          <Textarea
            label="Service areas / locations"
            name="serviceAreas"
            rows={2}
            placeholder="Cities, counties, regions, or radius from HQ."
          />
        </Fieldset>

        <Fieldset legend="Existing content">
          <Textarea
            label="Existing copy"
            name="existingCopy"
            rows={6}
            placeholder="Paste any existing site copy, brochures, or About text. Header it by page/section if you can — that helps the AI route it correctly."
          />
          <Textarea
            label="Asset URLs"
            name="assetUrls"
            rows={4}
            placeholder="One URL per line. Logos, photo galleries, video, brand guidelines, etc."
          />
        </Fieldset>

        <Fieldset legend="Sitemap (from sales/marketing)">
          <Textarea
            label="Strategic sitemap (JSON or plain list)"
            name="sitemap"
            rows={8}
            placeholder={`Paste the JSON sitemap, or an indented plain-text list like:\n- Home\n- About\n- Services\n  - Residential roofing\n  - Commercial roofing\n- Contact`}
          />
        </Fieldset>

        <Fieldset legend="Notes for the PM / AI">
          <Textarea
            label="Anything else?"
            name="notes"
            rows={3}
            placeholder="Internal context, deadlines, client quirks, content gaps to watch."
          />
        </Fieldset>

        <div className="flex flex-wrap items-center justify-between gap-md border-t border-dark-blue/10 pt-lg">
          <Link
            href="/"
            className="text-eyebrow font-bold uppercase tracking-eyebrow text-slate hover:text-dark-blue"
          >
            ← Back to portal
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-white hover:bg-deep-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obx-blue focus-visible:ring-offset-2"
          >
            Save intake
          </button>
        </div>
      </form>
    </div>
    </PortalChrome>
  );
}

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-md">
      <legend className="font-heading text-heading-4 font-bold uppercase tracking-eyebrow text-dark-blue">
        {legend}
      </legend>
      <div className="grid gap-md sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

const inputClass =
  "w-full rounded-input border border-dark-blue/15 bg-white px-sm py-xs text-base text-dark-blue placeholder:text-slate/60 focus:border-obx-blue focus:outline-none focus:ring-2 focus:ring-obx-blue/30";

function Field({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-xs sm:col-span-2">
      <span className="text-eyebrow font-bold uppercase tracking-eyebrow text-dark-blue">
        {label}
      </span>
      <input
        type="text"
        name={name}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  rows,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-xs sm:col-span-2">
      <span className="text-eyebrow font-bold uppercase tracking-eyebrow text-dark-blue">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows ?? 3}
        required={required}
        placeholder={placeholder}
        className={inputClass + " min-h-[88px] resize-y leading-body"}
      />
    </label>
  );
}

function Select({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-xs sm:col-span-2">
      <span className="text-eyebrow font-bold uppercase tracking-eyebrow text-dark-blue">
        {label}
      </span>
      <select name={name} required={required} className={inputClass} defaultValue="">
        <option value="" disabled>
          Choose one…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
