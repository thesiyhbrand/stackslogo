import { getIcons } from "@devicons/icons";

import {
  generateSvgFromIcons,
} from "@devicons/svg-generator";

const MAX_ICONS = 50;

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    /*
     * ICONS
     */

    const iconQuery =
      searchParams.get("i");

    if (!iconQuery) {
      return errorResponse(
        "Missing icons. Example: ?i=html,css,javascript",
        400
      );
    }

    const requestedIcons =
      iconQuery
        .split(",")
        .map((item) =>
          item.trim().toLowerCase()
        )
        .filter(Boolean);

    if (
      requestedIcons.length === 0
    ) {
      return errorResponse(
        "At least one icon is required.",
        400
      );
    }

    if (
      requestedIcons.length >
      MAX_ICONS
    ) {
      return errorResponse(
        `Maximum ${MAX_ICONS} icons are allowed.`,
        400
      );
    }

    /*
     * RESOLVE ICONS
     */

    const selectedIcons =
      getIcons(requestedIcons);

    if (
      selectedIcons.length === 0
    ) {
      return errorResponse(
        "No valid icons found.",
        400
      );
    }

    /*
     * THEME
     */

    const themeParam =
      searchParams.get("theme");

    const theme =
      themeParam === "light"
        ? "light"
        : "dark";

    /*
     * SIZE
     */

    const size =
      parseNumber(
        searchParams.get("size"),
        64
      );

    if (
      size < 16 ||
      size > 512
    ) {
      return errorResponse(
        "size must be between 16 and 512.",
        400
      );
    }

    /*
     * PER LINE
     */

    const perline =
      parseNumber(
        searchParams.get("perline"),
        5
      );

    if (
      perline < 1 ||
      perline > 50
    ) {
      return errorResponse(
        "perline must be between 1 and 50.",
        400
      );
    }

    /*
     * GAP
     */

    const gap =
      parseNumber(
        searchParams.get("gap"),
        12
      );

    if (
      gap < 0 ||
      gap > 128
    ) {
      return errorResponse(
        "gap must be between 0 and 128.",
        400
      );
    }

    /*
     * STYLE
     */

    const styleParam =
      searchParams.get("style");

    const style =
      styleParam === "glass" ||
      styleParam === "neon" ||
      styleParam === "monochrome"
        ? styleParam
        : "minimal";

    /*
     * GENERATE SVG
     */

    const url =
      new URL(request.url);

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

    /*
     * RESPONSE
     */

    return new Response(svg, {
      status: 200,

      headers: {
        "Content-Type":
          "image/svg+xml; charset=utf-8",

        "Cache-Control":
          "public, max-age=31536000, immutable",

        "X-Content-Type-Options":
          "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "SVG generation failed:",
      error
    );

    return errorResponse(
      "Failed to generate SVG.",
      500
    );
  }
}


/*
 * HELPERS
 */

function parseNumber(
  value: string | null,
  fallback: number
): number {
  if (value === null) {
    return fallback;
  }

  const parsed =
    Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function errorResponse(
  message: string,
  status: number
): Response {
  return new Response(
    message,
    {
      status,
      headers: {
        "Content-Type":
          "text/plain; charset=utf-8",

        "Cache-Control":
          "no-store",

        "X-Content-Type-Options":
          "nosniff",
      },
    }
  );
}