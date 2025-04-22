export interface FretRange {
  id: string;           // Unique identifier
  name: string;         // Display name (e.g., "Open Position")
  minFret: number;      // Minimum fret
  maxFret: number;      // Maximum fret
  description?: string; // Optional description
  difficulty: string;   // "beginner", "intermediate", or "advanced"
}

export const FRET_RANGES: FretRange[] = [
  // Beginner ranges
  {
    id: "open-position",
    name: "Open Position",
    minFret: 0,
    maxFret: 3,
    description: "The first position on the neck, including open strings",
    difficulty: "beginner"
  },
  {
    id: "first-position",
    name: "First Position",
    minFret: 1,
    maxFret: 4,
    description: "The standard first position without open strings",
    difficulty: "beginner"
  },
  {
    id: "second-position",
    name: "Second Position",
    minFret: 2,
    maxFret: 5,
    description: "Second position on the neck",
    difficulty: "beginner"
  },
  
  // Intermediate ranges
  {
    id: "third-position",
    name: "Third Position",
    minFret: 3,
    maxFret: 6,
    description: "Third position on the neck",
    difficulty: "intermediate"
  },
  {
    id: "fifth-position",
    name: "Fifth Position",
    minFret: 5,
    maxFret: 8,
    description: "Fifth position on the neck",
    difficulty: "intermediate"
  },
  {
    id: "middle-neck",
    name: "Middle Neck",
    minFret: 4,
    maxFret: 9,
    description: "Middle part of the neck",
    difficulty: "intermediate"
  },
  
  // Advanced ranges
  {
    id: "seventh-position",
    name: "Seventh Position",
    minFret: 7,
    maxFret: 10,
    description: "Seventh position on the neck",
    difficulty: "advanced"
  },
  {
    id: "ninth-position",
    name: "Ninth Position",
    minFret: 9,
    maxFret: 12,
    description: "Ninth position on the neck",
    difficulty: "advanced"
  },
  {
    id: "higher-position",
    name: "Higher Position",
    minFret: 12,
    maxFret: 15,
    description: "Higher position on the neck, near the cutaway",
    difficulty: "advanced"
  },
  {
    id: "full-neck",
    name: "Full Neck",
    minFret: 0,
    maxFret: 15,
    description: "The entire playable range of the neck",
    difficulty: "advanced"
  }
];

// Get fret ranges by difficulty level
export const BEGINNER_FRET_RANGES = FRET_RANGES.filter(fr => fr.difficulty === "beginner");
export const INTERMEDIATE_FRET_RANGES = FRET_RANGES.filter(fr => fr.difficulty === "intermediate");
export const ADVANCED_FRET_RANGES = FRET_RANGES.filter(fr => fr.difficulty === "advanced");

/**
 * Get a random fret range based on difficulty level
 */
export function getRandomFretRange(difficulty: string): FretRange {
  let availableFretRanges: FretRange[];
  
  switch(difficulty) {
    case "beginner":
      availableFretRanges = BEGINNER_FRET_RANGES;
      break;
    case "intermediate":
      // Intermediate players can play beginner and intermediate fret ranges
      availableFretRanges = [...BEGINNER_FRET_RANGES, ...INTERMEDIATE_FRET_RANGES];
      break;
    case "advanced":
      // Advanced players can play all fret ranges
      availableFretRanges = FRET_RANGES;
      break;
    default:
      availableFretRanges = BEGINNER_FRET_RANGES;
  }
  
  const randomIndex = Math.floor(Math.random() * availableFretRanges.length);
  return availableFretRanges[randomIndex];
}

/**
 * Get a custom fret range with a specified span
 * @param minFret Starting fret
 * @param span Number of frets to include
 */
export function getCustomFretRange(minFret: number, span: number = 4): FretRange {
  const maxFret = Math.min(minFret + span - 1, 24); // Most guitars don't go beyond 24 frets
  
  return {
    id: `custom-${minFret}-${maxFret}`,
    name: `Frets ${minFret}-${maxFret}`,
    minFret,
    maxFret,
    description: `Custom fret range from fret ${minFret} to ${maxFret}`,
    difficulty: minFret > 7 ? "advanced" : minFret > 3 ? "intermediate" : "beginner"
  };
} 