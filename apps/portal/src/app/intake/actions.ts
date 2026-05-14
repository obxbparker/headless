"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { redirect } from "next/navigation";

const INTAKE_DIR = join(process.cwd(), "data", "intake");

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "client";
}

function timestamp() {
  // YYYYMMDD-HHmmss in UTC — sortable, filename-safe.
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "-" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds())
  );
}

export async function submitIntake(formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const businessName = String(entries.businessName ?? "").trim();
  if (!businessName) {
    redirect("/intake?error=missing-business-name");
  }

  const slug = slugify(businessName);
  const ts = timestamp();
  const id = `${ts}-${slug}`;

  const payload = {
    _id: id,
    _createdAt: new Date().toISOString(),
    _source: "portal-intake-v1",
    businessName,
    industry: String(entries.industry ?? "").trim(),
    primaryDomain: String(entries.primaryDomain ?? "").trim(),
    primaryContact: String(entries.primaryContact ?? "").trim(),
    targetAudience: String(entries.targetAudience ?? "").trim(),
    tone: String(entries.tone ?? "").trim(),
    toneNotes: String(entries.toneNotes ?? "").trim(),
    services: String(entries.services ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    differentiators: String(entries.differentiators ?? "").trim(),
    serviceAreas: String(entries.serviceAreas ?? "").trim(),
    existingCopy: String(entries.existingCopy ?? "").trim(),
    assetUrls: String(entries.assetUrls ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    sitemap: String(entries.sitemap ?? "").trim(),
    notes: String(entries.notes ?? "").trim(),
  };

  await mkdir(INTAKE_DIR, { recursive: true });
  await writeFile(
    join(INTAKE_DIR, `${id}.json`),
    JSON.stringify(payload, null, 2),
    "utf8",
  );

  redirect(`/intake/${id}`);
}
