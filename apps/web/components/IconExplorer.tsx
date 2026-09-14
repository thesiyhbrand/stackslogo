"use client";

import { useMemo, useState } from "react";
import type { IconDefinition } from "@devicons/icons";

interface IconExplorerProps {
  icons: IconDefinition[];
  selected: IconDefinition[];
  onToggle: (icon: IconDefinition) => void;
}

const categories = [
  { label: "All", value: "all" },
  { label: "Languages", value: "language" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Database", value: "database" },
  { label: "DevOps", value: "devops" },
  { label: "Tools", value: "tool" },
  { label: "Creative", value: "creative" },
];

export default function IconExplorer({
  icons,
  selected,
  onToggle,
}: IconExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredIcons = useMemo(() => {
    const query = search.toLowerCase().trim();

    return icons.filter((icon) => {
      const matchesCategory =
        category === "all" ||
        icon.category === category;

      const matchesSearch =
        !query ||
        icon.name.toLowerCase().includes(query) ||
        icon.slug.toLowerCase().includes(query) ||
        icon.aliases.some((alias) =>
          alias.toLowerCase().includes(query)
        );

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [icons, search, category]);

  return (
    <section className="explorer">
      <div className="explorer-header">
        <div>
          <p className="section-label">
            ICON EXPLORER
          </p>

          <h2>Find your stack.</h2>

          <p className="section-description">
            Search through the DevIcons collection
            and build your stack.
          </p>
        </div>

        <div className="icon-count">
          {filteredIcons.length}
          <span> icons</span>
        </div>
      </div>

      <div className="explorer-controls">
        <input
          type="search"
          placeholder="Search icons..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item.value}
              className={
                category === item.value
                  ? "category active"
                  : "category"
              }
              onClick={() =>
                setCategory(item.value)
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="icon-grid">
        {filteredIcons.map((icon) => {
          const isSelected = selected.some(
            (item) =>
              item.slug === icon.slug
          );

          return (
            <button
              className={
                isSelected
                  ? "icon-card selected"
                  : "icon-card"
              }
              key={icon.slug}
              onClick={() =>
                onToggle(icon)
              }
            >
              <div className="icon-preview">
                <img
                  src={icon.svg.dark}
                  alt={icon.name}
                />
              </div>

              <div className="icon-info">
                <strong>
                  {icon.name}
                </strong>

                <span>
                  {icon.category}
                </span>
              </div>

              {isSelected && (
                <div className="icon-selected">
                  ✓ Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div className="empty-state">
          <p>No icons found.</p>

          <span>
            Try another search.
          </span>
        </div>
      )}
    </section>
  );
}