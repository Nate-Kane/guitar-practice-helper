import { ChordShape } from './chordData';

/**
 * Standard GDAE tuning. String 0 is the low G, then D, A, and high E.
 * Open shapes stay at the nut. B and Bm are movable shapes, so the
 * diagram starts at the fret printed on the left.
 */
export const MANDOLIN_BASIC_CHORDS: ChordShape[] = [
  {
    name: 'A',
    notes: [
      { string: 0, fret: 2, finger: 1 },
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
    ],
    barre: { fret: 2, fromString: 0, toString: 1, finger: 1 },
  },
  {
    name: 'Am',
    notes: [
      { string: 0, fret: 2, finger: 1 },
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 0 },
    ],
    barre: { fret: 2, fromString: 0, toString: 1, finger: 1 },
  },
  {
    name: 'B',
    baseFret: 4,
    notes: [
      { string: 0, fret: 4, finger: 1 },
      { string: 1, fret: 4, finger: 1 },
      { string: 2, fret: 6, finger: 3 },
      { string: 3, fret: 7, finger: 4 },
    ],
    barre: { fret: 4, fromString: 0, toString: 1, finger: 1 },
  },
  {
    name: 'Bm',
    baseFret: 4,
    notes: [
      { string: 0, fret: 4, finger: 1 },
      { string: 1, fret: 4, finger: 1 },
      { string: 2, fret: 5, finger: 2 },
      { string: 3, fret: 7, finger: 4 },
    ],
    barre: { fret: 4, fromString: 0, toString: 1, finger: 1 },
  },
  {
    name: 'C',
    notes: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 3, finger: 2 },
      { string: 3, fret: 0 },
    ],
  },
  {
    name: 'Cm',
    notes: [
      { string: 0, fret: 0 },
      { string: 1, fret: 1, finger: 1 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 3, finger: 3 },
    ],
    barre: { fret: 3, fromString: 2, toString: 3, finger: 3 },
  },
  {
    name: 'D',
    notes: [
      { string: 0, fret: 2, finger: 1 },
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2, finger: 2 },
    ],
  },
  {
    name: 'Dm',
    notes: [
      { string: 0, fret: 2, finger: 2 },
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1, finger: 1 },
    ],
  },
  {
    name: 'E',
    notes: [
      { string: 0, fret: 1, finger: 1 },
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 2, finger: 2 },
      { string: 3, fret: 0 },
    ],
    barre: { fret: 2, fromString: 1, toString: 2, finger: 2 },
  },
  {
    name: 'Em',
    notes: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 2, finger: 2 },
      { string: 3, fret: 0 },
    ],
  },
  {
    name: 'F',
    notes: [
      { string: 0, fret: 5, finger: 4 },
      { string: 1, fret: 3, finger: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1, finger: 1 },
    ],
  },
  {
    name: 'Fm',
    notes: [
      { string: 0, fret: 5, finger: 4 },
      { string: 1, fret: 3, finger: 1 },
      { string: 2, fret: 3, finger: 1 },
      { string: 3, fret: 4, finger: 2 },
    ],
    barre: { fret: 3, fromString: 1, toString: 2, finger: 1 },
  },
  {
    name: 'G',
    notes: [
      { string: 0, fret: 0 },
      { string: 1, fret: 0 },
      { string: 2, fret: 2, finger: 1 },
      { string: 3, fret: 3, finger: 2 },
    ],
  },
  {
    name: 'Gm',
    notes: [
      { string: 0, fret: 0 },
      { string: 1, fret: 0 },
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 3, finger: 3 },
    ],
  },
];
