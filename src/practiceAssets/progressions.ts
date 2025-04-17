export interface ChordProgression {
  id: string;                // Unique identifier
  name: string;              // Human readable name (e.g., "1-4-5")
  description?: string;      // Optional description of the progression
  nashville: string[];       // Nashville number system notation (e.g., ["I", "IV", "V"])
  difficulty: string;        // "beginner", "intermediate", or "advanced"
  commonIn?: string[];       // Music styles where this progression is common
}

// Basic chord numerals for reference
export const CHORD_NUMERALS = {
  major: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
  minor: ["i", "ii°", "III", "iv", "v", "VI", "VII"]
};

export const CHORD_PROGRESSIONS: ChordProgression[] = [
  // Beginner progressions
  {
    id: "1-4-5",
    name: "1-4-5",
    description: "The classic three-chord progression used in countless songs",
    nashville: ["I", "IV", "V"],
    difficulty: "beginner",
    commonIn: ["rock", "folk", "country", "blues"]
  },
  {
    id: "1-5-6-4",
    name: "1-5-6-4",
    description: "The 'pop punk' progression, used in many hit songs",
    nashville: ["I", "V", "vi", "IV"],
    difficulty: "beginner",
    commonIn: ["pop", "rock", "punk"]
  },
  {
    id: "1-6-4-5",
    name: "1-6-4-5",
    description: "The '50s progression', popular in doo-wop and early rock",
    nashville: ["I", "vi", "IV", "V"],
    difficulty: "beginner",
    commonIn: ["rock", "pop", "doo-wop"]
  },
  {
    id: "2-5-1",
    name: "2-5-1",
    description: "The jazz fundamental progression",
    nashville: ["ii", "V", "I"],
    difficulty: "beginner",
    commonIn: ["jazz", "bossa nova"]
  },
  {
    id: "6-4-1-5",
    name: "6-4-1-5",
    description: "Emotional progression often used in ballads",
    nashville: ["vi", "IV", "I", "V"],
    difficulty: "beginner",
    commonIn: ["pop", "rock", "ballads"]
  },
  
  // Intermediate progressions
  {
    id: "circle-of-fifths",
    name: "Circle of Fifths",
    description: "Progression moving through the circle of fifths",
    nashville: ["vi", "ii", "V", "I"],
    difficulty: "intermediate",
    commonIn: ["jazz", "classical", "pop"]
  },
  {
    id: "andalusian-cadence",
    name: "Andalusian Cadence",
    description: "Descending progression from Spanish/Flamenco music",
    nashville: ["i", "VII", "VI", "V"],
    difficulty: "intermediate",
    commonIn: ["flamenco", "rock", "classical"]
  },
  {
    id: "blues-1-4-1-5-4-1",
    name: "12-Bar Blues",
    description: "Classic blues progression",
    nashville: ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"],
    difficulty: "intermediate",
    commonIn: ["blues", "rock", "jazz"]
  },
  {
    id: "mixolydian-vamp",
    name: "Mixolydian Vamp",
    description: "Simple two-chord vamp using the flat VII",
    nashville: ["I", "bVII"],
    difficulty: "intermediate",
    commonIn: ["rock", "folk", "celtic"]
  },
  
  // Advanced progressions
  {
    id: "rhythm-changes",
    name: "Rhythm Changes",
    description: "Jazz progression based on Gershwin's 'I Got Rhythm'",
    nashville: ["I", "vi", "ii", "V", "I", "VI7", "ii", "V"],
    difficulty: "advanced",
    commonIn: ["jazz", "bebop"]
  },
  {
    id: "coltrane-changes",
    name: "Coltrane Changes",
    description: "Substitution progression popularized by John Coltrane",
    nashville: ["I", "bIII7", "V7", "bVII7", "bIII7", "I"],
    difficulty: "advanced",
    commonIn: ["jazz"]
  },
  {
    id: "modal-interchange",
    name: "Modal Interchange",
    description: "Progression using chords borrowed from parallel modes",
    nashville: ["I", "bVI", "bVII", "I"],
    difficulty: "advanced",
    commonIn: ["rock", "metal", "fusion"]
  },
  {
    id: "augmented-progression",
    name: "Augmented Progression",
    description: "Using augmented chords for a dreamlike quality",
    nashville: ["I", "I+", "IV", "iv"],
    difficulty: "advanced",
    commonIn: ["jazz", "dream pop", "psychedelic"]
  }
];

// Get progressions by difficulty level
export const BEGINNER_PROGRESSIONS = CHORD_PROGRESSIONS.filter(p => p.difficulty === "beginner");
export const INTERMEDIATE_PROGRESSIONS = CHORD_PROGRESSIONS.filter(p => p.difficulty === "intermediate");
export const ADVANCED_PROGRESSIONS = CHORD_PROGRESSIONS.filter(p => p.difficulty === "advanced");

