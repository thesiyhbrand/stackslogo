# DevIcons

> Your stack. Your style. One URL.

DevIcons is a developer stack visualizer and SVG generator.

## Step 1 — Project Foundation

Monorepo foundation for:

- `apps/web` — public builder, explorer and documentation
- `apps/api` — SVG/API service boundary
- `packages/icons` — icon registry and metadata
- `packages/svg-generator` — framework-agnostic SVG generation
- `packages/config` — shared design/config values

## Start

```bash
pnpm install
pnpm dev
```

The generator and registry are intentionally framework-agnostic so they can later be reused by the web app, API, CLI or other integrations.
