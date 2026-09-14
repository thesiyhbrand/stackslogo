import type { GenerateOptions } from "./types";

export function validateOptions(options: GenerateOptions): void {
  if (options.size < 16 || options.size > 512) {
    throw new Error("size must be between 16 and 512");
  }

  if (options.perline < 1 || options.perline > 50) {
    throw new Error("perline must be between 1 and 50");
  }

  if (options.gap < 0 || options.gap > 128) {
    throw new Error("gap must be between 0 and 128");
  }
}
