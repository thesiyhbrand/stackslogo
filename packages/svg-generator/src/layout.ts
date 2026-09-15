export interface GridPosition {
  x: number;
  y: number;
  row: number;
  column: number;
}

export interface GridLayout {
  width: number;
  height: number;
  positions: GridPosition[];
}

export function getGridPositions(
  count: number,
  size: number,
  perline: number,
  gap: number
): GridLayout {
  if (count <= 0) {
    return {
      width: 0,
      height: 0,
      positions: [],
    };
  }

  const safeSize = Math.max(1, Math.round(size));
  const safePerline = Math.max(1, Math.floor(perline));
  const safeGap = Math.max(0, Math.round(gap));

  const columns = Math.min(count, safePerline);
  const rows = Math.ceil(count / safePerline);

  const width =
    columns * safeSize +
    Math.max(0, columns - 1) * safeGap;

  const height =
    rows * safeSize +
    Math.max(0, rows - 1) * safeGap;

  const positions: GridPosition[] = [];

  for (let index = 0; index < count; index += 1) {
    const row = Math.floor(index / safePerline);
    const column = index % safePerline;

    const isLastRow = row === rows - 1;

    const iconsInRow = isLastRow
      ? count - row * safePerline
      : columns;

    const rowWidth =
      iconsInRow * safeSize +
      Math.max(0, iconsInRow - 1) * safeGap;

    const rowOffset = (width - rowWidth) / 2;

    positions.push({
      row,
      column,
      x: rowOffset + column * (safeSize + safeGap),
      y: row * (safeSize + safeGap),
    });
  }

  return {
    width,
    height,
    positions,
  };
}