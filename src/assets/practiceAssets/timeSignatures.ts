export interface TimeSignature {
  id: string;           // Unique identifier
  name: string;         // Display name (e.g., "4/4")
  upper: number;        // Upper numeral (beats per measure)
  lower: number;        // Lower numeral (beat unit)
  description?: string; // Optional description
  difficulty: string;   // "basics", "intermediate", or "advanced"
  commonIn?: string[];  // Music styles where this time signature is common
}

export const TIME_SIGNATURES: TimeSignature[] = [
  // basics time signatures
  {
    id: "4-4",
    name: "4/4",
    upper: 4,
    lower: 4,
    description: "Common time. Four quarter notes per measure.",
    difficulty: "basics",
    commonIn: ["rock", "pop", "jazz", "blues", "folk"]
  },
  {
    id: "3-4",
    name: "3/4",
    upper: 3,
    lower: 4,
    description: "Waltz time. Three quarter notes per measure.",
    difficulty: "basics",
    commonIn: ["classical", "folk", "country"]
  },
  
  // Intermediate time signatures
  {
    id: "6-8",
    name: "6/8",
    upper: 6,
    lower: 8,
    description: "Compound duple meter. Six eighth notes per measure, often grouped as two dotted quarter notes.",
    difficulty: "intermediate",
    commonIn: ["rock ballads", "folk", "classical"]
  },
  {
    id: "2-4",
    name: "2/4",
    upper: 2,
    lower: 4,
    description: "Simple duple meter. Two quarter notes per measure.",
    difficulty: "intermediate",
    commonIn: ["marches", "polkas"]
  },
  {
    id: "2-2",
    name: "2/2",
    upper: 2,
    lower: 2,
    description: "Cut time. Two half notes per measure, often used for faster tempos.",
    difficulty: "intermediate",
    commonIn: ["marches", "rock", "classical"]
  },
  
  // Advanced time signatures
  {
    id: "5-4",
    name: "5/4",
    upper: 5,
    lower: 4,
    description: "Five quarter notes per measure, often grouped as 3+2 or 2+3.",
    difficulty: "advanced",
    commonIn: ["jazz", "progressive rock"]
  },
  {
    id: "7-8",
    name: "7/8",
    upper: 7,
    lower: 8,
    description: "Seven eighth notes per measure, often grouped as 2+2+3, 3+2+2, or 2+3+2.",
    difficulty: "advanced",
    commonIn: ["progressive rock", "balkan folk"]
  },
  {
    id: "9-8",
    name: "9/8",
    upper: 9,
    lower: 8,
    description: "Nine eighth notes per measure, often grouped as 3+3+3.",
    difficulty: "advanced",
    commonIn: ["progressive rock", "classical"]
  },
  {
    id: "12-8",
    name: "12/8",
    upper: 12,
    lower: 8,
    description: "Twelve eighth notes per measure, often grouped as 3+3+3+3. Common in slow blues.",
    difficulty: "advanced",
    commonIn: ["blues", "rock ballads"]
  }
];

// Get time signatures by difficulty level
export const basics_TIME_SIGNATURES = TIME_SIGNATURES.filter(ts => ts.difficulty === "basics");
export const INTERMEDIATE_TIME_SIGNATURES = TIME_SIGNATURES.filter(ts => ts.difficulty === "intermediate");
export const ADVANCED_TIME_SIGNATURES = TIME_SIGNATURES.filter(ts => ts.difficulty === "advanced");

/**
 * Get a random time signature based on difficulty level
 */
export function getRandomTimeSignature(difficulty: string): TimeSignature {
  let availableTimeSignatures: TimeSignature[];
  
  switch(difficulty) {
    case "basics":
      availableTimeSignatures = basics_TIME_SIGNATURES;
      break;
    case "intermediate":
      // Intermediate players can play basics and intermediate time signatures
      availableTimeSignatures = [...basics_TIME_SIGNATURES, ...INTERMEDIATE_TIME_SIGNATURES];
      break;
    case "advanced":
      // Advanced players can play all time signatures
      availableTimeSignatures = TIME_SIGNATURES;
      break;
    default:
      availableTimeSignatures = basics_TIME_SIGNATURES;
  }
  
  const randomIndex = Math.floor(Math.random() * availableTimeSignatures.length);
  return availableTimeSignatures[randomIndex];
}
