# spawn-site

CLI that scaffolds a new client site from `apps/site-template/` into `clients/{slug}/`.

## Usage

```bash
# Interactive
pnpm spawn-site

# Non-interactive
pnpm spawn-site --name "Sample Roofing" --slug sample-roofing --domain samplecontractor.com --yes
```

## What it does

1. Validates the slug + confirms `clients/{slug}/` is free
2. Copies `apps/site-template/` → `clients/{slug}/` (skipping `node_modules`, `.next`, `.vercel`, env files)
3. Rewrites `package.json` name → `@outerbox-client/{slug}`
4. Rewrites `wrangler.toml` project name → `{slug}`
5. Drops a `.env.local.example` with placeholder Sanity creds
6. Prints next-step commands

## What it does NOT do (Phase 1)

- Run `sanity init` — interactive; org/project naming is human work
- Run `wrangler pages project create` — interactive; needs CF auth
- Create a GitHub repo
- Deploy

These are Phase 2 automation candidates.

## After it runs

The CLI prints exact next-step commands. The order is:

1. `pnpm install` from repo root
2. `pnpm dlx sanity@latest init --env` from `clients/{slug}/`
3. Add localhost + prod URL to Sanity CORS
4. `pnpm dlx wrangler@4 pages project create {slug} --production-branch=main`
5. `pnpm --filter @outerbox-client/{slug} dev` to verify locally
6. Build + deploy

Reminder: every client gets its OWN Sanity project. Do not reuse IDs.
