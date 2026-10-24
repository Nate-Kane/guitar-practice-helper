/**
 * Mandolin CAGED shapes, in G D A E tuning (string 0 = low G).
 *
 * Each shape is an open major chord with the nut replaced by a barre.
 * The anchor is one root of that open chord. Slide the anchor to another
 * root and the same grip spells the new chord.
 */

export type FretPosition = { string: number; fret: number };

type FindPositions = (note: string) => FretPosition[];

export type MandolinCagedShape = 'C' | 'A' | 'G' | 'E' | 'D';

type ShapeTemplate = {
  /** String the anchor root sits on. */
  anchorString: number;
  /** Lowest anchor fret that keeps every note on the fretboard. */
  minAnchorFret: number;
  /** Frets above the anchor the shape still needs. */
  spanAboveAnchor: number;
  /** Fret offset from the anchor, one entry per string, low G to high E. */
  deltas: readonly [number, number, number, number];
};

/**
 * Open-chord grips, written as offsets from the anchor root:
 * C anchors on the A string, A on the A string, G on the G string,
 * E on the high E string, D on the D string.
 */
const SHAPES: Record<MandolinCagedShape, ShapeTemplate> = {
  C: { anchorString: 2, minAnchorFret: 3, spanAboveAnchor: 0, deltas: [-3, -1, 0, -3] },
  A: { anchorString: 2, minAnchorFret: 0, spanAboveAnchor: 2, deltas: [2, 2, 0, 0] },
  G: { anchorString: 0, minAnchorFret: 0, spanAboveAnchor: 3, deltas: [0, 0, 2, 3] },
  E: { anchorString: 3, minAnchorFret: 0, spanAboveAnchor: 2, deltas: [1, 2, 2, 0] },
  D: { anchorString: 1, minAnchorFret: 0, spanAboveAnchor: 2, deltas: [2, 0, 0, 2] },
};

const positionsFor = (
  shape: MandolinCagedShape,
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const template = SHAPES[shape];
  const anchors = findAllPositionsOfNote(rootNote).filter(
    (position) =>
      position.string === template.anchorString &&
      position.fret >= template.minAnchorFret &&
      position.fret + template.spanAboveAnchor <= maxFret
  );

  return anchors.flatMap(({ fret }) =>
    template.deltas.map((delta, string) => ({ string, fret: fret + delta }))
  );
};

export const getMandolinCagedShapePositions = positionsFor;

export const getAllMandolinCagedPositions = (
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const seen = new Set<string>();
  const positions: FretPosition[] = [];

  for (const shape of ['C', 'A', 'G', 'E', 'D'] as const) {
    for (const position of positionsFor(shape, rootNote, findAllPositionsOfNote, maxFret)) {
      const key = positionKey(position);
      if (seen.has(key)) continue;
      seen.add(key);
      positions.push(position);
    }
  }

  return positions;
};

export const positionKey = (position: FretPosition): string =>
  `${position.string}:${position.fret}`;
