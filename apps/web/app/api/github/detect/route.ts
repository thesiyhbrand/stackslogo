import {
  detectTechnologies,
} from "../../../../lib/github-detector";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const repo =
      searchParams.get("repo");

    if (!repo) {
      return Response.json(
        {
          error:
            "Missing GitHub repository URL.",
        },
        { status: 400 }
      );
    }

    const parsed =
      parseGitHubRepo(repo);

    if (!parsed) {
      return Response.json(
        {
          error:
            "Invalid GitHub repository URL.",
        },
        { status: 400 }
      );
    }

    const apiUrl =
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/HEAD?recursive=1`;

    const response =
      await fetch(apiUrl, {
        headers: {
          Accept:
            "application/vnd.github+json",
          "User-Agent":
            "DevIcons",
        },
        next: {
          revalidate: 3600,
        },
      });

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json(
          {
            error:
              "Repository not found or it is private.",
          },
          { status: 404 }
        );
      }

      if (response.status === 403) {
        return Response.json(
          {
            error:
              "GitHub API rate limit reached. Please try again later.",
          },
          { status: 429 }
        );
      }

      if (response.status === 401) {
        return Response.json(
          {
            error:
              "GitHub requires authentication for this repository.",
          },
          { status: 401 }
        );
      }

      return Response.json(
        {
          error:
            "GitHub could not access this repository.",
        },
        {
          status: response.status,
        }
      );
    }

    const data =
      await response.json();

    if (data.truncated) {
      return Response.json(
        {
          error:
            "This repository is too large to analyze completely.",
        },
        { status: 413 }
      );
    }

    if (!Array.isArray(data.tree)) {
      return Response.json(
        {
          error:
            "GitHub returned an invalid repository tree.",
        },
        { status: 502 }
      );
    }

    const files =
      data.tree
        .filter(
          (item: {
            type: string;
          }) =>
            item.type === "blob"
        )
        .map(
          (item: {
            path: string;
          }) => ({
            name:
              item.path
                .split("/")
                .pop() ?? "",
            path: item.path,
            type: "file" as const,
          })
        );

    const packageFiles =
      files.filter(
        (file) =>
          file.name ===
          "package.json"
      );

    const packageFilesToRead =
      packageFiles.slice(0, 20);

    const packageJsons =
      await Promise.all(
        packageFilesToRead.map(
          (file) =>
            fetchPackageJson(
              parsed.owner,
              parsed.repo,
              file.path
            )
        )
      );


    const technologies =
      detectTechnologies(
        files,
        packageJsons.filter(
          Boolean
        )
      );
    return Response.json({
      repository: {
        owner: parsed.owner,
        name: parsed.repo,
      },

      technologies,
    });
  } catch (error) {
    console.error(
      "GitHub detection failed:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to analyze repository.",
      },
      { status: 500 }
    );
  }
}

async function fetchPackageJson(
  owner: string,
  repo: string,
  filePath: string
) {
  const url =
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const response =
    await fetch(url, {
      headers: {
        Accept:
          "application/vnd.github+json",
        "User-Agent":
          "DevIcons",
      },

      next: {
        revalidate: 3600,
      },
    });

  if (!response.ok) {
    return undefined;
  }

  const data =
    await response.json();

  if (
    typeof data.content !==
    "string"
  ) {
    return undefined;
  }

  try {
    const content =
      Buffer.from(
        data.content,
        "base64"
      ).toString("utf8");

    return JSON.parse(content);
  } catch {
    return undefined;
  }
}

function parseGitHubRepo(
  value: string
): {
  owner: string;
  repo: string;
} | null {
  try {
    const url =
      new URL(value);

    if (
      url.hostname !==
      "github.com"
    ) {
      return null;
    }

    const parts =
      url.pathname
        .split("/")
        .filter(Boolean);

    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo:
        parts[1].replace(
          /\.git$/,
          ""
        ),
    };
  } catch {
    return null;
  }
}