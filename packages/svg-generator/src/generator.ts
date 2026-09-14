import type { IconDefinition } from "@devicons/icons";
import { getGridPositions } from "./layout";
import { renderIcon } from "./renderer";
import { validateOptions } from "./validator";
import { resolveIcons } from "./resolver";


import type { GenerateOptions } from "./types";

export function generateSvg(
  options: GenerateOptions
): string {
  validateOptions(options);

  const {
    width,
    height,
    positions,
  } = getGridPositions(
    options.icons.length,
    options.size,
    options.perline,
    options.gap
  );

  const iconMarkup =
    options.icons
      .map((icon, index) => {
        const position =
          positions[index];

        return renderIcon(
          icon,
          position.x,
          position.y,
          options
        );
      })
      .join("");

  const background =
    getBackground(options);

  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  role="img"
>
  <rect
    width="100%"
    height="100%"
    fill="${background}"
  />

  ${iconMarkup}
</svg>
`.trim();
}

export async function generateSvgFromIcons(
  options: GenerateOptions,
  baseUrl?: string
): Promise<string> {
  const resolvedIcons =
    await resolveIcons(
      options.icons,
      options.theme,
      baseUrl
    );

  return generateSvg({
    ...options,
    icons: resolvedIcons,
  });
}

function getBackground(
  options: GenerateOptions
): string {
  switch (options.style) {
    case "monochrome":
      return options.theme === "dark"
        ? "#111111"
        : "#eeeeee";

    case "glass":
      return options.theme === "dark"
        ? "#111111"
        : "#f4f4f4";

    case "neon":
      return options.theme === "dark"
        ? "#050505"
        : "#ffffff";

    case "minimal":
    default:
      return options.theme === "dark"
        ? "#080808"
        : "#ffffff";
  }
}