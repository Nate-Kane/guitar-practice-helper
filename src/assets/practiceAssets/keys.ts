// Basic notes in Western music (using sharps)
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
  difficulty: string;  // "beginner", "intermediate", or "advanced"
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
    return "beginner";
  }
  
  // Keys with no or few accidentals
  if (["C", "G", "F"].includes(root) && quality === "major") {
    return "beginner";
  }
  
  if (["A", "E", "D"].includes(root) && quality === "minor") {
    return "beginner";
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
const FLAT_ALTERNATIVES: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb"
};

// Keys that are conventionally written with flats
const FLAT_KEYS = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb", "D", "G", "C"];

// Normalize key names to use conventional notation (using flats where appropriate)
function normalizeKeyName(key: Key): Key {
  // Skip if the root doesn't have a flat alternative
  if (!FLAT_ALTERNATIVES[key.root]) return key;
  
  // If it's a key that conventionally uses flats, rename it
  if (FLAT_KEYS.includes(key.root) || 
      (key.quality === "minor" && FLAT_KEYS.includes(ALL_NOTES[(ALL_NOTES.indexOf(key.root) + 3) % 12]))) {
    const flatRoot = FLAT_ALTERNATIVES[key.root];
    return {
      ...key,
      name: `${flatRoot} ${key.quality === "major" ? "Major" : "Minor"}`,
      root: flatRoot
    };
  }
  
  return key;
}

// Combine major and minor keys and normalize names
export const ALL_KEYS: Key[] = [...majorKeys, ...minorKeys]
  .map(normalizeKeyName)
  .filter(key => {
    // Remove theoretical keys that aren't commonly used
    const uncommonKeys = ["F#", "C#", "G#", "D#", "A#"].map(r => `${r} Major`).concat(
                        ["D#", "A#", "E#", "B#"].map(r => `${r} Minor`));
    return !uncommonKeys.includes(key.name);
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Common keys for reference
export const BEGINNER_KEYS = ALL_KEYS.filter(key => key.difficulty === "beginner");
export const INTERMEDIATE_KEYS = ALL_KEYS.filter(key => key.difficulty === "intermediate");
export const ADVANCED_KEYS = ALL_KEYS.filter(key => key.difficulty === "advanced");

// Get a random key based on difficulty
export function getRandomKey(difficulty: string): Key {
  let availableKeys: Key[];
  
  switch(difficulty) {
    case "beginner":
      availableKeys = BEGINNER_KEYS;
      break;
    case "intermediate":
      // Intermediate players can play beginner and intermediate keys
      availableKeys = [...BEGINNER_KEYS, ...INTERMEDIATE_KEYS];
      break;
    case "advanced":
      // Advanced players can play all keys
      availableKeys = ALL_KEYS;
      break;
    default:
      availableKeys = BEGINNER_KEYS;
  }
  
  const randomIndex = Math.floor(Math.random() * availableKeys.length);
  return availableKeys[randomIndex];
}
