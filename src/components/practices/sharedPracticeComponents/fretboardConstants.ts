/** Neutral note markers (string notes, triads) — not interval colors */
export const NEUTRAL_MARKER_COLOR = '#6b4a3a';
export const NEUTRAL_MARKER_BORDER = '#8a6a58';
export const NEUTRAL_MARKER_TEXT = '#e8dcc8';
export const NEUTRAL_MARKER_ROOT_COLOR = '#7a5c4a';

export const CHROMATIC_NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

/** One course, low string first. `openNote` is the pitch; `label` is the nut letter. */
export interface FretboardString {
  index: number;
  openNote: string;
  label: string;
  displayName: string;
}

/**
 * Enough to draw a neck: tuning, how many strings, and where the inlay dots sit.
 * Guitar stays the default so existing practices do not pass this.
 */
export interface FretboardInstrument {
  id: string;
  strings: readonly FretboardString[];
  /** String row that holds the fret-marker dots (0 = lowest string). */
  inlayStringIndex: number;
  singleDotFrets: readonly number[];
  doubleDotFrets: readonly number[];
}

/** string index 0 = low E … 5 = high e (matches useMapFretboard) */
export const GUITAR_STRINGS: readonly FretboardString[] = [
  { index: 0, openNote: 'E', label: 'E', displayName: 'Low E' },
  { index: 1, openNote: 'A', label: 'A', displayName: 'A' },
  { index: 2, openNote: 'D', label: 'D', displayName: 'D' },
  { index: 3, openNote: 'G', label: 'G', displayName: 'G' },
  { index: 4, openNote: 'B', label: 'B', displayName: 'B' },
  { index: 5, openNote: 'E', label: 'e', displayName: 'High E' },
];

export const GUITAR_INSTRUMENT: FretboardInstrument = {
  id: 'guitar',
  strings: GUITAR_STRINGS,
  inlayStringIndex: 2,
  singleDotFrets: [3, 5, 7, 9],
  doubleDotFrets: [12],
};

/** Standard mandolin: G D A E, low to high (same as a fiddle). */
export const MANDOLIN_STRINGS: readonly FretboardString[] = [
  { index: 0, openNote: 'G', label: 'G', displayName: 'G' },
  { index: 1, openNote: 'D', label: 'D', displayName: 'D' },
  { index: 2, openNote: 'A', label: 'A', displayName: 'A' },
  { index: 3, openNote: 'E', label: 'E', displayName: 'E' },
];

export const MANDOLIN_INSTRUMENT: FretboardInstrument = {
  id: 'mandolin',
  strings: MANDOLIN_STRINGS,
  inlayStringIndex: 1,
  singleDotFrets: [3, 5, 7, 10],
  doubleDotFrets: [12],
};

/** Fret labels on dark zinc cards (nut + fret numbers) */
export const MUTED_FRET_LABEL_COLOR = '#a8a29e';

/** Fret numbers + open-string letters on the main mapper (text only) */
export const DARK_ROSEWOOD_LABEL_TEXT = '#3d2a22';

/** Note letters on bright interval / root dots */
export const INTERVAL_MARKER_TEXT = '#27272a';

/** Interval dot colors (match main fretboard mapper) */
export const ROOT_INTERVAL_COLOR = '#2E9B4A';
export const MAJOR_THIRD_INTERVAL_COLOR = '#FF9340';
export const MINOR_THIRD_INTERVAL_COLOR = '#6B7FD7';

/** Perfect 5 — shared by interval legend and single-string mapper */
export const PERFECT_FIFTH_INTERVAL_COLOR = '#A8B5C4';

/** Section heading above fretboard on reference practices */
export const FRETBOARD_REFERENCE_HEADING =
  "Here's the interactive fretboard mapper to use as a reference";

/** Common triad string groups (string index 0 = low E … 5 = high e) */
export type TriadStringSetId = 'all' | 'low-ead' | 'agd' | 'dgb' | 'gbe';

export const TRIAD_STRING_SETS: {
  id: TriadStringSetId;
  label: string;
  strings: number[];
  /** Max fret distance between notes in one close-position voicing */
  maxFretSpan: number;
}[] = [
  { id: 'all', label: 'All strings', strings: [0, 1, 2, 3, 4, 5], maxFretSpan: 4 },
  { id: 'low-ead', label: 'Low E, A, D', strings: [0, 1, 2], maxFretSpan: 5 },
  { id: 'agd', label: 'A, D, G', strings: [1, 2, 3], maxFretSpan: 5 },
  { id: 'dgb', label: 'D, G, B', strings: [2, 3, 4], maxFretSpan: 4 },
  { id: 'gbe', label: 'G, B, High E', strings: [3, 4, 5], maxFretSpan: 5 },
];
