#!/usr/bin/env node
/**
 * spawn-site — scaffold a new client site from apps/site-template.
 *
 * Usage:
 *   pnpm spawn-site
 *   pnpm spawn-site --name "Sample Roofing" --slug sample-roofing
 *   pnpm spawn-site --name "Sample Roofing" --slug sample-roofing --domain samplecontractor.com --yes
 *
 * What it does:
 *   1. Validates the slug + confirms target dir `clients/<slug>` is free
 *   2. Copies apps/site-template/ → clients/<slug>/ (skipping node_modules, .next, .vercel, env files)
 *   3. Rewrites package.json name + wrangler.toml project name
 *   4. Drops a .env.local.example with placeholder Sanity creds
 *   5. Prints next-step commands (sanity init, wrangler pages project create, pnpm install)
 *
 * What it intentionally does NOT do (Phase 1 simplicity — automate in Phase 2):
 *   - Run `sanity init` (interactive; pinning org/project per client is human work)
 *   - Run `wrangler pages project create` (interactive; needs CF auth)
 *   - Create a GitHub repo
 *   - Deploy
 */

import { cp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..");

const SKIP_PATTERNS = [
  /(^|\/)node_modules(\/|$)/,
  /(^|\/)\.next(\/|$)/,
  /(^|\/)\.vercel(\/|$)/,
  /(^|\/)\.turbo(\/|$)/,
  /(^|\/)\.env(\.[^/]*)?$/,
  /(^|\/)tsconfig\.tsbuildinfo$/,
  /\.log$/,
];

const RESERVED_SLUGS = new Set([
  "site-template",
  "portal",
  "ui",
  "sanity-schemas",
  "ai-engine",
  "spawn-site",
  "node_modules",
]);

/** Parse `--key value` and `--key=value` flags. Booleans use `--key` (no value). */
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq !== -1) {
      out[arg.slice(2, eq)] = arg.slice(eq + 1);
    } else {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[arg.slice(2)] = next;
        i++;
      } else {
        out[arg.slice(2)] = true;
      }
    }
  }
  return out;
}

function validateSlug(slug) {
  if (!slug) return "Slug is required.";
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(slug)) {
    return "Slug must be lowercase, start with a letter, and contain only letters/digits/hyphens.";
  }
  if (slug.length < 2 || slug.length > 40) {
    return "Slug must be 2–40 characters.";
  }
  if (RESERVED_SLUGS.has(slug)) {
    return `'${slug}' is reserved.`;
  }
  return null;
}

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function prompt(rl, label, fallback) {
  const suffix = fallback ? ` [${fallback}]` : "";
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || fallback || "";
}

async function confirm(rl, label, defaultYes = true) {
  const suffix = defaultYes ? " [Y/n]" : " [y/N]";
  const answer = (await rl.question(`${label}${suffix}: `)).trim().toLowerCase();
  if (!answer) return defaultYes;
  return answer === "y" || answer === "yes";
}

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyTemplate(srcDir, destDir) {
  await cp(srcDir, destDir, {
    recursive: true,
    filter: (path) => {
      const rel = path.slice(srcDir.length).replace(/^\/+/, "");
      return !SKIP_PATTERNS.some((re) => re.test(rel));
    },
  });
}

async function rewriteJson(path, mutate) {
  const raw = await readFile(path, "utf8");
  const obj = JSON.parse(raw);
  mutate(obj);
  await writeFile(path, JSON.stringify(obj, null, 2) + "\n");
}

async function rewriteWranglerToml(path, projectName) {
  let toml = await readFile(path, "utf8");
  toml = toml.replace(/^name\s*=.*$/m, `name = "${projectName}"`);
  await writeFile(path, toml);
}

async function writeEnvLocalExample(path, businessName, slug) {
  const body = `# ${businessName} — Sanity credentials
# Fill these in after running \`pnpm dlx sanity@latest init\` from this directory.
# Copy this file to .env.local (which is gitignored) and paste real values.

NEXT_PUBLIC_SANITY_PROJECT_ID=replace-me
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-13

# Optional — set if you want privately authenticated content reads (preview, drafts).
# Generate at https://www.sanity.io/manage/project/<projectId>/api/tokens
# SANITY_API_READ_TOKEN=
`;
  await writeFile(path, body);
}

