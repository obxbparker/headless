import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/generate/ping", t: Date.now() });
}

export async function POST() {
  return NextResponse.json({ ok: true, route: "/api/generate/ping", t: Date.now() });
}
