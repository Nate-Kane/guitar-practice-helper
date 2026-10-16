// basics notes in Western music (using sharps)
const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Intervals for major scale (in semitones)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// Intervals for natural minor scale (in semitones)
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

export interface Key {
  name: string;        // E.g., "C Major"
  root: string;        // E.g., "C"
  quality: string;     // "major" or "minor"
  notes: string[];     // E.g., ["C", "D", "E", "F", "G", "A", "B"]
  relativeKey: string; // E.g., "A Minor" (for C Major)
  difficulty: string;  // "basics", "intermediate", or "advanced"
}

/**
 * Generate notes for a scale based on root note and intervals
 */
function generateScaleNotes(rootNote: string, intervals: number[]): string[] {
  const rootIndex = ALL_NOTES.indexOf(rootNote);
  if (rootIndex === -1) throw new Error(`Invalid root note: ${rootNote}`);

  return intervals.map(interval => ALL_NOTES[(rootIndex + interval) % 12]);
}

/**
 * Determine the difficulty of a key based on number of accidentals
 * and guitar-friendliness
 */
function getDifficulty(root: string, quality: string): string {
  // Guitar-friendly keys regardless of accidentals
  if (["E", "A", "D", "G"].includes(root) && quality === "major") {
    return "basics";
  }
  
  // Keys with no or few accidentals
  if (["C", "G", "F"].includes(root) && quality === "major") {
    return "basics";
  }
  
  if (["A", "E", "D"].includes(root) && quality === "minor") {
    return "basics";
  }
  
  // Keys with moderate accidentals
  if (["D", "A", "Bb", "Eb"].includes(root) && quality === "major") {
    return "intermediate";
  }
  
  if (["B", "F#", "G", "C"].includes(root) && quality === "minor") {
    return "intermediate";
  }
  
  // All other keys are considered advanced
  return "advanced";
}

// Generate all major keys
const majorKeys: Key[] = ALL_NOTES.map(root => {
  const notes = generateScaleNotes(root, MAJOR_SCALE_INTERVALS);
  // Relative minor is 3 semitones down (or 9 up)
  const relativeMinorRoot = ALL_NOTES[(ALL_NOTES.indexOf(root) + 9) % 12];
  
  return {
    name: `${root} Major`,
    root,
    quality: "major",
    notes,
    relativeKey: `${relativeMinorRoot} Minor`,
    difficulty: getDifficulty(root, "major")
  };
});

// Generate all minor keys
const minorKeys: Key[] = ALL_NOTES.map(root => {
  const notes = generateScaleNotes(root, MINOR_SCALE_INTERVALS);
  // Relative major is 3 semitones up (or 9 down)
  const relativeMajorRoot = ALL_NOTES[(ALL_NOTES.indexOf(root) + 3) % 12];
  
  return {
    name: `${root} Minor`,
    root,
    quality: "minor",
    notes,
    relativeKey: `${relativeMajorRoot} Major`,
    difficulty: getDifficulty(root, "minor")
  };
});

// Alternative note names (for flats)
// const FLAT_ALTERNATIVES: Record<string, string> = {
//   "C#": "Db",
//   "D#": "Eb",
//   "F#": "Gb",
//   "G#": "Ab",
//   "A#": "Bb"
// };

// // Keys that are conventionally written with flats
// const FLAT_KEYS = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb", "D", "G", "C"];

// // Normalize key names to use conventional notation (using flats where appropriate)
// function normalizeKeyName(key: Key): Key {
//   // Skip if the root doesn't have a flat alternative
//   if (!FLAT_ALTERNATIVES[key.root]) return key;
  
//   // If it's a key that conventionally uses flats, rename it
//   if (FLAT_KEYS.includes(key.root) || 
//       (key.quality === "minor" && FLAT_KEYS.includes(ALL_NOTES[(ALL_NOTES.indexOf(key.root) + 3) % 12]))) {
//     const flatRoot = FLAT_ALTERNATIVES[key.root];
//     return {
//       ...key,
//       name: `${flatRoot} ${key.quality === "major" ? "Major" : "Minor"}`,
//       root: flatRoot
//     };
//   }
  
