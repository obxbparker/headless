import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const results: Record<string, string | { ok: true } | { ok: false; err: string }> = {};

  // 1. Can we import @outerbox/ai-engine at all?
  try {
    const mod = await import("@outerbox/ai-engine");
    results.aiEngineImport = {
      ok: true,
    };
    results.aiEngineExports = Object.keys(mod).join(", ");
  } catch (err) {
    results.aiEngineImport = { ok: false, err: (err as Error)?.message ?? String(err) };
  }

  // 2. Can we import @cloudflare/next-on-pages?
  try {
    const mod = await import("@cloudflare/next-on-pages");
    results.cfNextOnPagesImport = { ok: true };
    results.cfNextOnPagesExports = Object.keys(mod).join(", ");
  } catch (err) {
    results.cfNextOnPagesImport = { ok: false, err: (err as Error)?.message ?? String(err) };
  }

  // 3. Can we call getRequestContext?
  try {
    const mod = await import("@cloudflare/next-on-pages");
    const ctx = (mod as { getRequestContext?: () => unknown }).getRequestContext?.();
    results.getRequestContext = {
      ok: true,
    };
    results.ctxKeys = ctx ? Object.keys(ctx as object).join(", ") : "(undefined)";
  } catch (err) {
    results.getRequestContext = { ok: false, err: (err as Error)?.message ?? String(err) };
  }

  // 4. Env presence checks (no values leaked).
  results.envChecks = JSON.stringify({
    hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasPortalWriteToken: Boolean(process.env.SANITY_WRITE_TOKEN),
    hasPortalProjectId: Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  });

  return NextResponse.json(results);
}
