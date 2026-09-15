import type { IconDefinition } from "@devicons/icons";
import type { StackSettings } from "../components/BuilderApp";

const DEFAULT_SETTINGS: StackSettings = {
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

  if (settings.size !== DEFAULT_SETTINGS.size) {
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

  if (settings.gap !== DEFAULT_SETTINGS.gap) {
    params.set(
      "gap",
      String(settings.gap)
    );
  }

  if (settings.style !== DEFAULT_SETTINGS.style) {
    params.set(
      "style",
      settings.style
    );
  }

  return params.toString();
}

export function createStackApiUrl(
  settings: StackSettings,
  icons: IconDefinition[],
  origin: string
): string {
  const params = new URLSearchParams();

  params.set(
    "i",
    icons.map((icon) => icon.slug).join(",")
  );

  if (settings.size !== 64) {
    params.set("size", String(settings.size));
  }

  if (settings.perline !== 5) {
    params.set("perline", String(settings.perline));
  }

  if (settings.gap !== 12) {
    params.set("gap", String(settings.gap));
  }

  if (settings.style !== "minimal") {
    params.set("style", settings.style);
  }

  return `${origin}/api/stack?${params.toString()}`;
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