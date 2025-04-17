export interface TempoRange {
  id: string;           // Unique identifier
  name: string;         // Name of this tempo range (e.g., "Moderate")
  minBPM: number;       // Minimum beats per minute
  maxBPM: number;       // Maximum beats per minute
  description?: string; // Optional description
  difficulty: string;   // "beginner", "intermediate", or "advanced"
}

// Traditional Italian tempo markings with BPM ranges
export const TEMPO_RANGES: TempoRange[] = [
  // Beginner tempo ranges (slower and more manageable)
  {
    id: "largo",
    name: "Largo",
    minBPM: 40,
    maxBPM: 60,
    description: "Very slow and broad",
    difficulty: "beginner"
  },
  {
    id: "adagio",
    name: "Adagio",
    minBPM: 66,
    maxBPM: 76,
    description: "Slow and stately",
    difficulty: "beginner"
  },
  {
    id: "andante",
    name: "Andante",
    minBPM: 76,
    maxBPM: 108,
    description: "At a walking pace",
    difficulty: "beginner"
  },
  
  // Intermediate tempo ranges
  {
    id: "moderato",
    name: "Moderato",
    minBPM: 108,
    maxBPM: 120,
    description: "Moderately",
    difficulty: "intermediate"
  },
  {
    id: "allegretto",
    name: "Allegretto",
    minBPM: 112,
    maxBPM: 120,
    description: "Moderately fast",
    difficulty: "intermediate"
  },
  {
    id: "allegro",
    name: "Allegro",
    minBPM: 120,
    maxBPM: 168,
    description: "Fast, quickly and bright",
    difficulty: "intermediate"
  },
  
  // Advanced tempo ranges (faster, requires more technical skill)
  {
    id: "vivace",
    name: "Vivace",
    minBPM: 140,
    maxBPM: 168,
    description: "Lively and fast",
    difficulty: "advanced"
  },
  {
    id: "presto",
    name: "Presto",
    minBPM: 168,
    maxBPM: 200,
    description: "Very fast",
    difficulty: "advanced"
  },
  {
    id: "prestissimo",
    name: "Prestissimo",
    minBPM: 200,
    maxBPM: 240,
    description: "Extremely fast",
    difficulty: "advanced"
  }
];

// Get tempo ranges by difficulty level
export const BEGINNER_TEMPO_RANGES = TEMPO_RANGES.filter(tr => tr.difficulty === "beginner");
export const INTERMEDIATE_TEMPO_RANGES = TEMPO_RANGES.filter(tr => tr.difficulty === "intermediate");
export const ADVANCED_TEMPO_RANGES = TEMPO_RANGES.filter(tr => tr.difficulty === "advanced");

/**
 * Get a random tempo range based on difficulty level
 */
export function getRandomTempoRange(difficulty: string): TempoRange {
  let availableTempoRanges: TempoRange[];
  
  switch(difficulty) {
    case "beginner":
      availableTempoRanges = BEGINNER_TEMPO_RANGES;
      break;
    case "intermediate":
      // Intermediate players can play beginner and intermediate tempo ranges
      availableTempoRanges = [...BEGINNER_TEMPO_RANGES, ...INTERMEDIATE_TEMPO_RANGES];
      break;
    case "advanced":
      // Advanced players can play all tempo ranges
      availableTempoRanges = TEMPO_RANGES;
      break;
    default:
      availableTempoRanges = BEGINNER_TEMPO_RANGES;
  }
  
  const randomIndex = Math.floor(Math.random() * availableTempoRanges.length);
  return availableTempoRanges[randomIndex];
}

/**
 * Get a random specific BPM within a tempo range
 */
export function getRandomBPM(tempoRange: TempoRange): number {
  const bpmSpread = tempoRange.maxBPM - tempoRange.minBPM;
  const randomOffset = Math.floor(Math.random() * bpmSpread);
  return tempoRange.minBPM + randomOffset;
}

/**
 * Get a random BPM appropriate for a given difficulty level
 */
export function getRandomBPMForDifficulty(difficulty: string): {
  bpm: number;
  name: string;
  description?: string;
} {
  const tempoRange = getRandomTempoRange(difficulty);
  const bpm = getRandomBPM(tempoRange);
  
  return {
    bpm,
    name: tempoRange.name,
    description: tempoRange.description
  };
}
