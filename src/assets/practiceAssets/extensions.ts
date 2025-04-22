export interface ChordExtension {
  id: string;           // Unique identifier
  name: string;         // Display name (e.g., "7th")
  symbol: string;       // Symbol used in chord notation (e.g., "7")
  description?: string; // Optional description
  difficulty: string;   // "beginner", "intermediate", or "advanced"
}

export const CHORD_EXTENSIONS: ChordExtension[] = [
  // No extension (basic triad) - we'll include this as an option
  {
    id: "triad",
    name: "Triad",
    symbol: "",
    description: "Basic three-note chord with no extension",
    difficulty: "beginner"
  },
  
  // Beginner extensions
  {
    id: "7",
    name: "Dominant 7th",
    symbol: "7",
    description: "Adds a minor 7th above the root, creating tension",
    difficulty: "beginner"
  },
  {
    id: "sus4",
    name: "Suspended 4th",
    symbol: "sus4",
    description: "Replaces the 3rd with a 4th, creating an unresolved sound",
    difficulty: "beginner"
  },
  
  // Intermediate extensions
  {
    id: "maj7",
    name: "Major 7th",
    symbol: "maj7",
    description: "Adds a major 7th above the root for a jazzy, smooth sound",
    difficulty: "intermediate"
  },
  {
    id: "m7",
    name: "Minor 7th",
    symbol: "m7",
    description: "Minor chord with added minor 7th",
    difficulty: "intermediate"
  },
  {
    id: "add9",
    name: "Add 9",
    symbol: "add9",
    description: "Adds a 9th (2nd above the octave) without adding the 7th",
    difficulty: "intermediate"
  },
  {
    id: "6",
    name: "6th",
    symbol: "6",
    description: "Adds a major 6th above the root",
    difficulty: "intermediate"
  },
  
  // Advanced extensions
  {
    id: "9",
    name: "9th",
    symbol: "9",
    description: "Dominant 7th chord with added 9th",
    difficulty: "advanced"
  },
  {
    id: "m9",
    name: "Minor 9th",
    symbol: "m9",
    description: "Minor 7th chord with added 9th",
    difficulty: "advanced"
  },
  {
    id: "maj9",
    name: "Major 9th",
    symbol: "maj9",
    description: "Major 7th chord with added 9th",
    difficulty: "advanced"
  },
  {
    id: "13",
    name: "13th",
    symbol: "13",
    description: "Dominant chord with added 9th, 11th and 13th",
    difficulty: "advanced"
  },
  {
    id: "aug",
    name: "Augmented",
    symbol: "aug",
    description: "Major chord with a sharpened 5th",
    difficulty: "advanced"
  },
  {
    id: "dim7",
    name: "Diminished 7th",
    symbol: "dim7",
    description: "Diminished triad with a diminished 7th",
    difficulty: "advanced"
  }
];

// Get extensions by difficulty level
export const BEGINNER_EXTENSIONS = CHORD_EXTENSIONS.filter(ext => ext.difficulty === "beginner");
export const INTERMEDIATE_EXTENSIONS = CHORD_EXTENSIONS.filter(ext => ext.difficulty === "intermediate");
export const ADVANCED_EXTENSIONS = CHORD_EXTENSIONS.filter(ext => ext.difficulty === "advanced");

/**
 * Get a random chord extension based on difficulty level
 */
export function getRandomExtension(difficulty: string): ChordExtension {
  let availableExtensions: ChordExtension[];
  
  switch(difficulty) {
    case "beginner":
      availableExtensions = BEGINNER_EXTENSIONS;
      break;
    case "intermediate":
      // Intermediate players can play beginner and intermediate extensions
      availableExtensions = [...BEGINNER_EXTENSIONS, ...INTERMEDIATE_EXTENSIONS];
      break;
    case "advanced":
      // Advanced players can play all extensions
      availableExtensions = CHORD_EXTENSIONS;
      break;
    default:
      availableExtensions = BEGINNER_EXTENSIONS;
  }
  
  const randomIndex = Math.floor(Math.random() * availableExtensions.length);
  return availableExtensions[randomIndex];
}

/**
 * Apply a chord extension to a chord name
 * @param chordName The base chord name (e.g., "C", "Am")
 * @param extension The extension to apply
 * @returns The chord with extension applied (e.g., "Cmaj7", "Am7")
 */
export function applyExtension(chordName: string, extension: ChordExtension): string {
  // For no extension, return the chord as is
  if (extension.id === "triad") {
    return chordName;
  }
  
  // Handle special cases for minor, augmented, diminished chords
  if (chordName.endsWith('m') && extension.symbol.startsWith('m')) {
    // For minor chords with minor extensions, avoid duplicating 'm'
    // e.g., "Am" + "m7" should be "Am7" not "Amm7"
    return chordName + extension.symbol.substring(1);
  } else if ((chordName.endsWith('aug') || chordName.endsWith('dim')) && 
            (extension.id === 'aug' || extension.id === 'dim7')) {
    // Don't double up on aug or dim
    return chordName;
  } else {
    // Regular case
    return chordName + extension.symbol;
  }
}
