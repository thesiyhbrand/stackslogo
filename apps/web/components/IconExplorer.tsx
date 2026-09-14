"use client";

import { useMemo, useState } from "react";

import type { IconDefinition } from "@devicons/icons";

interface IconExplorerProps {
  icons: IconDefinition[];
  selected: IconDefinition[];
  onToggle: (icon: IconDefinition) => void;
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
}: IconExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<Category>("all");

  const filteredIcons = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return icons.filter((icon) => {
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
        icon.name
          .toLowerCase()
          .includes(query) ||
        icon.slug
          .toLowerCase()
          .includes(query) ||
        icon.aliases.some((alias) =>
          alias
            .toLowerCase()
            .includes(query)
        ) ||
        icon.keywords.some((keyword) =>
          keyword
            .toLowerCase()
            .includes(query)
        )
      );
    });
  }, [icons, search, category]);

  function isSelected(
    slug: string
  ) {
    return selected.some(
      (icon) => icon.slug === slug
    );
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
          {selected.length} selected
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
          {categories.map(
            (item) => (
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
                {item === "all"
                  ? "All"
                  : item
                    .charAt(0)
                    .toUpperCase() +
                  item.slice(1)}
              </button>
            )
          )}
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