//   return key;
// }

// Combine major and minor keys and normalize names
export const ALL_KEYS: Key[] = [...majorKeys, ...minorKeys]
  .sort((a, b) => a.name.localeCompare(b.name));

// Common keys for reference
export const basics_KEYS = ALL_KEYS.filter(key => key.difficulty === "basics");
export const INTERMEDIATE_KEYS = ALL_KEYS.filter(key => key.difficulty === "intermediate");
export const ADVANCED_KEYS = ALL_KEYS.filter(key => key.difficulty === "advanced");

export function getRandomKey(): Key {
  const randomIndex = Math.floor(Math.random() * ALL_KEYS.length);
  return ALL_KEYS[randomIndex];
}

export type Accidental = 'natural' | 'sharp' | 'flat';

export type ScaleViewId = 'major' | 'majorPentatonic' | 'minor' | 'minorPentatonic';

export const NATURAL_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

const LETTER_PITCH: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const FLAT_CHROMATIC = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const SHARP_NAME: Record<string, string> = {
  C: 'C#',
  D: 'D#',
  F: 'F#',
  G: 'G#',
  A: 'A#',
};

const FLAT_NAME: Record<string, string> = {
  D: 'C#',
  E: 'D#',
  G: 'F#',
  A: 'G#',
  B: 'A#',
};

const CANONICAL_SHARP_LETTER: Record<string, string> = {
  'C#': 'C',
  'D#': 'D',
  'F#': 'F',
  'G#': 'G',
  'A#': 'A',
};

export interface ScaleDegree {
  semitones: number;
  letterOffset: number;
}

export const SCALE_DEGREES: Record<ScaleViewId, ScaleDegree[]> = {
  major: [
    { semitones: 0, letterOffset: 0 },
    { semitones: 2, letterOffset: 1 },
    { semitones: 4, letterOffset: 2 },
    { semitones: 5, letterOffset: 3 },
    { semitones: 7, letterOffset: 4 },
    { semitones: 9, letterOffset: 5 },
    { semitones: 11, letterOffset: 6 },
  ],
  majorPentatonic: [
    { semitones: 0, letterOffset: 0 },
    { semitones: 2, letterOffset: 1 },
    { semitones: 4, letterOffset: 2 },
    { semitones: 7, letterOffset: 4 },
    { semitones: 9, letterOffset: 5 },
  ],
  minor: [
    { semitones: 0, letterOffset: 0 },
    { semitones: 2, letterOffset: 1 },
    { semitones: 3, letterOffset: 2 },
    { semitones: 5, letterOffset: 3 },
    { semitones: 7, letterOffset: 4 },
    { semitones: 8, letterOffset: 5 },
    { semitones: 10, letterOffset: 6 },
  ],
  minorPentatonic: [
    { semitones: 0, letterOffset: 0 },
    { semitones: 3, letterOffset: 2 },
    { semitones: 5, letterOffset: 3 },
    { semitones: 7, letterOffset: 4 },
    { semitones: 10, letterOffset: 6 },
  ],
};

export const SCALE_VIEW_OPTIONS: { id: ScaleViewId; label: string }[] = [
  { id: 'major', label: 'Major' },
  { id: 'majorPentatonic', label: 'Major pentatonic' },
  { id: 'minor', label: 'Minor' },
  { id: 'minorPentatonic', label: 'Minor pentatonic' },
];

export const accidentalAvailable = (letter: string, accidental: Accidental): boolean => {
  if (accidental === 'natural') return NATURAL_LETTERS.includes(letter as (typeof NATURAL_LETTERS)[number]);
  if (accidental === 'sharp') return letter in SHARP_NAME;
  return letter in FLAT_NAME;
};

export const toCanonicalNote = (letter: string, accidental: Accidental): string => {
  if (accidental === 'sharp') return SHARP_NAME[letter] ?? letter;
  if (accidental === 'flat') return FLAT_NAME[letter] ?? letter;
  return letter;
};

export const selectionFromCanonical = (
  note: string
): { letter: string; accidental: Accidental } => {
  const sharpLetter = CANONICAL_SHARP_LETTER[note];
  if (sharpLetter) return { letter: sharpLetter, accidental: 'sharp' };
  return { letter: note, accidental: 'natural' };
};

