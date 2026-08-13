/**
 * CAGED shape templates as relative fret offsets from an anchor root.
 * String index: 0 = low E … 5 = high e (matches useMapFretboard).
 */

export type FretPosition = { string: number; fret: number };

type FindPositions = (note: string) => FretPosition[];

/** Shapes 1 & 2 both anchor on the A-string root */
const A_STRING = 1;

/** Shape 1 (C): needs x - 3 >= 0 so open strings stay valid */
const C_SHAPE_MIN_ANCHOR_FRET = 3;

/**
 * C-shape (shape 1) — A-string root at fret x:
 * - A: Root @ x
 * - D: M3 @ x - 1
 * - G: P5 @ x - 3
 * - B: Root @ x - 2
 * - high E: M3 @ x - 3
 * - low E: not used
 */
export const getCShapePositions = (
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const anchors = findAllPositionsOfNote(rootNote).filter(
    (position) =>
      position.string === A_STRING &&
      position.fret >= C_SHAPE_MIN_ANCHOR_FRET &&
      position.fret <= maxFret
  );

  return anchors.flatMap(({ fret: x }) => [
    { string: 1, fret: x },
    { string: 2, fret: x - 1 },
    { string: 3, fret: x - 3 },
    { string: 4, fret: x - 2 },
    { string: 5, fret: x - 3 },
  ]);
};

/**
 * A-shape (shape 2) — A-string root at fret x:
 * - A: Root @ x
 * - D: P5 @ x + 2
 * - G: Root @ x + 2
 * - B: M3 @ x + 2
 * - high E: P5 @ x
 * - low E: not used
 */
export const getAShapePositions = (
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const anchors = findAllPositionsOfNote(rootNote).filter(
    (position) =>
      position.string === A_STRING &&
      position.fret >= 0 &&
      position.fret + 2 <= maxFret
  );

  return anchors.flatMap(({ fret: x }) => [
    { string: 1, fret: x },
    { string: 2, fret: x + 2 },
    { string: 3, fret: x + 2 },
    { string: 4, fret: x + 2 },
    { string: 5, fret: x },
  ]);
};

/** Shape 3 (G): low-E root at x; needs x - 3 >= 0 */
const LOW_E_STRING = 0;
const G_SHAPE_MIN_ANCHOR_FRET = 3;

/**
 * G-shape (shape 3) — low-E root at fret x:
 * - low E: Root @ x
 * - A: M3 @ x - 1
 * - D: P5 @ x - 3
 * - G: Root @ x - 3
 * - B: M3 @ x - 3
 * - high E: Root @ x
 * (B-string P5 at x is chord tone but not part of this shape)
 */
export const getGShapePositions = (
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const anchors = findAllPositionsOfNote(rootNote).filter(
    (position) =>
      position.string === LOW_E_STRING &&
      position.fret >= G_SHAPE_MIN_ANCHOR_FRET &&
      position.fret <= maxFret
  );

  return anchors.flatMap(({ fret: x }) => [
    { string: 0, fret: x },
    { string: 1, fret: x - 1 },
    { string: 2, fret: x - 3 },
    { string: 3, fret: x - 3 },
    { string: 4, fret: x - 3 },
    { string: 5, fret: x },
  ]);
};

/**
 * E-shape (shape 4) — low-E / high-E root at fret x (open E form moved up):
 * - low E: Root @ x
 * - A: P5 @ x + 2
 * - D: Root @ x + 2
 * - G: M3 @ x + 1
 * - B: P5 @ x
 * - high E: Root @ x
 */
export const getEShapePositions = (
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const anchors = findAllPositionsOfNote(rootNote).filter(
    (position) =>
      position.string === LOW_E_STRING &&
      position.fret >= 0 &&
      position.fret + 2 <= maxFret
  );

  return anchors.flatMap(({ fret: x }) => [
    { string: 0, fret: x },
    { string: 1, fret: x + 2 },
    { string: 2, fret: x + 2 },
    { string: 3, fret: x + 1 },
    { string: 4, fret: x },
    { string: 5, fret: x },
  ]);
};

/** Shape 5 (D): D-string root at x; needs x + 3 <= maxFret */
const D_STRING = 2;

/**
 * D-shape (shape 5) — D-string root at fret x (top four strings only):
 * - D: Root @ x
 * - G: P5 @ x + 2
 * - B: Root @ x + 3
 * - high E: M3 @ x + 2
 * - A / low E: not used
 */
export const getDShapePositions = (
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const anchors = findAllPositionsOfNote(rootNote).filter(
    (position) =>
      position.string === D_STRING &&
      position.fret >= 0 &&
      position.fret + 3 <= maxFret
  );

  return anchors.flatMap(({ fret: x }) => [
    { string: 2, fret: x },
    { string: 3, fret: x + 2 },
    { string: 4, fret: x + 3 },
    { string: 5, fret: x + 2 },
  ]);
};

/** Resolve fret positions for a CAGED shape number (1–5). */
export const getCagedShapePositions = (
  shape: number,
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] | null => {
  switch (shape) {
    case 1:
      return getCShapePositions(rootNote, findAllPositionsOfNote, maxFret);
    case 2:
      return getAShapePositions(rootNote, findAllPositionsOfNote, maxFret);
    case 3:
      return getGShapePositions(rootNote, findAllPositionsOfNote, maxFret);
    case 4:
      return getEShapePositions(rootNote, findAllPositionsOfNote, maxFret);
    case 5:
      return getDShapePositions(rootNote, findAllPositionsOfNote, maxFret);
    default:
      return null;
  }
};

/** Union of all five CAGED shape fingerings for a chord root. */
export const getAllCagedShapePositions = (
  rootNote: string,
  findAllPositionsOfNote: FindPositions,
  maxFret: number
): FretPosition[] => {
  const seen = new Set<string>();
  const positions: FretPosition[] = [];

  for (let shape = 1; shape <= 5; shape++) {
    const shapePositions = getCagedShapePositions(
      shape,
      rootNote,
      findAllPositionsOfNote,
      maxFret
    );
    if (!shapePositions) continue;

    for (const position of shapePositions) {
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
