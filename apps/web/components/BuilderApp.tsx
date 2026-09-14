"use client";

import { useEffect, useState } from "react";

import type { IconDefinition } from "@devicons/icons";
import {
  createStackQuery,
} from "../lib/stack-url";

import IconExplorer from "./IconExplorer";
import StackBuilder from "./StackBuilder";

import { STACK_PRESETS } from "../lib/stack-presets";

interface BuilderAppProps {
  icons: IconDefinition[];
}

export type Theme = "dark" | "light";

export type StackStyle = "minimal" | "glass" | "neon" | "monochrome";

export interface StackSettings {
  theme: Theme;
  size: number;
  perline: number;
  gap: number;
  style: StackStyle;
}

const defaultSettings: StackSettings = {
  theme: "dark",
  size: 64,
  perline: 5,
  gap: 12,
  style: "minimal",
};

export default function BuilderApp({ icons }: BuilderAppProps) {
  const [selected, setSelected] = useState<IconDefinition[]>([]);

  const [settings, setSettings] = useState<StackSettings>(defaultSettings);

  const [initialized, setInitialized] = useState(false);

  /*
   * Restore stack configuration from URL.
   */
  useEffect(() => {
    if (!initialized) {
      return;
    }

    const query =
      createStackQuery(
        selected,
        settings
      );

    const newUrl =
      query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;

    window.history.replaceState(
      null,
      "",
      newUrl
    );
  }, [
    selected,
    settings,
    initialized,
  ]);

  /*
   * Keep the browser URL synchronized
   * with the current stack configuration.
   */
  useEffect(() => {
    if (!initialized) {
      return;
    }

    const params = new URLSearchParams();

    if (selected.length > 0) {
      params.set("i", selected.map((icon) => icon.slug).join(","));

      params.set("theme", settings.theme);

      params.set("size", String(settings.size));

      params.set("perline", String(settings.perline));

      params.set("gap", String(settings.gap));

      params.set("style", settings.style);
    }

    const query = params.toString();

    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    window.history.replaceState(null, "", newUrl);
  }, [selected, settings, initialized]);

  function toggleIcon(
    icon: IconDefinition
  ) {
    setSelected((current) => {
      const exists =
        current.some(
          (item) =>
            item.slug === icon.slug
        );

      if (exists) {
        return current.filter(
          (item) =>
            item.slug !== icon.slug
        );
      }

      if (current.length >= 50) {
        return current;
      }

      return [...current, icon];
    });
  }

  function removeIcon(slug: string) {
    setSelected((current) => current.filter((icon) => icon.slug !== slug));
  }

  function updateSettings(updates: Partial<StackSettings>) {
    setSettings((current) => ({
      ...current,
      ...updates,
    }));
  }

  function clearStack() {
    setSelected([]);
    setSettings(defaultSettings);

    window.history.replaceState(null, "", window.location.pathname);
  }

  function applyPreset(
    presetId: string
  ) {
    const preset =
      STACK_PRESETS.find(
        (item) => item.id === presetId
      );

    if (!preset) {
      return;
    }

    const presetIcons =
      preset.icons
        .map((slug) =>
          icons.find(
            (icon) =>
              icon.slug === slug
          )
        )
        .filter(
          (
            icon
          ): icon is IconDefinition =>
            Boolean(icon)
        );

    setSelected(presetIcons);
  }

  return (
    <>
      <IconExplorer icons={icons} selected={selected} onToggle={toggleIcon} onApplyPreset={applyPreset} />

      <StackBuilder
        selected={selected}
        onRemove={removeIcon}
        settings={settings}
        onSettingsChange={updateSettings}
        onClear={clearStack}
      />
    </>
  );
}
