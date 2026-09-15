"use client";

import { useEffect, useState } from "react";

import type { IconDefinition } from "@devicons/icons";

import { generateSvgFromIcons } from "@devicons/svg-generator";
import {
  createBuilderUrl,
  createStackApiUrl,
} from "../lib/stack-url";

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

  const [copiedUrl, setCopiedUrl] =
    useState(false);

  const [copiedMarkdown, setCopiedMarkdown] =
    useState(false);

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      if (selected.length === 0) {
        setGeneratedSvg("");
        return;
      }

      try {
        const svg = await generateSvgFromIcons(
          {
            icons: selected,
            size: settings.size,
            perline: settings.perline,
            gap: settings.gap,
            style: settings.style,
          },
          window.location.origin
        );

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
    settings.size,
    settings.perline,
    settings.gap,
    settings.style,
  ]);


  const stackApiUrl = createStackApiUrl(
    settings,
    selected,
    origin
  );

  const fullStackUrl = stackApiUrl;

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

  async function shareStack() {
    const url =
      createBuilderUrl(
        selected,
        settings,
        window.location.origin
      );

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

  function copyText(
    value: string,
    type: "url" | "markdown"
  ) {
    navigator.clipboard.writeText(value);

    if (type === "url") {
      setCopiedUrl(true);

      window.setTimeout(() => {
        setCopiedUrl(false);
      }, 1500);
    }

    if (type === "markdown") {
      setCopiedMarkdown(true);

      window.setTimeout(() => {
        setCopiedMarkdown(false);
      }, 1500);
    }
  }

  return (
    <section id="stack-builder" className="builder">
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
              <img
                src={icon.svg.dark}
                alt={icon.name}
              />

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

          {/* SIZE */}

          <div className="setting-row">
            <div className="setting-info">
              <label>
                Size
                <span className="setting-description">
                  Control icon size
                </span>
              </label>

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
            <p className="section-label">
              YOUR STACK URL
            </p>

            <h3>
              One URL. Use it anywhere.
            </h3>

            <p className="section-description">
              Embed your generated stack in your
              README, portfolio, website, or docs.
            </p>
          </div>
        </div>

        {/* SVG URL */}

        <div className="output-url">
          <code>{stackApiUrl}</code>

          <div className="output-url-actions">
            <a
              href={stackApiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="output-open"
            >
              Open
            </a>

            <button
              type="button"
              onClick={() => copyText(stackApiUrl, "url")}
            >
              {copiedUrl ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* MARKDOWN */}

        <div className="output-code-block">
          <div className="output-code-header">
            <div>
              <strong>Markdown</strong>
              <span className="output-label-description">
                Paste this directly into your GitHub README
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                copyText(
                  markdown,
                  "markdown"
                )
              }
            >
              {copiedMarkdown
                ? "Copied!"
                : "Copy"}
            </button>
          </div>

          <pre>
            <code>
              {markdown}
            </code>
          </pre>
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

        <div className="output-tips">
          <div className="output-tip">
            <span>01</span>

            <div>
              <strong>
                Copy the URL
              </strong>

              <p>
                Your stack is encoded into one
                shareable URL.
              </p>
            </div>
          </div>

          <div className="output-tip">
            <span>02</span>

            <div>
              <strong>
                Add it anywhere
              </strong>

              <p>
                Use it in GitHub, your portfolio,
                website, or documentation.
              </p>
            </div>
          </div>

          <div className="output-tip">
            <span>03</span>

            <div>
              <strong>
                Change your stack
              </strong>

              <p>
                Update your builder and the URL
                updates automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
