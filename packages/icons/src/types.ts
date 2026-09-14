export type IconCategory =
  | "language"
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "tool"
  | "creative";

export interface IconDefinition {
  slug: string;
  name: string;

  aliases: string[];

  category: IconCategory;

  keywords: string[];

  homepage?: string;

  svg: {
    dark: string;
    light: string;
  };
}