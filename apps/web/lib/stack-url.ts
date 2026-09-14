import type { IconDefinition } from "@devicons/icons";

import type { StackSettings } from "../components/BuilderApp";

const DEFAULT_SETTINGS: StackSettings = {
  theme: "dark",
  size: 64,
  perline: 5,
  gap: 12,
  style: "minimal",
};

export function createStackQuery(
  selected: IconDefinition[],
  settings: StackSettings
): string {
  const params = new URLSearchParams();

  if (selected.length > 0) {
    params.set(
      "i",
      selected
        .map((icon) => icon.slug)
        .join(",")
    );
  }

  if (
    settings.theme !==
    DEFAULT_SETTINGS.theme
  ) {
    params.set(
      "theme",
      settings.theme
    );
  }

  if (
    settings.size !==
    DEFAULT_SETTINGS.size
  ) {
    params.set(
      "size",
      String(settings.size)
    );
  }

  if (
    settings.perline !==
    DEFAULT_SETTINGS.perline
  ) {
    params.set(
      "perline",
      String(settings.perline)
    );
  }

  if (
    settings.gap !==
    DEFAULT_SETTINGS.gap
  ) {
    params.set(
      "gap",
      String(settings.gap)
    );
  }

  if (
    settings.style !==
    DEFAULT_SETTINGS.style
  ) {
    params.set(
      "style",
      settings.style
    );
  }

  return params.toString();
}

export function createStackApiUrl(
  selected: IconDefinition[],
  settings: StackSettings,
  origin = ""
): string {
  if (selected.length === 0) {
    return "";
  }

  const query = createStackQuery(
    selected,
    settings
  );

  return `${origin}/api/stack?${query}`;
}

export function createBuilderUrl(
  selected: IconDefinition[],
  settings: StackSettings,
  origin: string
): string {
  if (selected.length === 0) {
    return "";
  }

  const query = createStackQuery(
    selected,
    settings
  );

  return `${origin}/?${query}`;
}