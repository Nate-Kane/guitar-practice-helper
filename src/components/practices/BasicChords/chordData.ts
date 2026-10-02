/** 0 = low E … 5 = high e (matches the rest of the app) */
export type Finger = 1 | 2 | 3 | 4;

export interface ChordNote {
  string: number;
  /** -1 = mute, 0 = open, 1+ = fret number */
  fret: number;
  finger?: Finger;
}

export interface Barre {
  fret: number;
  fromString: number;
  toString: number;
  finger: Finger;
}

export interface ChordShape {
  name: string;
  /** Top of diagram; 1 means the nut. Higher = movable shape. */
  baseFret?: number;
  notes: ChordNote[];
  barre?: Barre;
}

/** Same family as fretboard-mapper interval dots — high contrast, still on-app */
export const FINGER_COLORS: Record<Finger, string> = {
  1: '#6B7FD7', // index — mapper minor 3rd blue
  2: '#FF9340', // middle — mapper major 3rd orange
  3: '#2E9B4A', // ring — mapper root green
  4: '#8B0000', // pinky — brand red
};

export const FINGER_LABELS: Record<Finger, string> = {
  1: 'Index',
  2: 'Middle',
  3: 'Ring',
  4: 'Pinky',
};

/** Open-position shapes; C A G E D first, then common beginners’ chords. */
export const BASIC_CHORDS: ChordShape[] = [
  {
    name: 'C',
    notes: [
      { string: 0, fret: -1 },
      { string: 1, fret: 3, finger: 3 },
      { string: 2, fret: 2, finger: 2 },
      { string: 3, fret: 0 },
      { string: 4, fret: 1, finger: 1 },
      { string: 5, fret: 0 },
    ],
  },
  {
    name: 'A',
    notes: [
      { string: 0, fret: -1 },
      { string: 1, fret: 0 },
      { string: 2, fret: 2, finger: 2 },
      { string: 3, fret: 2, finger: 3 },
      { string: 4, fret: 2, finger: 4 },
      { string: 5, fret: 0 },
    ],
  },
  {
    name: 'G',
    notes: [
      { string: 0, fret: 3, finger: 2 },
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 3, finger: 3 },
      { string: 5, fret: 3, finger: 4 },
    ],
  },
  {
    name: 'E',
    notes: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 2, finger: 3 },
      { string: 3, fret: 1, finger: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
  },
  {
    name: 'D',
    notes: [
      { string: 0, fret: -1 },
      { string: 1, fret: -1 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2, finger: 1 },
      { string: 4, fret: 3, finger: 3 },
      { string: 5, fret: 2, finger: 2 },
    ],
  },
  {
    name: 'Am',
    notes: [
      { string: 0, fret: -1 },
      { string: 1, fret: 0 },
      { string: 2, fret: 2, finger: 2 },
      { string: 3, fret: 2, finger: 3 },
      { string: 4, fret: 1, finger: 1 },
      { string: 5, fret: 0 },
    ],
  },
  {
    name: 'Em',
    notes: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 2, finger: 3 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
  },
  {
    name: 'Dm',
    notes: [
      { string: 0, fret: -1 },
      { string: 1, fret: -1 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 3, finger: 3 },
      { string: 5, fret: 1, finger: 1 },
    ],
  },
  {
    name: 'Fmaj7',
    notes: [
      { string: 0, fret: -1 },
      { string: 1, fret: -1 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 1, finger: 1 },
      { string: 5, fret: 0 },
    ],
  },
];
