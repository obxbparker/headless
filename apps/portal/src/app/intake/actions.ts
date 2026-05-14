"use server";

import { redirect } from "next/navigation";
import { sanityWriteClient } from "@/sanity/client";

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "client"
  );
}

function timestamp() {
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

function splitLines(value: unknown): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function submitIntake(formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const businessName = String(entries.businessName ?? "").trim();
  if (!businessName) {
    redirect("/intake?error=missing-business-name");
  }

  const id = `intake-${timestamp()}-${slugify(businessName)}`;

  const doc = {
    _id: id,
    _type: "intake",
    businessName,
    industry: String(entries.industry ?? "").trim(),
    primaryDomain: String(entries.primaryDomain ?? "").trim(),
    primaryContact: String(entries.primaryContact ?? "").trim(),
    targetAudience: String(entries.targetAudience ?? "").trim(),
    tone: String(entries.tone ?? "").trim(),
    toneNotes: String(entries.toneNotes ?? "").trim(),
    services: splitLines(entries.services),
    differentiators: String(entries.differentiators ?? "").trim(),
    serviceAreas: String(entries.serviceAreas ?? "").trim(),
    existingCopy: String(entries.existingCopy ?? "").trim(),
    assetUrls: splitLines(entries.assetUrls),
    sitemap: String(entries.sitemap ?? "").trim(),
    notes: String(entries.notes ?? "").trim(),
    status: "new" as const,
  };

  const client = sanityWriteClient();
  await client.create(doc);

  redirect(`/intake/${id}`);
}
