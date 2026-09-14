import { getIcons } from "@devicons/icons";
import {
  generateSvgFromIcons,
} from "@devicons/svg-generator";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const iconQuery =
      searchParams.get("i");

    if (!iconQuery) {
      return new Response(
        "Missing icons. Example: ?i=html,css,javascript",
        {
          status: 400,
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
    }

    const requestedIcons =
      iconQuery
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const selectedIcons =
      getIcons(requestedIcons);

    if (selectedIcons.length === 0) {
      return new Response(
        "No valid icons found.",
        {
          status: 400,
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
    }

    const theme =
      searchParams.get("theme") === "light"
        ? "light"
        : "dark";

    const size = Number(
      searchParams.get("size") || 64
    );

    const perline = Number(
      searchParams.get("perline") || 5
    );

    const gap = Number(
      searchParams.get("gap") || 12
    );

    const styleParam =
      searchParams.get("style");

    const style =
      styleParam === "glass" ||
      styleParam === "neon" ||
      styleParam === "monochrome"
        ? styleParam
        : "minimal";

    const url = new URL(request.url);

    const svg =
  await generateSvgFromIcons(
    {
      icons: selectedIcons,
      theme,
      size,
      perline,
      gap,
      style,
    },
    url.origin
  );

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      "Failed to generate SVG.",
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }
}