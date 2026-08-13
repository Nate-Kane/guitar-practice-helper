export interface Point {
  x: number;
  y: number;
}

interface TriadGroupingShapeBase {
  key: string;
  cx: number;
  cy: number;
}

export interface TriadGroupingCircleShape extends TriadGroupingShapeBase {
  kind: 'circle';
  r: number;
}

export interface TriadGroupingEllipseShape extends TriadGroupingShapeBase {
  kind: 'ellipse';
  rx: number;
  ry: number;
  /** Degrees — tilts left edge up to match diagonal “staircase” voicings */
  rotation: number;
}

/** Wide voicings: higher strings sit on lower frets (staircase down to the right) */
export const WIDE_VOICING_ROTATION = 10;

export type TriadGroupingShape = TriadGroupingCircleShape | TriadGroupingEllipseShape;

/** Half of --note-marker-size (max ~28px) */
const NOTE_MARKER_RADIUS = 14;

/** Padding beyond the note bounding box */
const GROUP_SHAPE_PADDING = 14;

/** Minimum radius so tight stacks still read as a group */
const MIN_RADIUS = 34;

/** Minimum vertical half-axis for wide (sideways) ovals */
const MIN_WIDE_RY = 22;

/** Notes on 3+ frets → sideways oval; otherwise circle */
const isWideVoicing = (frets: number[]): boolean => {
  if (frets.length === 0) return false;
  return Math.max(...frets) - Math.min(...frets) >= 2;
};

export const buildGroupShape = (
  points: Point[],
  frets: number[]
): Omit<TriadGroupingCircleShape, 'key'> | Omit<TriadGroupingEllipseShape, 'key'> => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const pad = NOTE_MARKER_RADIUS + GROUP_SHAPE_PADDING;

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const halfWidth = (maxX - minX) / 2 + pad;
  const halfHeight = (maxY - minY) / 2 + pad;

  if (isWideVoicing(frets)) {
    return {
      kind: 'ellipse',
      cx,
      cy,
      rx: Math.max(halfWidth, MIN_RADIUS),
      ry: Math.max(halfHeight, MIN_WIDE_RY),
      rotation: WIDE_VOICING_ROTATION,
    };
  }

  return {
    kind: 'circle',
    cx,
    cy,
    r: Math.max(halfWidth, halfHeight, MIN_RADIUS),
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
      const frets = group.positions.map((p) => p.fret);
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

      return { key: group.id, ...buildGroupShape(points, frets) };
    })
    .filter((shape): shape is TriadGroupingShape => shape !== null);
};
