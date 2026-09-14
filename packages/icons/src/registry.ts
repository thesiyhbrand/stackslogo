import type { IconDefinition } from "./types";

export const icons: IconDefinition[] = [
  {
    slug: "html",
    name: "HTML",
    aliases: ["html", "html5"],
    category: "frontend",
    svg: {
      dark: "/icons/html/dark.svg",
      light: "/icons/html/light.svg",
    },
  },
  {
    slug: "css",
    name: "CSS",
    aliases: ["css", "css3"],
    category: "frontend",
    svg: {
      dark: "/icons/css/dark.svg",
      light: "/icons/css/light.svg",
    },
  },
  {
    slug: "javascript",
    name: "JavaScript",
    aliases: ["js", "javascript"],
    category: "language",
    svg: {
      dark: "/icons/javascript/dark.svg",
      light: "/icons/javascript/light.svg",
    },
  },
];

const byAlias = new Map(
  icons.flatMap((icon) =>
    [icon.slug, ...icon.aliases].map((alias) => [
      alias.toLowerCase(),
      icon,
    ])
  )
);

export function getIcon(
  query: string
): IconDefinition | undefined {
  return byAlias.get(
    query.trim().toLowerCase()
  );
}

export function getIcons(
  queries: string[]
): IconDefinition[] {
  return queries
    .map(getIcon)
    .filter(
      (icon): icon is IconDefinition =>
        Boolean(icon)
    );
}