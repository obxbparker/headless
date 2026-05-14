import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const META_FIELDS = new Set(["_formType", "_destinationEmail", "_subjectLine"]);

type SubmissionPayload = {
  formType: string;
  destinationEmail: string;
  subjectLine?: string;
  fields: Record<string, string>;
  files: Array<{ name: string; size: number; type: string }>;
  receivedAt: string;
  origin?: string;
  userAgent?: string;
};

function sanitize(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  if (typeof value === "string") return value.trim();
  return null;
}

export async function POST(request: NextRequest) {
  const successUrl = new URL("/thank-you", request.url);
  const errorUrl = new URL("/form-error", request.url);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    console.error("[form-submit] failed to parse FormData", err);
    return NextResponse.redirect(errorUrl, 303);
  }

  const formType = sanitize(formData.get("_formType")) ?? "contact";
  const destinationEmail = sanitize(formData.get("_destinationEmail"));
  const subjectLine = sanitize(formData.get("_subjectLine")) ?? undefined;

  if (!destinationEmail) {
    console.warn(
      "[form-submit] rejected: missing _destinationEmail. " +
        "The form block must include destinationEmail in its Sanity config.",
    );
    return NextResponse.redirect(errorUrl, 303);
  }

  const fields: Record<string, string> = {};
  const files: SubmissionPayload["files"] = [];

  for (const [name, value] of formData.entries()) {
    if (META_FIELDS.has(name)) continue;
    if (value instanceof File) {
      if (value.size === 0 && !value.name) continue;
      files.push({ name: value.name, size: value.size, type: value.type });
      continue;
    }
    const trimmed = sanitize(value);
    if (trimmed !== null && trimmed !== "") fields[name] = trimmed;
  }

  const payload: SubmissionPayload = {
    formType,
    destinationEmail,
    subjectLine,
    fields,
    files,
    receivedAt: new Date().toISOString(),
    origin: request.headers.get("origin") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };

  // Phase 1 backend: console log only. Phase 2 will plug in a real
  // transactional email sender (Resend / SMTP-over-sockets) behind this
  // same interface.
  console.log(
    "\n[form-submit] new submission",
    "\n  formType:        ",
    payload.formType,
    "\n  destinationEmail:",
    payload.destinationEmail,
    payload.subjectLine ? `\n  subjectLine:      ${payload.subjectLine}` : "",
    "\n  fields:          ",
    payload.fields,
    files.length ? `\n  files:           ${files.map((f) => `${f.name} (${f.size}B)`).join(", ")}` : "",
    "\n",
  );

  successUrl.searchParams.set("ref", formType);
  return NextResponse.redirect(successUrl, 303);
}

export async function GET() {
  return NextResponse.json(
    {
      error:
        "This endpoint only accepts POST. Submit a form via the FormBlock component.",
    },
    { status: 405, headers: { Allow: "POST" } },
  );
}