function nextStepsBlock({ slug, businessName, domain, targetDir }) {
  const cdLine = `cd ${targetDir.replace(repoRoot + "/", "")}`;
  const cfProjectName = slug;
  return `
${"=".repeat(64)}
✓ Scaffold complete for ${businessName} (slug: ${slug})
${"=".repeat(64)}

NEXT STEPS — do these in order:

  1. Install workspace deps (from repo root):
       pnpm install

  2. Provision Sanity (interactive; will prompt for org + project name):
       ${cdLine}
       pnpm dlx sanity@latest init --env

     When it finishes, edit .env.local and confirm NEXT_PUBLIC_SANITY_*
     values are set.

  3. Add prod URL + localhost to Sanity CORS:
       https://www.sanity.io/manage → your project → API → CORS
       Allow: http://localhost:3000  and  https://${cfProjectName}.pages.dev
       (Tick "Allow credentials" for both.)

  4. Provision Cloudflare Pages:
       pnpm dlx wrangler@4 pages project create ${cfProjectName} \\
         --production-branch=main

  5. First local run:
       pnpm --filter @outerbox-client/${slug} dev

  6. First deploy (from this client directory):
       pnpm --filter @outerbox-client/${slug} pages:build
       pnpm dlx wrangler@4 pages deploy \\
         ${targetDir}/.vercel/output/static \\
         --project-name=${cfProjectName} \\
         --branch=main --commit-dirty=true

${domain ? `  7. Add custom domain (${domain}) in Cloudflare dashboard:\n       Pages → ${cfProjectName} → Custom domains → Set up\n` : ""}
Reminder: every client site needs its OWN Sanity project. Do not reuse
project IDs across clients — that breaks content isolation.
${"=".repeat(64)}
`;
}

async function main() {
  const argv = parseArgs(process.argv.slice(2));

  if (argv.help || argv.h) {
    console.log(`Usage: pnpm spawn-site [--name "Client"] [--slug client-slug] [--domain example.com] [--yes]`);
    process.exit(0);
  }

  const interactive = !argv.yes;
  const rl = interactive
    ? createInterface({ input, output })
    : { question: () => Promise.resolve(""), close: () => {} };

  try {
    // --- Gather inputs ---
    let businessName = argv.name || "";
    if (!businessName) {
      businessName = await prompt(rl, "Client business name");
    }
    if (!businessName) {
      console.error("Aborted — business name is required.");
      process.exit(1);
    }

    let slug = argv.slug || "";
    if (!slug) {
      const suggested = slugify(businessName);
      slug = await prompt(rl, "URL-safe slug", suggested);
    }
    const slugError = validateSlug(slug);
    if (slugError) {
      console.error(`✘ ${slugError}`);
      process.exit(1);
    }

    let domain = argv.domain || "";
    if (interactive && !domain) {
      domain = await prompt(rl, "Primary domain (optional, e.g. example.com)", "");
    }

    // --- Compute paths + check collisions ---
    const srcDir = join(repoRoot, "apps", "site-template");
    const targetDir = join(repoRoot, "clients", slug);

    if (!existsSync(srcDir)) {
      console.error(`✘ Source template missing at ${srcDir}`);
      process.exit(1);
    }
    if (await pathExists(targetDir)) {
      console.error(`✘ Target directory already exists: ${targetDir}`);
      process.exit(1);
    }

    console.log(`\nWill create: ${targetDir}`);
    console.log(`  Package name:    @outerbox-client/${slug}`);
    console.log(`  CF Pages project: ${slug}`);
    if (domain) console.log(`  Domain:          ${domain}`);

    if (interactive) {
      const ok = await confirm(rl, "Proceed?", true);
      if (!ok) {
        console.log("Aborted.");
        process.exit(0);
      }
    }

    // --- Scaffold ---
    await mkdir(join(repoRoot, "clients"), { recursive: true });
    console.log("• Copying site-template…");
    await copyTemplate(srcDir, targetDir);

    console.log("• Rewriting package.json…");
    await rewriteJson(join(targetDir, "package.json"), (pkg) => {
      pkg.name = `@outerbox-client/${slug}`;
      pkg.description = `Client site for ${businessName}`;
      pkg.private = true;
    });

    console.log("• Rewriting wrangler.toml…");
    await rewriteWranglerToml(join(targetDir, "wrangler.toml"), slug);

    console.log("• Writing .env.local.example…");
    await writeEnvLocalExample(
      join(targetDir, ".env.local.example"),
      businessName,
      slug,
    );

    console.log(nextStepsBlock({ slug, businessName, domain, targetDir }));
  } finally {
    rl.close?.();
  }
}

main().catch((err) => {
  console.error("✘ spawn-site failed:", err);
  process.exit(1);
});
