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
export type TriadStringSetId = 'all' | 'low-ead' | 'dgb' | 'gbe';

export const TRIAD_STRING_SETS: {
  id: TriadStringSetId;
  label: string;
  strings: number[];
}[] = [
  { id: 'all', label: 'All strings', strings: [0, 1, 2, 3, 4, 5] },
  { id: 'low-ead', label: 'Low E, A, D', strings: [0, 1, 2] },
  { id: 'dgb', label: 'D, G, B', strings: [2, 3, 4] },
  { id: 'gbe', label: 'G, B, High E', strings: [3, 4, 5] },
];
