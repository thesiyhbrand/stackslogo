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
      return Response.json(
        {
          error:
            "Unable to access GitHub repository.",
        },
        {
          status: response.status,
        }
      );
    }

    const data =
      await response.json();

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

    const packageFile =
      files.find(
        (file: {
          name: string;
          path: string;
        }) =>
          file.path ===
          "package.json"
      );

    let packageJson;

    if (packageFile) {
      packageJson =
        await fetchPackageJson(
          parsed.owner,
          parsed.repo
        );
    }

    const technologies =
      detectTechnologies(
        files,
        packageJson
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
  repo: string
) {
  const url =
    `https://api.github.com/repos/${owner}/${repo}/contents/package.json`;

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