# StacksLogo

> Your stack. Your style. One URL.

StacksLogo is an open-source, dynamic developer stack visualizer and SVG generator. It allows you to effortlessly showcase the technologies you use with beautifully generated SVG icons right in your GitHub profile, portfolio, or anywhere else on the web!

## Features

- **Dynamic SVGs:** Generate high-quality tech stack icons dynamically via a single URL.
- **Customizable Layouts:** Configure icon sizing, per-line count, and gap spacing.
- **Theme Support:** Fully supports dark and light modes with beautifully stylized background elements.
- **Seamless Integration:** Just embed the generated URL in an `<img>` tag and you're good to go.

## Usage

You can use our public endpoint to generate your stack! Simply create a URL with the technologies you use.

```html
<!-- Example: A stack with React, Next.js, and TailwindCSS -->
<img src="https://yourdomain.com/api/stack?icons=react,nextjs,tailwindcss&size=64&perline=5&gap=16&theme=dark" alt="My Tech Stack" />
```

### URL Parameters

- `icons` (required): Comma-separated list of technology slugs (e.g., `react,nodejs,typescript`).
- `size` (optional): The size of the icons in pixels (default is dynamic).
- `perline` (optional): Number of icons to display per row.
- `gap` (optional): Spacing between icons.
- `theme` (optional): `dark` or `light` (default is `dark`).

## Monorepo Structure

This project uses a monorepo setup to keep concerns separated and maintainable:

- `apps/web` — Public builder, explorer, documentation, and the serverless SVG API.
- `packages/icons` — Icon registry, type definitions, and metadata.
- `packages/svg-generator` — Core rendering engine for framework-agnostic SVG generation.
- `packages/config` — Shared design tokens and configuration values.

## Running Locally

To get the project up and running on your local machine:

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Explore the app:**
   Open [http://localhost:3000](http://localhost:3000) to view the builder and icon explorer.

## Contributing

We welcome contributions! Feel free to add new icons or improve the SVG generation logic. 

1. Add your SVG assets to `apps/web/public/icons/<slug>/` (`dark.svg` and `light.svg`).
2. Register the icon in `packages/icons/src/registry.ts`.
3. Validate your assets using `pnpm validate:assets` and `pnpm validate:icons`.

The generator and registry are intentionally framework-agnostic so they can later be reused by the web app, API, CLI or other integrations.
