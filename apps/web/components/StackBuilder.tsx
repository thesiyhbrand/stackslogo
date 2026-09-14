"use client";

import { useEffect, useState } from "react";

import type { IconDefinition } from "@devicons/icons";

import { generateSvgFromIcons } from "@devicons/svg-generator";

import type { StackSettings } from "./BuilderApp";

interface StackBuilderProps {
  selected: IconDefinition[];
  onRemove: (slug: string) => void;
  settings: StackSettings;
  onSettingsChange: (updates: Partial<StackSettings>) => void;
  onClear: () => void;
}

export default function StackBuilder({
  selected,
  onRemove,
  settings,
  onSettingsChange,
  onClear,
}: StackBuilderProps) {
  const [generatedSvg, setGeneratedSvg] = useState("");

  const [copied, setCopied] = useState<"url" | "markdown" | "svg" | null>(null);

  const [shared, setShared] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      if (selected.length === 0) {
        setGeneratedSvg("");
        return;
      }

      try {
        const svg = await generateSvgFromIcons({
          icons: selected,
          theme: settings.theme,
          size: settings.size,
          perline: settings.perline,
          gap: settings.gap,
          style: settings.style,
        });

        if (!cancelled) {
          setGeneratedSvg(svg);
        }
      } catch (error) {
        console.error("Failed to generate SVG:", error);

        if (!cancelled) {
          setGeneratedSvg("");
        }
      }
    }

    generate();

    return () => {
      cancelled = true;
    };
  }, [
    selected,
    settings.theme,
    settings.size,
    settings.perline,
    settings.gap,
    settings.style,
  ]);

  function getStackUrl() {
    if (selected.length === 0) {
      return "";
    }

    const params = new URLSearchParams({
      i: selected.map((icon) => icon.slug).join(","),

      theme: settings.theme,

      size: String(settings.size),

      perline: String(settings.perline),

      gap: String(settings.gap),

      style: settings.style,
    });

    return `/api/stack?${params.toString()}`;
  }

  const stackUrl = getStackUrl();

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const fullStackUrl = stackUrl ? `${origin}${stackUrl}` : "";

  const markdown = fullStackUrl ? `![My Stack](${fullStackUrl})` : "";

  async function copyToClipboard(
    value: string,
    type: "url" | "markdown" | "svg",
  ) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopied(type);

      setTimeout(() => {
        setCopied(null);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  function getBuilderUrl() {
    if (selected.length === 0) {
      return "";
    }

    const params = new URLSearchParams({
      i: selected.map((icon) => icon.slug).join(","),

      theme: settings.theme,

      size: String(settings.size),

      perline: String(settings.perline),

      gap: String(settings.gap),

      style: settings.style,
    });

    return `${window.location.origin}/?${params.toString()}`;
  }

  async function shareStack() {
    const url = getBuilderUrl();

    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      setShared(true);

      setTimeout(() => {
        setShared(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy share URL:", error);
    }
  }

  function downloadSvg() {
    if (!generatedSvg) {
      return;
    }

    const blob = new Blob([generatedSvg], {
      type: "image/svg+xml",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "devicons-stack.svg";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <section className="builder">
      {/* HEADER */}

      <div className="builder-header">
        <div>
          <p className="section-label">STACK BUILDER</p>

          <h2>Build your stack.</h2>

          <p className="section-description">
            Your selected technologies appear here.
          </p>
        </div>

        <div className="builder-header-actions">
          <div className="builder-count">{selected.length} selected</div>

          {selected.length > 0 && (
            <button type="button" className="clear-button" onClick={onClear}>
              Clear Stack
            </button>
          )}
        </div>
      </div>

      {/* SELECTED STACK */}

      <div className="selected-stack">
        {selected.length === 0 ? (
          <div className="builder-empty">
            <span>Your stack is empty.</span>

            <small>Select an icon from the explorer.</small>
          </div>
        ) : (
          selected.map((icon) => (
            <div className="selected-icon" key={icon.slug}>
              <img src={icon.svg[settings.theme]} alt={icon.name} />

              <span>{icon.name}</span>

              <button
                type="button"
                onClick={() => onRemove(icon.slug)}
                aria-label={`Remove ${icon.name}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

    <div className="builder-workspace">

  {/* STACK SETTINGS */}

  <div className="stack-settings">

    <div className="settings-header">
      <div>
        <p className="section-label">
          STACK SETTINGS
        </p>

        <h3>
          Make it yours.
        </h3>
      </div>
    </div>

    {/* THEME */}

    <div className="setting-row">
      <div className="setting-info">
        <strong>Theme</strong>

        <span>
          Choose the icon theme.
        </span>
      </div>

      <div className="setting-buttons">
        <button
          type="button"
          className={
            settings.theme === "dark"
              ? "setting-button active"
              : "setting-button"
          }
          onClick={() =>
            onSettingsChange({
              theme: "dark",
            })
          }
        >
          Dark
        </button>

        <button
          type="button"
          className={
            settings.theme === "light"
              ? "setting-button active"
              : "setting-button"
          }
          onClick={() =>
            onSettingsChange({
              theme: "light",
            })
          }
        >
          Light
        </button>
      </div>
    </div>

    {/* SIZE */}

    <div className="setting-row">
      <div className="setting-info">
        <strong>Size</strong>

        <span>
          Icon size in pixels.
        </span>
      </div>

      <div className="range-control">
        <input
          type="range"
          min="32"
          max="128"
          step="4"
          value={settings.size}
          onChange={(event) =>
            onSettingsChange({
              size: Number(event.target.value),
            })
          }
        />

        <output>
          {settings.size}px
        </output>
      </div>
    </div>

    {/* PER LINE */}

    <div className="setting-row">
      <div className="setting-info">
        <strong>Per line</strong>

        <span>
          Number of icons per row.
        </span>
      </div>

      <div className="range-control">
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={settings.perline}
          onChange={(event) =>
            onSettingsChange({
              perline: Number(event.target.value),
            })
          }
        />

        <output>
          {settings.perline}
        </output>
      </div>
    </div>

    {/* GAP */}

    <div className="setting-row">
      <div className="setting-info">
        <strong>Gap</strong>

        <span>
          Space between icons.
        </span>
      </div>

      <div className="range-control">
        <input
          type="range"
          min="0"
          max="40"
          step="2"
          value={settings.gap}
          onChange={(event) =>
            onSettingsChange({
              gap: Number(event.target.value),
            })
          }
        />

        <output>
          {settings.gap}px
        </output>
      </div>
    </div>

    {/* STYLE */}

    <div className="setting-row">
      <div className="setting-info">
        <strong>Style</strong>

        <span>
          Choose your stack appearance.
        </span>
      </div>

      <select
        value={settings.style}
        onChange={(event) =>
          onSettingsChange({
            style:
              event.target.value as StackSettings["style"],
          })
        }
      >
        <option value="minimal">
          Minimal
        </option>

        <option value="glass">
          Glass
        </option>

        <option value="neon">
          Neon
        </option>

        <option value="monochrome">
          Monochrome
        </option>
      </select>
    </div>

  </div>


  {/* LIVE PREVIEW */}

  <div className="live-preview">

    <div className="preview-header">
      <div>
        <p className="section-label">
          LIVE PREVIEW
        </p>

        <h3>
          Your stack, rendered.
        </h3>
      </div>

      <span className="preview-meta">
        {settings.size}px /{" "}
        {settings.perline} per line
      </span>
    </div>

    <div className="preview-stage">
      {selected.length === 0 ? (
        <span className="preview-placeholder">
          Your icons will appear here.
        </span>
      ) : generatedSvg ? (
        <div
          className="generated-svg"
          dangerouslySetInnerHTML={{
            __html: generatedSvg,
          }}
        />
      ) : (
        <span className="preview-placeholder">
          Generating your stack...
        </span>
      )}
    </div>

  </div>

</div>

      {/* OUTPUT */}

      <div className="stack-output">
        <div className="output-header">
          <div>
            <p className="section-label">OUTPUT</p>

            <h3>Ready to embed.</h3>
          </div>

          {selected.length > 0 && (
            <button type="button" className="share-button" onClick={shareStack}>
              {shared ? "Link Copied!" : "Share Stack"}
            </button>
          )}
        </div>

        {/* SVG URL */}

        <div className="output-block">
          <div className="output-label">
            <span>SVG URL</span>

            {fullStackUrl && (
              <button
                type="button"
                className="copy-button"
                onClick={() => copyToClipboard(fullStackUrl, "url")}
              >
                {copied === "url" ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <code className="output-code">
            {fullStackUrl || "Select icons to generate a URL."}
          </code>
        </div>

        {/* MARKDOWN */}

        <div className="output-block">
          <div className="output-label">
            <span>Markdown</span>

            {markdown && (
              <button
                type="button"
                className="copy-button"
                onClick={() => copyToClipboard(markdown, "markdown")}
              >
                {copied === "markdown" ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <code className="output-code">
            {markdown || "Your Markdown embed will appear here."}
          </code>
        </div>

        {/* RAW SVG */}

        <div className="output-block">
          <div className="output-label">
            <span>Raw SVG</span>

            <div className="output-actions">
              {generatedSvg && (
                <>
                  <button
                    type="button"
                    className="copy-button"
                    onClick={() => copyToClipboard(generatedSvg, "svg")}
                  >
                    {copied === "svg" ? "Copied!" : "Copy SVG"}
                  </button>

                  <button
                    type="button"
                    className="copy-button"
                    onClick={downloadSvg}
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>

          <code className="output-code">
            {generatedSvg || "Your raw SVG will appear here."}
          </code>
        </div>
      </div>
    </section>
  );
}
