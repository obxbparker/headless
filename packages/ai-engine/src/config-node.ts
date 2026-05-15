/**
 * Node-only credential loaders for the CLI. Reads packages/ai-engine/.env
 * and clients/<slug>/.env.local. Do NOT import this from anywhere that
 * needs to run on Cloudflare Pages / edge — use engine.ts directly there.
 */
import { config as loadDotenv } from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { EngineCredentials, TargetClientEnv } from "./config.js";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const repoRoot = resolve(packageRoot, "..", "..");

loadDotenv({ path: join(packageRoot, ".env") });

function required(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(
      `Missing required env var ${name}. Set it in packages/ai-engine/.env (see .env.example).`,
    );
  }
  return v.trim();
}

function optional(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

export function loadTargetClientEnv(slug: string): TargetClientEnv {
  const envPath = join(repoRoot, "clients", slug, ".env.local");
  if (!existsSync(envPath)) {
    throw new Error(
      `Target client env not found: ${envPath}\n` +
        `Make sure clients/${slug}/.env.local exists with NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_WRITE_TOKEN.`,
    );
  }
  const raw = readFileSync(envPath, "utf8");
  const env: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match && match[1] && match[2] !== undefined) {
      env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const writeToken = env.SANITY_WRITE_TOKEN;
  if (!projectId) {
    throw new Error(`clients/${slug}/.env.local is missing NEXT_PUBLIC_SANITY_PROJECT_ID`);
  }
  if (!writeToken) {
    throw new Error(
      `clients/${slug}/.env.local is missing SANITY_WRITE_TOKEN. ` +
        `Generate at https://www.sanity.io/manage/project/${projectId}/api/tokens (Editor role).`,
    );
  }
  return {
    projectId,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-14",
    writeToken,
  };
}

export function loadCliCredentials(targetSlug: string): EngineCredentials {
  return {
    anthropic: {
      apiKey: required("ANTHROPIC_API_KEY"),
      model: optional("ANTHROPIC_MODEL", "claude-sonnet-4-6"),
    },
    portal: {
      projectId: optional("PORTAL_SANITY_PROJECT_ID", "ka9se3h4"),
      dataset: optional("PORTAL_SANITY_DATASET", "production"),
      apiVersion: optional("PORTAL_SANITY_API_VERSION", "2026-05-14"),
      token: required("PORTAL_SANITY_TOKEN"),
    },
    target: loadTargetClientEnv(targetSlug),
  };
}

export const paths = { repoRoot, packageRoot };
