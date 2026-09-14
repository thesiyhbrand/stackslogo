import type { IconDefinition } from "@devicons/icons";

export async function resolveIconSvg(
  icon: IconDefinition,
  theme: "dark" | "light",
  baseUrl?: string
): Promise<string> {
  const url = icon.svg[theme];

  const resolvedUrl = baseUrl
    ? new URL(url, baseUrl).toString()
    : url;

  const response = await fetch(resolvedUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to load SVG for ${icon.slug}`
    );
  }

  return response.text();
}

export async function resolveIcons(
  icons: IconDefinition[],
  theme: "dark" | "light",
  baseUrl?: string
): Promise<IconDefinition[]> {
  return Promise.all(
    icons.map(async (icon) => {
      const svg =
        await resolveIconSvg(
          icon,
          theme,
          baseUrl
        );

      return {
        ...icon,
        svg: {
          dark:
            theme === "dark"
              ? svg
              : icon.svg.dark,

          light:
            theme === "light"
              ? svg
              : icon.svg.light,
        },
      };
    })
  );
}