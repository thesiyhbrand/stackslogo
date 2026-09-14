import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { icons } from "@devicons/icons";

const projectRoot = process.cwd();

const publicIconsPath = path.join(
    projectRoot,
    "apps",
    "web",
    "public",
    "icons"
);

const forbiddenPatterns = [
    /<script\b/i,
    /javascript:/i,
    /\bon\w+\s*=/i,
    /<foreignObject\b/i,
    /<iframe\b/i,
];

let hasErrors = false;

console.log(
    `Validating ${icons.length} registered icons...\n`
);

for (const icon of icons) {
    validateAsset(icon.slug, "dark", icon.svg.dark);
    validateAsset(icon.slug, "light", icon.svg.light);
}

if (hasErrors) {
    console.error(
        "\nIcon asset validation failed."
    );

    process.exit(1);
}

console.log(
    `\n✓ All ${icons.length} icons passed asset validation.`
);

function validateAsset(
  slug: string,
  theme: "dark" | "light",
  assetPath: string
) {
  const relativePath =
    assetPath.replace(/^\/+/, "");

  const absolutePath = path.join(
    projectRoot,
    "apps",
    "web",
    "public",
    relativePath
  );

  let assetHasError = false;

  if (!existsSync(absolutePath)) {
    console.error(
      `✗ ${slug}/${theme}: file not found`
    );

    console.error(
      `  Expected: ${absolutePath}`
    );

    hasErrors = true;
    return;
  }

  let svg: string;

  try {
    svg = readFileSync(
      absolutePath,
      "utf8"
    );
  } catch {
    console.error(
      `✗ ${slug}/${theme}: unable to read file`
    );

    hasErrors = true;
    return;
  }

  if (!svg.trim().startsWith("<svg")) {
    console.error(
      `✗ ${slug}/${theme}: file does not start with <svg>`
    );

    assetHasError = true;
  }

  if (!/<svg\b[^>]*>/i.test(svg)) {
    console.error(
      `✗ ${slug}/${theme}: missing <svg> element`
    );

    assetHasError = true;
  }

  if (!/<\/svg>\s*$/i.test(svg.trim())) {
    console.error(
      `✗ ${slug}/${theme}: missing closing </svg>`
    );

    assetHasError = true;
  }

  if (!/viewBox="[^"]+"/i.test(svg)) {
    console.error(
      `✗ ${slug}/${theme}: missing viewBox`
    );

    assetHasError = true;
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(svg)) {
      console.error(
        `✗ ${slug}/${theme}: unsafe SVG content detected`
      );

      assetHasError = true;
      break;
    }
  }

  if (assetHasError) {
    hasErrors = true;
    return;
  }

  console.log(
    `✓ ${slug}/${theme}`
  );
}