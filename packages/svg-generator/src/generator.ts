import { getGridPositions } from "./layout";
import { renderIcon } from "./renderer";
import { validateOptions } from "./validator";
import { resolveIcons } from "./resolver";
import type { GenerateOptions } from "./types";

export function generateSvg(options: GenerateOptions): string {
  validateOptions(options);

  const { width, height, positions } = getGridPositions(
    options.icons.length,
    options.size,
    options.perline,
    options.gap
  );

  const iconMarkup = options.icons
    .map((icon, index) => {
      const position = positions[index];

      return renderIcon(
        icon,
        position.x,
        position.y,
        options
      );
    })
    .join("");

  const defs = getDefs(options);
  const background = getBackground(options);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    defs,
    background,
    iconMarkup,
    "</svg>",
  ]
    .filter(Boolean)
    .join("");
}

function getDefs(options: GenerateOptions): string {
  if (options.style !== "neon") {
    return "";
  }

  return `
    <defs>
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  `
    .replace(/\s+/g, " ")
    .trim();
}

function getBackground(options: GenerateOptions): string {

  return "";
}

export async function generateSvgFromIcons(
  options: GenerateOptions,
  baseUrl?: string
): Promise<string> {
  const resolvedIcons = await resolveIcons(
    options.icons,
    baseUrl
  );

  return generateSvg({
    ...options,
    icons: resolvedIcons,
  });
}