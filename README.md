# OuterBox Headless Platform

Internal production platform for building and launching OuterBox client websites. Pre-built component library + AI content automation + per-client Next.js deployments on Cloudflare Pages.

See [CLAUDE.md](CLAUDE.md) for full architecture, brand tokens, and phasing.

## Repo layout

```
packages/
├── ui/                  Component library (blocks + design tokens)
├── sanity-schemas/      Shared Sanity schema definitions
└── ai-engine/           Claude API: arrangement, copy gen, SEO/GEO (Phase 2)
apps/
├── portal/              Internal PM portal (intake + review)
└── site-template/       Base every client site is scaffolded from
scripts/
└── spawn-site/          CLI to scaffold a new client site
```

## Prerequisites

- Node.js v20+
- pnpm v9+ (`npm install -g pnpm`)
- wrangler (Phase 1 deploy): `pnpm add -g wrangler`

## Install

```bash
pnpm install
```

## Common commands

```bash
pnpm dev          # run all dev servers via Turborepo
pnpm build        # build everything
pnpm lint         # lint everything
pnpm type-check   # type-check everything
pnpm format       # format with Prettier
```

## Status

Phase 1 foundation in progress. See [plan](../../.claude/plans/you-should-have-a-happy-riddle.md).
