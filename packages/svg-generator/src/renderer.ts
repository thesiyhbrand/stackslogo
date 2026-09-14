import type { IconDefinition } from "@devicons/icons";
import type { GenerateOptions } from "./types";

export function renderIcon(
  icon: IconDefinition,
  x: number,
  y: number,
  options: GenerateOptions
): string {
  const svg = icon.svg[options.theme];

  const content = svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<svg\b[^>]*>/i, "")
    .replace(/<\/svg>/i, "");

  return `
    <svg
      x="${x}"
      y="${y}"
      width="${options.size}"
      height="${options.size}"
      viewBox="0 0 64 64"
      preserveAspectRatio="xMidYMid meet"
    >
      ${content}
    </svg>
  `;
}