export const qualityForScale = (scale: ScaleViewId): 'major' | 'minor' =>
  scale === 'minor' || scale === 'minorPentatonic' ? 'minor' : 'major';

export const alignScaleView = (
  scale: ScaleViewId,
  quality: 'major' | 'minor'
): ScaleViewId => {
  const pentatonic = scale === 'majorPentatonic' || scale === 'minorPentatonic';
  if (quality === 'minor') return pentatonic ? 'minorPentatonic' : 'minor';
  return pentatonic ? 'majorPentatonic' : 'major';
};

export const findKey = (canonicalRoot: string, quality: 'major' | 'minor'): Key | undefined =>
  ALL_KEYS.find((key) => key.root === canonicalRoot && key.quality === quality);

export const displayRoot = (letter: string, accidental: Accidental): string => {
  if (accidental === 'sharp') return `${letter}#`;
  if (accidental === 'flat') return `${letter}b`;
  return letter;
};

export const scaleViewLabel = (scale: ScaleViewId): string =>
  SCALE_VIEW_OPTIONS.find((option) => option.id === scale)?.label.toLowerCase() ?? 'major';

const pitchOf = (letter: string, accidental: Accidental): number => {
  const base = LETTER_PITCH[letter];
  if (accidental === 'sharp') return (base + 1) % 12;
  if (accidental === 'flat') return (base + 11) % 12;
  return base;
};

const spellOnLetter = (pitch: number, letter: string): string => {
  const diff = (pitch - LETTER_PITCH[letter] + 12) % 12;
  if (diff === 0) return letter;
  if (diff === 1) return `${letter}#`;
  if (diff === 11) return `${letter}b`;
  return ALL_NOTES[pitch];
};

export interface SpelledScaleNote {
  canonical: string;
  spelled: string;
  semitones: number;
}

export const spellScale = (
  letter: string,
  accidental: Accidental,
  scale: ScaleViewId
): SpelledScaleNote[] => {
  const rootPitch = pitchOf(letter, accidental);
  const rootIndex = NATURAL_LETTERS.indexOf(letter as (typeof NATURAL_LETTERS)[number]);

  return SCALE_DEGREES[scale].map((degree) => {
    const pitch = (rootPitch + degree.semitones) % 12;
    const degreeLetter = NATURAL_LETTERS[(rootIndex + degree.letterOffset) % 7];
    return {
      canonical: ALL_NOTES[pitch],
      spelled: spellOnLetter(pitch, degreeLetter),
      semitones: degree.semitones,
    };
  });
};

export const spellChromatic = (canonical: string, useFlats: boolean): string => {
  const index = ALL_NOTES.indexOf(canonical);
  if (index === -1) return canonical;
  return useFlats ? FLAT_CHROMATIC[index] : ALL_NOTES[index];
};

const spellingMap = (
  letter: string,
  accidental: Accidental,
  quality: 'major' | 'minor'
): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const note of spellScale(letter, accidental, quality === 'minor' ? 'minor' : 'major')) {
    map[note.canonical] = note.spelled;
  }
  ALL_NOTES.forEach((note, pitch) => {
    if (!map[note]) {
      map[note] = accidental === 'flat' ? FLAT_CHROMATIC[pitch] : note;
    }
  });
  return map;
};

/** Rewrite chord symbols (C#, Am, F#dim) with the key's spelling. */
export const respellChordSymbols = (
  chords: string[],
  letter: string,
  accidental: Accidental,
  quality: 'major' | 'minor'
): string[] => {
  const map = spellingMap(letter, accidental, quality);

  return chords.map((symbol) => {
    let spelled = '';
    for (let index = 0; index < symbol.length; index += 1) {
      const pair = symbol.slice(index, index + 2);
      if (map[pair]) {
        spelled += map[pair];
        index += 1;
        continue;
      }
      const single = symbol[index];
      if (map[single] && /[A-G]/.test(single)) {
        spelled += map[single];
        continue;
      }
      spelled += single;
    }
    return spelled;
  });
};
