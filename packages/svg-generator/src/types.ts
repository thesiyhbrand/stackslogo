import type { IconDefinition } from "@devicons/icons";

export type StackStyle =
  | "minimal"
  | "glass"
  | "neon"

export interface GenerateOptions {
  icons: IconDefinition[];
  size: number;
  perline: number;
  gap: number;
  style: StackStyle;
}