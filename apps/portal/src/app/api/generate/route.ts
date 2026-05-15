import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { runGeneration, type EngineCredentials } from "@outerbox/ai-engine";
import { sanityWriteClient } from "@/sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "edge";

type GenerateBody = { intakeId?: string };

type ClientProject = {
  slug: string;
  displayName?: string;
  sanityProjectId?: string;
  sanityDataset?: string;
  sanityApiVersion?: string;
  sanityWriteToken?: string;
  primaryUrl?: string;
};

type IntakeWithTarget = {
  _id: string;
  status?: string;
  targetClient?: ClientProject | null;
};

// Prefer the draft (PM's latest unpublished edit) so they can hit Generate
// without an extra Publish step. Falls back to the published doc.
const QUERY = `*[_type == "intake" && _id in [$id, "drafts." + $id]] | order(_updatedAt desc)[0]{
  _id,
  status,
  targetClient->{
    slug, displayName, sanityProjectId, sanityDataset, sanityApiVersion, sanityWriteToken, primaryUrl
  }
}`;

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (err) {
    const message = (err as Error)?.message ?? String(err);
    const stack = (err as Error)?.stack ?? "";
    console.error("[api/generate] uncaught:", message, stack);
    return NextResponse.json(
      { ok: false, error: `Unhandled: ${message}`, where: stackTopFrame(stack) },
      { status: 500 },
    );
  }
}

function stackTopFrame(stack: string): string | undefined {
  const m = stack.match(/at [^\n]+/);
  return m ? m[0] : undefined;
}

async function handle(req: Request): Promise<Response> {
  let body: GenerateBody;
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const intakeId = body.intakeId?.trim();
  if (!intakeId) {
    return NextResponse.json({ ok: false, error: "intakeId is required" }, { status: 400 });
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY is not set on the portal Pages project." },
      { status: 500 },
    );
  }
  const portalToken = process.env.SANITY_WRITE_TOKEN;
  if (!portalToken) {
    return NextResponse.json(
      { ok: false, error: "SANITY_WRITE_TOKEN is not set on the portal Pages project." },
      { status: 500 },
    );
  }

  const portal = sanityWriteClient();
  const intake = await portal.fetch<IntakeWithTarget | null>(QUERY, { id: intakeId });
  if (!intake) {
    return NextResponse.json({ ok: false, error: `Intake ${intakeId} not found.` }, { status: 404 });
  }
  const tc = intake.targetClient;
  if (!tc?.sanityProjectId || !tc?.sanityWriteToken) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Intake has no targetClient reference, or the referenced clientProject is missing sanityProjectId / sanityWriteToken.",
      },
      { status: 400 },
    );
  }

  const credentials: EngineCredentials = {
    anthropic: {
      apiKey: anthropicApiKey,
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
    },
    portal: {
      projectId,
      dataset,
      apiVersion,
      token: portalToken,
    },
    target: {
      projectId: tc.sanityProjectId,
      dataset: tc.sanityDataset ?? "production",
      apiVersion: tc.sanityApiVersion ?? "2026-05-14",
      writeToken: tc.sanityWriteToken,
    },
  };

  // Patch whichever doc the GROQ resolved (draft or published) so the PM
  // sees the status change on the same doc they're editing.
  const docIdToPatch = intake._id;

  // Flip status to "generating" so the Studio + PMs see live state.
  await portal
    .patch(docIdToPatch)
    .set({ status: "generating", generationError: null })
    .commit({ autoGenerateArrayKeys: true });

  // Background work — Cloudflare cuts the HTTP response after ~30s wall-clock,
  // but ctx.waitUntil lets the worker keep running long enough to finish a
  // multi-minute generation. The intake doc is the source of truth for status.
  let ctx: { waitUntil(p: Promise<unknown>): void } | undefined;
  try {
    ctx = getRequestContext().ctx;
  } catch (err) {
    console.error("[api/generate] getRequestContext failed:", (err as Error)?.message);
  }
  const work = runAndPatch({ intakeId, docIdToPatch, slug: tc.slug, credentials, portalToken }).catch((err) => {
    console.error("[api/generate background] failed:", err);
  });
  if (ctx?.waitUntil) {
    ctx.waitUntil(work);
  } else {
    // Fallback: no Cloudflare context available (e.g. running locally).
    // Fire-and-forget — local Next dev keeps the process alive long enough.
    void work;
  }

  return NextResponse.json({
    ok: true,
    status: "started",
    intakeId,
    targetClient: { slug: tc.slug, displayName: tc.displayName ?? tc.slug },
    primaryUrl: tc.primaryUrl ?? null,
    pollHint: "Refresh the intake doc in Studio. Status will move to 'Generated' or 'Generation failed'.",
  });
}

async function runAndPatch(args: {
  intakeId: string;
  docIdToPatch: string;
  slug: string;
  credentials: EngineCredentials;
  portalToken: string;
}) {
  const portal = sanityWriteClient();
  try {
    const report = await runGeneration({
      credentials: args.credentials,
      intakeId: args.intakeId,
      targetSlug: args.slug,
    });
    await portal
      .patch(args.docIdToPatch)
      .set({
        status: "generated",
        generatedAt: new Date().toISOString(),
        generationError: null,
        generatedReport: {
          pagesWritten: report.pagesWritten,
          tokensIn: report.tokensIn,
          tokensOut: report.tokensOut,
          cacheReads: report.cacheReads,
          assetsUploaded: report.assetsUploaded,
          durationMs: report.durationMs,
        },
      })
      .commit({ autoGenerateArrayKeys: true });
  } catch (err) {
    const message = (err as Error)?.message ?? String(err);
    await portal
      .patch(args.docIdToPatch)
      .set({
        status: "generation-failed",
        generationError: message.slice(0, 2000),
      })
      .commit({ autoGenerateArrayKeys: true });
  }
}
