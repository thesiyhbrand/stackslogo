import type { IconDefinition } from "@devicons/icons";

export type Theme = "dark" | "light";
export type StackStyle = "minimal" | "glass" | "neon" | "monochrome";

export interface GenerateOptions {
  icons: IconDefinition[];
  theme: Theme;
  size: number;
  perline: number;
  gap: number;
  style: StackStyle;
}
