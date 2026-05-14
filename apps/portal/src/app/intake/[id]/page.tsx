import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";

const INTAKE_DIR = join(process.cwd(), "data", "intake");

type IntakeRecord = {
  _id: string;
  _createdAt: string;
  businessName: string;
  industry: string;
  primaryDomain?: string;
  primaryContact?: string;
  targetAudience: string;
  tone: string;
  toneNotes?: string;
  services: string[];
  differentiators?: string;
  serviceAreas?: string;
  existingCopy?: string;
  assetUrls: string[];
  sitemap?: string;
  notes?: string;
};

async function readIntake(id: string): Promise<IntakeRecord | null> {
  if (!/^\d{8}-\d{6}-[a-z0-9-]+$/.test(id)) return null;
  try {
    const raw = await readFile(join(INTAKE_DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as IntakeRecord;
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Intake saved — OuterBox Portal",
};

export default async function IntakeReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await readIntake(id);
  if (!record) notFound();

  return (
    <div className="mx-auto flex max-w-[820px] flex-col gap-xl">
      <header className="flex flex-col gap-sm">
        <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
          Saved
        </p>
        <h1 className="font-heading text-heading-2 font-bold leading-tight text-dark-blue">
          Intake captured for {record.businessName}
        </h1>
        <p className="max-w-body text-base leading-body text-slate">
          Stored as{" "}
          <code className="rounded-sm bg-white px-xs py-xxs font-bold">
            apps/portal/data/intake/{id}.json
          </code>
          . Phase 2 picks this up automatically as input to the AI engine.
        </p>
      </header>

      <dl className="grid gap-md rounded-element bg-white p-xl text-base shadow-sm sm:grid-cols-2">
        <Row label="Industry" value={record.industry} />
        <Row label="Primary domain" value={record.primaryDomain || "—"} />
        <Row label="Primary contact" value={record.primaryContact || "—"} />
        <Row label="Tone" value={record.tone} />
        <Row label="Target audience" value={record.targetAudience} wide />
        <Row
          label="Services"
          value={record.services.length ? record.services.join(", ") : "—"}
          wide
        />
        <Row label="Differentiators" value={record.differentiators || "—"} wide />
        <Row label="Service areas" value={record.serviceAreas || "—"} wide />
        <Row
          label="Assets"
          value={record.assetUrls.length ? `${record.assetUrls.length} URLs` : "—"}
        />
        <Row
          label="Existing copy"
          value={record.existingCopy ? `${record.existingCopy.length} chars` : "—"}
        />
      </dl>

      <div className="flex flex-wrap gap-md">
        <Link
          href="/intake"
          className="inline-flex items-center justify-center rounded-button bg-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-white hover:bg-deep-blue"
        >
          Start another intake
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-button border-2 border-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-obx-blue hover:bg-obx-blue hover:text-white"
        >
          Back to portal
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={"flex flex-col gap-xxs" + (wide ? " sm:col-span-2" : "")}>
      <dt className="text-eyebrow font-bold uppercase tracking-eyebrow text-slate">
        {label}
      </dt>
      <dd className="whitespace-pre-line text-base leading-body text-dark-blue">
        {value}
      </dd>
    </div>
  );
}
