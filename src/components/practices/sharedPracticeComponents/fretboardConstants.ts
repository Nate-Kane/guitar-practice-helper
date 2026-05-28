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

/** string index 0 = low E … 5 = high e (matches useMapFretboard) */
export const GUITAR_STRINGS = [
  { index: 0, label: 'E', displayName: 'Low E' },
  { index: 1, label: 'A', displayName: 'A' },
  { index: 2, label: 'D', displayName: 'D' },
  { index: 3, label: 'G', displayName: 'G' },
  { index: 4, label: 'B', displayName: 'B' },
  { index: 5, label: 'e', displayName: 'High E' },
] as const;

/** Fret labels on dark zinc cards (nut + fret numbers) */
export const MUTED_FRET_LABEL_COLOR = '#a8a29e';

/** Fret numbers + open-string letters on the main mapper (text only) */
export const DARK_ROSEWOOD_LABEL_TEXT = '#3d2a22';

/** Note letters on bright interval / root dots */
export const INTERVAL_MARKER_TEXT = '#27272a';

/** Perfect 5 — shared by interval legend and single-string mapper */
export const PERFECT_FIFTH_INTERVAL_COLOR = '#A8B5C4';
