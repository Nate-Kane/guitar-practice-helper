import { TriadStringSetId } from './fretboardConstants';

export type TriadQuality = 'major' | 'minor';

/** Root (1), 3rd (3), or 5th (5) — on a string or as inversion label */
export type TriadInversion = 1 | 3 | 5;

type StringSetId = Exclude<TriadStringSetId, 'all'>;

export interface TriadShapeTemplate {
  inversion: TriadInversion;
  /** Chord tone on each string in the set, low string → high string */
  degrees: [TriadInversion, TriadInversion, TriadInversion];
  /** Fret offsets from the anchor on the lowest string of the set */
  fretOffsets: [number, number, number];
}

/**
 * Fixed close-position triad shapes per string set and quality.
 * Three shapes per set = root, 1st inversion, 2nd inversion.
 * Anchor = fret on the lowest string of the set; other frets = anchor + offset.
 */
export const TRIAD_SHAPE_TEMPLATES: Record<
  TriadQuality,
  Record<StringSetId, TriadShapeTemplate[]>
> = {
  major: {
    'low-ead': [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, -1, -3] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, -2, -2] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 0, -1] },
    ],
    agd: [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, -1, -3] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, -2, -2] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 0, -1] },
    ],
    dgb: [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, -1, -2] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, -2, -1] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 0, 0] },
    ],
    gbe: [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, 0, -2] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, -1, -1] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 1, 0] },
    ],
  },
  minor: {
    'low-ead': [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, -2, -3] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, -1, -1] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 0, -2] },
    ],
    agd: [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, -2, -3] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, -1, -1] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 0, -2] },
    ],
    dgb: [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, -2, -2] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, -1, 0] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 0, -1] },
    ],
    gbe: [
      { inversion: 1, degrees: [1, 3, 5], fretOffsets: [0, -1, -2] },
      { inversion: 3, degrees: [3, 5, 1], fretOffsets: [0, 0, 0] },
      { inversion: 5, degrees: [5, 1, 3], fretOffsets: [0, 1, -1] },
    ],
  },
};

export const TRIAD_SHAPE_OCTAVE = 12;
