export interface Point {
  x: number;
  y: number;
}

export interface TriadGroupingShape {
  key: string;
  cx: number;
  cy: number;
  r: number;
}

/** Half of --note-marker-size (max ~28px) */
const NOTE_MARKER_RADIUS = 14;

/** Padding beyond the note bounding box */
const GROUP_SHAPE_PADDING = 14;

/** Minimum radius so tight stacks still read as a group */
const MIN_RADIUS = 34;

/** One circle that wraps all three notes in a distinct voicing */
export const buildGroupCircle = (
  points: Point[]
): Pick<TriadGroupingShape, 'cx' | 'cy' | 'r'> => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const pad = NOTE_MARKER_RADIUS + GROUP_SHAPE_PADDING;

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const rx = (maxX - minX) / 2 + pad;
  const ry = (maxY - minY) / 2 + pad;

  return {
    cx,
    cy,
    r: Math.max(Math.max(rx, ry), MIN_RADIUS),
  };
};

export const measureTriadGroupingShapes = (
  board: HTMLElement,
  triadGroupings: { id: string; positions: { string: number; fret: number }[] }[]
): TriadGroupingShape[] => {
  const boardRect = board.getBoundingClientRect();
  if (boardRect.width === 0 || boardRect.height === 0) return [];

  return triadGroupings
    .map((group) => {
      const points = group.positions
        .map(({ string, fret }) => {
          const cell = board.querySelector(
            `[data-string="${string}"][data-fret="${fret}"]`
          );
          if (!cell) return null;
          const rect = cell.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - boardRect.left,
            y: rect.top + rect.height / 2 - boardRect.top,
          };
        })
        .filter((point): point is Point => point !== null);

      if (points.length !== group.positions.length) return null;

      return { key: group.id, ...buildGroupCircle(points) };
    })
    .filter((shape): shape is TriadGroupingShape => shape !== null);
};
