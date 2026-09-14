"use client";

import { useMemo, useState } from "react";
import { STACK_PRESETS } from "../lib/stack-presets";

import type { IconDefinition } from "@devicons/icons";

interface IconExplorerProps {
  icons: IconDefinition[];
  selected: IconDefinition[];
  onToggle: (icon: IconDefinition) => void;
  onApplyPreset?: (presetId: string) => void;
}

const categories = [
  "all",
  "language",
  "frontend",
  "backend",
  "database",
  "devops",
  "tool",
  "creative",
] as const;

type Category = (typeof categories)[number];

export default function IconExplorer({
  icons,
  selected,
  onToggle,
  onApplyPreset,
}: IconExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<Category>("all");

  const filteredIcons = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    const results = icons.filter((icon) => {
      const matchesCategory =
        category === "all" ||
        icon.category === category;

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        getSearchScore(icon, query) > 0
      );
    });

    if (!query) {
      return results;
    }

    return [...results].sort(
      (a, b) =>
        getSearchScore(b, query) -
        getSearchScore(a, query)
    );
  }, [icons, search, category]);

  function isSelected(
    slug: string
  ) {
    return selected.some(
      (icon) => icon.slug === slug
    );
  }

  function getSearchScore(
    icon: IconDefinition,
    query: string
  ): number {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return 0;
    }

    const name =
      icon.name.toLowerCase();

    const slug =
      icon.slug.toLowerCase();

    const aliases =
      icon.aliases.map((item) =>
        item.toLowerCase()
      );

    const keywords =
      icon.keywords.map((item) =>
        item.toLowerCase()
      );

    if (name === normalizedQuery) {
      return 100;
    }

    if (slug === normalizedQuery) {
      return 95;
    }

    if (aliases.includes(normalizedQuery)) {
      return 90;
    }

    if (name.startsWith(normalizedQuery)) {
      return 80;
    }

    if (slug.startsWith(normalizedQuery)) {
      return 75;
    }

    if (
      aliases.some((alias) =>
        alias.startsWith(normalizedQuery)
      )
    ) {
      return 70;
    }

    if (
      keywords.some((keyword) =>
        keyword === normalizedQuery
      )
    ) {
      return 60;
    }

    if (
      name.includes(normalizedQuery)
    ) {
      return 50;
    }

    if (
      keywords.some((keyword) =>
        keyword.includes(normalizedQuery)
      )
    ) {
      return 40;
    }

    return 0;
  }

  return (
    <section className="icon-explorer">
      <div className="explorer-header">
        <div>
          <p className="section-label">
            ICON EXPLORER
          </p>

          <h2>
            Choose your stack.
          </h2>

          <p className="section-description">
            Search and select the technologies
            you want to showcase.
          </p>
        </div>

        <div className="explorer-count">
          {selected.length} / 50 selected
        </div>
      </div>

      <div className="explorer-controls">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search technologies..."
          aria-label="Search technologies"
        />

        <div className="category-tabs">
          {categories.map((item) => {
            const count =
              item === "all"
                ? icons.length
                : icons.filter(
                  (icon) =>
                    icon.category === item
                ).length;

            const label =
              item === "all"
                ? "All"
                : item
                  .charAt(0)
                  .toUpperCase() +
                item.slice(1);

            return (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "category-tab active"
                    : "category-tab"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                <span>{label} </span>
                <span className="category-tab-count">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="stack-presets">
        <div className="stack-presets-header">
          <div>
            <p className="section-label">
              QUICK START
            </p>

            <h3>
              Start with a popular stack.
            </h3>
          </div>
        </div>

        <div className="stack-presets-grid">
          {STACK_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="stack-preset"
              onClick={() =>
                onApplyPreset(preset.id)
              }
            >
              <span className="stack-preset-name">
                {preset.name}
              </span>

              <span className="stack-preset-description">
                {preset.description}
              </span>

              <span className="stack-preset-action">
                Use preset →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="icon-grid">
        {filteredIcons.length === 0 ? (
          <div className="explorer-empty">
            <strong>
              No technologies found.
            </strong>

            <span>
              Try a different search or category.
            </span>
          </div>
        ) : (
          filteredIcons.map(
            (icon) => {
              const active =
                isSelected(
                  icon.slug
                );

              return (
                <button
                  key={icon.slug}
                  type="button"
                  className={
                    active
                      ? "icon-card selected"
                      : "icon-card"
                  }
                  onClick={() => onToggle(icon)}
                  aria-pressed={active}
                >
                  <div className="icon-card-image">
                    <img
                      src={icon.svg.dark}
                      alt=""
                    />
                  </div>

                  <span className="icon-card-name">
                    {icon.name}
                  </span>

                  {active && (
                    <span className="icon-card-status">
                      Selected
                    </span>
                  )}
                </button>
              );
            }
          )
        )}
      </div>
    </section>
  );
}