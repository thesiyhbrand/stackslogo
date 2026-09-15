import type { IconDefinition } from "@devicons/icons";
import type { GenerateOptions } from "./types";

export function renderIcon(
  icon: IconDefinition,
  x: number,
  y: number,
  options: GenerateOptions
): string {
  const svg = scopeSvgIds(icon.svg.dark, icon.slug);

  const viewBoxMatch = svg.match(
    /viewBox="([^"]+)"/i
  );

  const viewBox =
    viewBoxMatch?.[1] ?? "0 0 128 128";

  let content = extractSvgContent(svg);

  const radius = Math.max(
    8,
    Math.round(options.size * 0.16)
  );

  const wrapper = renderStyleWrapper(
    x,
    y,
    options.size,
    radius,
    options
  );

  const effects = getStyleEffects(options);

  return `
    ${wrapper}
    <svg
      x="${x}"
      y="${y}"
      width="${options.size}"
      height="${options.size}"
      viewBox="${viewBox}"
      preserveAspectRatio="xMidYMid meet"
      ${effects}
    >
      ${content}
    </svg>
  `.trim();
}

function extractSvgContent(
  svg: string
): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<svg\b[^>]*>/i, "")
    .replace(/<\/svg>/i, "")
    .trim();
}

function renderStyleWrapper(
  x: number,
  y: number,
  size: number,
  radius: number,
  options: GenerateOptions
): string {
  switch (options.style) {
    case "glass":
      return `
        <rect
          x="${x}"
          y="${y}"
          width="${size}"
          height="${size}"
          rx="${radius}"
          fill="rgba(255,255,255,0.055)"
          stroke="rgba(255,255,255,0.14)"
          stroke-width="1"
        />
      `.trim();

    case "minimal":
    case "neon":
    default:
      return "";
  }
}

function getStyleEffects(options: GenerateOptions): string {
  if (options.style === "neon") {
    return 'filter="url(#neon-glow)"';
  }

  return "";
}
function scopeSvgIds(svg: string, slug: string): string {
  const prefix = `icon-${slug}-`;

  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => {
      return `id="${prefix}${id}"`;
    })
    .replace(/url\(#([^)]+)\)/g, (_, id) => {
      return `url(#${prefix}${id})`;
    })
    .replace(/href="#([^"]+)"/g, (_, id) => {
      return `href="#${prefix}${id}"`;
    })
    .replace(/xlink:href="#([^"]+)"/g, (_, id) => {
      return `xlink:href="#${prefix}${id}"`;
    });
}

