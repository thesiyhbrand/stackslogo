import type { GenerateOptions } from "./types";

const FORBIDDEN_SVG_PATTERNS = [
  /<script\b/i,
  /javascript:/i,
  /\bon\w+\s*=/i,
  /<foreignObject\b/i,
  /<iframe\b/i,
];

const VALID_STYLES = new Set([
  "minimal",
  "glass",
  "neon",
]);

export function validateOptions(
  options: GenerateOptions
): void {
  if (!options || typeof options !== "object") {
    throw new Error(
      "Invalid generation options."
    );
  }

  if (!Array.isArray(options.icons)) {
    throw new Error(
      "icons must be an array."
    );
  }

  if (options.icons.length === 0) {
    throw new Error(
      "At least one icon is required."
    );
  }

  if (!Number.isFinite(options.size)) {
    throw new Error(
      "size must be a finite number."
    );
  }

  if (
    options.size < 16 ||
    options.size > 512
  ) {
    throw new Error(
      "size must be between 16 and 512."
    );
  }

  if (!Number.isFinite(options.perline)) {
    throw new Error(
      "perline must be a finite number."
    );
  }

  if (!Number.isInteger(options.perline)) {
    throw new Error(
      "perline must be an integer."
    );
  }

  if (
    options.perline < 1 ||
    options.perline > 50
  ) {
    throw new Error(
      "perline must be between 1 and 50."
    );
  }

  if (!Number.isFinite(options.gap)) {
    throw new Error(
      "gap must be a finite number."
    );
  }

  if (
    options.gap < 0 ||
    options.gap > 128
  ) {
    throw new Error(
      "gap must be between 0 and 128."
    );
  }

  if (!VALID_STYLES.has(options.style)) {
    throw new Error(
      "style must be minimal, glass, or neon"
    );
  }

  for (const icon of options.icons) {
    validateIcon(icon);
  }
}

function validateIcon(
  icon: GenerateOptions["icons"][number]
): void {
  if (!icon || typeof icon !== "object") {
    throw new Error(
      "Invalid icon definition."
    );
  }

  if (
    !icon.slug ||
    typeof icon.slug !== "string"
  ) {
    throw new Error(
      "Every icon must have a valid slug."
    );
  }

  if (
    !icon.svg ||
    typeof icon.svg !== "object"
  ) {
    throw new Error(
      `Invalid SVG definition for ${icon.slug}.`
    );
  }

  validateSvgSource(
    icon.svg.dark,
    icon.slug
  );
}

function validateSvgSource(
  source: string,
  slug: string
): void {
  if (typeof source !== "string") {
    throw new Error(
      `Invalid SVG source for ${slug}.`
    );
  }

  let normalized = source
    .replace(/^\uFEFF/, "")
    .trim();

  normalized = normalized.replace(
    /^<\?xml[\s\S]*?\?>\s*/i,
    ""
  );

  normalized = normalized.replace(
    /^<!DOCTYPE[\s\S]*?>\s*/i,
    ""
  );

  normalized = normalized.replace(
    /^(?:<!--[\s\S]*?-->\s*)+/,
    ""
  );

  const svgStart = normalized.search(
    /<svg(?:\s|>)/i
  );

  if (svgStart === -1) {
    throw new Error(
      `Invalid SVG source for ${slug}.`
    );
  }

  const svgSource =
    normalized.slice(svgStart);

  if (!/<\/svg\s*>/i.test(svgSource)) {
    throw new Error(
      `Invalid SVG source for ${slug}.`
    );
  }

  if (
    FORBIDDEN_SVG_PATTERNS.some(
      (pattern) => pattern.test(source)
    )
  ) {
    throw new Error(
      `Unsafe SVG source for ${slug}.`
    );
  }
}