/**
 * Get a random chord progression based on difficulty level
 */
export function getRandomProgression(difficulty: string): ChordProgression {
  let availableProgressions: ChordProgression[];
  
  switch(difficulty) {
    case "beginner":
      availableProgressions = BEGINNER_PROGRESSIONS;
      break;
    case "intermediate":
      // Intermediate players can play beginner and intermediate progressions
      availableProgressions = [...BEGINNER_PROGRESSIONS, ...INTERMEDIATE_PROGRESSIONS];
      break;
    case "advanced":
      // Advanced players can play all progressions
      availableProgressions = CHORD_PROGRESSIONS;
      break;
    default:
      availableProgressions = BEGINNER_PROGRESSIONS;
  }
  
  const randomIndex = Math.floor(Math.random() * availableProgressions.length);
  return availableProgressions[randomIndex];
}

/**
 * Translate a Nashville numeral to an actual chord in a given key
 * @param numeral The Nashville numeral (e.g., "I", "vi", "V7")
 * @param key The key object containing root and quality
 * @returns The chord name (e.g., "C", "Am", "G7")
 */
export function nashvilleToChord(numeral: string, keyRoot: string, keyQuality: string): string {
  // Extract base numeral and any extensions
  const match = numeral.match(/^(b*)(i+|I+|iv|IV|v|V|vi|VI|vii|VII)°?(\+)?(7|maj7|m7|dim7|aug7|sus4|add9|sus2)?$/);
  if (!match) return numeral; // Return original if not a valid numeral
  
  const [_, flat, baseNumeral, augmented, extension] = match;
  
  // Determine if major or minor numeral
  const isMajorNumeral = baseNumeral.toUpperCase() === baseNumeral;
  
  // Find the degree (0-6)
  const getNumeralDegree = (num: string): number => {
    const lowercaseNum = num.toLowerCase();
    if (lowercaseNum === 'i') return 0;
    if (lowercaseNum === 'ii') return 1;
    if (lowercaseNum === 'iii') return 2;
    if (lowercaseNum === 'iv') return 3;
    if (lowercaseNum === 'v') return 4;
    if (lowercaseNum === 'vi') return 5;
    if (lowercaseNum === 'vii') return 6;
    return 0;
  };
  
  const degree = getNumeralDegree(baseNumeral);
  
  // Get notes of the key
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10];
  
  const allNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const withFlats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  
  const rootIndex = allNotes.indexOf(keyRoot) !== -1 
    ? allNotes.indexOf(keyRoot) 
    : withFlats.indexOf(keyRoot);
  
  const intervals = keyQuality === "major" ? majorIntervals : minorIntervals;
  const noteIndex = (rootIndex + intervals[degree]) % 12;
  
  // Apply flat if present
  const finalNoteIndex = (noteIndex - flat.length + 12) % 12;
  const note = allNotes[finalNoteIndex];
  
  // Determine chord quality
  let chordType = "";
  
  // In major key
  if (keyQuality === "major") {
    // Major chords: I, IV, V
    if ((degree === 0 || degree === 3 || degree === 4) && isMajorNumeral) {
      chordType = augmented ? "aug" : "";
    } 
    // Minor chords: ii, iii, vi
    else if ((degree === 1 || degree === 2 || degree === 5) && !isMajorNumeral) {
      chordType = "m";
    }
    // Diminished chord: vii°
    else if (degree === 6 && !isMajorNumeral) {
      chordType = numeral.includes("°") ? "dim" : "m";
    }
    // If it doesn't match the pattern, default based on the case
    else {
      chordType = isMajorNumeral ? "" : "m";
    }
  } 
  // In minor key
  else {
    // Minor chords: i, iv, v
    if ((degree === 0 || degree === 3 || degree === 4) && !isMajorNumeral) {
      chordType = "m";
    }
    // Major chords: III, VI, VII
    else if ((degree === 2 || degree === 5 || degree === 6) && isMajorNumeral) {
      chordType = "";
    }
    // Diminished chord: ii°
    else if (degree === 1 && !isMajorNumeral) {
      chordType = numeral.includes("°") ? "dim" : "m";
    }
    // Default based on case
    else {
      chordType = isMajorNumeral ? "" : "m";
    }
  }
  
  // Add the extension if any
  if (extension) {
    chordType += extension;
  }
  
  return note + chordType;
}

/**
 * Convert a Nashville progression to actual chords in a given key
 */
export function progressionToChords(progression: string[], keyRoot: string, keyQuality: string): string[] {
  return progression.map(numeral => nashvilleToChord(numeral, keyRoot, keyQuality));
}
