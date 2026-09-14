import type { IconDefinition } from "@devicons/icons";
import type { GenerateOptions } from "./types";

export function renderIcon(
  icon: IconDefinition,
  x: number,
  y: number,
  options: GenerateOptions
): string {
  const svg = icon.svg[options.theme];

  const viewBoxMatch =
    svg.match(/viewBox="([^"]+)"/i);

  const viewBox =
    viewBoxMatch
      ? viewBoxMatch[1]
      : "0 0 128 128";

  const content = svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<svg\b[^>]*>/i, "")
    .replace(/<\/svg>/i, "");

  const radius = Math.max(
    8,
    options.size * 0.16
  );

  const background =
    getStyleBackground(options);

  const effects =
    getStyleEffects(options);

  const wrapper =
    getStyleWrapper(
      x,
      y,
      options.size,
      radius,
      options
    );

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
  `;
}

function getStyleBackground(
  options: GenerateOptions
): string {
  switch (options.style) {
    case "glass":
      return options.theme === "dark"
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.04)";

    case "neon":
      return "transparent";

    case "monochrome":
      return options.theme === "dark"
        ? "#1a1a1a"
        : "#f2f2f2";

    case "minimal":
    default:
      return "transparent";
  }
}

function getStyleWrapper(
  x: number,
  y: number,
  size: number,
  radius: number,
  options: GenerateOptions
): string {
  const background =
    getStyleBackground(options);

  switch (options.style) {
    case "glass":
      return `
        <rect
          x="${x}"
          y="${y}"
          width="${size}"
          height="${size}"
          rx="${radius}"
          fill="${background}"
          stroke="${
            options.theme === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.08)"
          }"
          stroke-width="1"
        />
      `;

    case "monochrome":
      return `
        <rect
          x="${x}"
          y="${y}"
          width="${size}"
          height="${size}"
          rx="${radius}"
          fill="${background}"
        />
      `;

    case "neon":
    case "minimal":
    default:
      return "";
  }
}

function getStyleEffects(
  options: GenerateOptions
): string {
  switch (options.style) {
    case "neon":
      return `filter="url(#neon-glow)"`;

    case "monochrome":
      return `filter="url(#monochrome)"`;

    case "glass":
    case "minimal":
    default:
      return "";
  }
}