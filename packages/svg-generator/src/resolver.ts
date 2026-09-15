import type { IconDefinition } from "@devicons/icons";

function resolveSvgUrl(
  icon: IconDefinition,
  baseUrl?: string
): string {
  const source = icon.svg.dark;

  if (!source || typeof source !== "string") {
    throw new Error(
      `Missing SVG source for ${icon.slug}.`
    );
  }

  if (
    source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("//")
  ) {
    throw new Error(
      `External SVG source is not allowed for ${icon.slug}.`
    );
  }

  if (!baseUrl) {
    return source;
  }

  try {
    return new URL(source, baseUrl).toString();
  } catch {
    throw new Error(
      `Invalid SVG URL for ${icon.slug}.`
    );
  }
}

export async function resolveIconSvg(
  icon: IconDefinition,
  baseUrl?: string
): Promise<string> {
  const url = resolveSvgUrl(icon, baseUrl);

  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error(
      `Unable to load SVG for ${icon.slug}.`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load SVG for ${icon.slug} (${response.status}).`
    );
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  const svg = await response.text();

  if (!svg.trim()) {
    throw new Error(
      `Empty SVG response for ${icon.slug}.`
    );
  }

  if (
    contentType &&
    !contentType.includes("svg") &&
    !contentType.includes("xml") &&
    !contentType.includes("text")
  ) {
    throw new Error(
      `Unexpected SVG response for ${icon.slug}.`
    );
  }

  return svg;
}

export async function resolveIcons(
  icons: IconDefinition[],
  baseUrl?: string
): Promise<IconDefinition[]> {
  return Promise.all(
    icons.map(async (icon) => {
      const svg = await resolveIconSvg(
        icon,
        baseUrl
      );

      return {
        ...icon,
        svg: {
          dark: svg,
          light: svg,
        },
      };
    })
  );
}