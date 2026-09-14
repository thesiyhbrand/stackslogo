"use client";

import { useState } from "react";

import type { IconDefinition } from "@devicons/icons";

interface GitHubStackSyncProps {
  icons: IconDefinition[];
  onAddToBuilder: (
    slugs: string[]
  ) => void;
}

interface DetectedTechnology {
  slug: string;
  confidence: number;
  reason: string;
}

interface DetectionResponse {
  repository: {
    owner: string;
    name: string;
  };

  technologies: DetectedTechnology[];
}

export default function GitHubStackSync({
  icons,
  onAddToBuilder,
}: GitHubStackSyncProps) {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<DetectionResponse | null>(
      null
    );

  async function analyzeRepository() {
    const value = repo.trim();

    if (!value) {
      setError(
        "Enter a GitHub repository URL."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response =
        await fetch(
          `/api/github/detect?repo=${encodeURIComponent(
            value
          )}`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
          "Unable to analyze repository."
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAddToBuilder() {
    if (!result) {
      return;
    }

    onAddToBuilder(
      result.technologies.map(
        (technology) =>
          technology.slug
      )
    );
  }

  return (
    <section className="github-sync">
      <div className="github-sync-header">
        <div>
          <p className="section-label">
            GITHUB STACK SYNC
          </p>

          <h2>
            Turn your GitHub into a stack.
          </h2>

          <p className="section-description">
            Paste a public repository and
            DevIcons will detect the
            technologies you use.
          </p>
        </div>
      </div>

      <div className="github-sync-form">
        <input
          type="url"
          value={repo}
          onChange={(event) =>
            setRepo(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              analyzeRepository();
            }
          }}
          placeholder="https://github.com/username/project"
          aria-label="GitHub repository URL"
        />

        <button
          type="button"
          onClick={analyzeRepository}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Repository"}
        </button>
      </div>

      {error && (
        <div className="github-sync-error">
          {error}
        </div>
      )}

      {result && (
        <div className="github-sync-result">
          <div className="github-sync-result-header">
            <div>
              <span className="github-sync-repo">
                {result.repository.owner}/
                {result.repository.name}
              </span>

              <span className="github-sync-detected-label">
                {result.technologies.length}{" "}
                technologies detected
              </span>
            </div>

            {result.technologies.length >
              0 && (
                <button
                  type="button"
                  className="github-sync-add"
                  onClick={
                    handleAddToBuilder
                  }
                >
                  Add to Builder →
                </button>
              )}
          </div>

          {result.technologies.length ===
            0 ? (
            <div className="github-sync-empty">
              <strong>
                No supported technologies
                detected.
              </strong>

              <span>
                Try another repository or
                select technologies manually.
              </span>
            </div>
          ) : (
            <div className="github-sync-tech-grid">
              {result.technologies.map(
                (technology) => {
                  const icon =
                    icons.find(
                      (item) =>
                        item.slug ===
                        technology.slug
                    );

                  if (!icon) {
                    return null;
                  }

                  return (
                    <div
                      key={
                        technology.slug
                      }
                      className="github-sync-tech"
                    >
                      <div className="github-sync-tech-icon">
                        <img
                          src={icon.svg.dark}
                          alt=""
                        />
                      </div>

                      <div>
                        <strong>
                          {icon.name}
                        </strong>

                        <small className="github-sync-confidence">
                          {technology.confidence >= 95
                            ? "Detected"
                            : "Likely"}
                        </small>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}