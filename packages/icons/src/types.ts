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
  svg: {
    dark: string;
    light: string;
  };
}