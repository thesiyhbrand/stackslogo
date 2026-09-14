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
  const columns = Math.min(count, perline);
  const rows = Math.ceil(count / perline);

  const width =
    columns * size +
    Math.max(0, columns - 1) * gap;

  const height =
    rows * size +
    Math.max(0, rows - 1) * gap;

  const positions = Array.from(
    { length: count },
    (_, index) => {
      const row = Math.floor(index / perline);
      const column = index % perline;

      const iconsInThisRow =
        row === rows - 1
          ? count - row * perline
          : columns;

      const rowWidth =
        iconsInThisRow * size +
        Math.max(0, iconsInThisRow - 1) * gap;

      const rowOffset =
        (width - rowWidth) / 2;

      return {
        row,
        column,

        x:
          rowOffset +
          column * (size + gap),

        y:
          row * (size + gap),
      };
    }
  );

  return {
    width,
    height,
    positions,
  };
}