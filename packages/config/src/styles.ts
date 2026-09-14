export const stackStyles = {
  minimal: { radius: 0, shadow: false },
  glass: { radius: 16, shadow: true },
  neon: { radius: 12, shadow: true },
  monochrome: { radius: 8, shadow: false }
} as const;

export type StackStyle = keyof typeof stackStyles;
