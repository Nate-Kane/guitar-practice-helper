export interface ChordProgression {
  name: string;              // Human readable name (e.g., "the pop punk progression")
  description?: string;      // Optional description of the progression
  nashvilleNums: string[];    // nashville system but not in roman numerals. I.e, 1, 4, 5.
  nashvilleRomanNums: string[];       // Nashville roman number system notation (e.g., ["I", "IV", "V"])
  difficulty: string;        // "beginner", "intermediate", or "advanced"
  commonIn?: string[];       // Music styles where this progression is common
}

import { Key } from './keys';

const MAJOR_PROGRESSIONS_BEGINNER = [
  {
    name: "Major 1-4-5",
    description: "The classic three-chord progression",
    nashvilleNums: ["1", "4", "5"],
    nashvilleRomanNums: ["I", "IV", "V"],
    difficulty: "beginner",
    commonIn: ["rock", "folk", "country"]
  },
    // More progressions...
];

const MINOR_PROGRESSIONS_BEGINNER = [
  {
    name: "Minor 1-4-5",
    description: "The classic three-chord progression in minor",
    nashvilleNums: ["1m", "4m", "5m"],  // Using 'm' suffix for minor
    nashvilleRomanNums: ["i", "iv", "v"],  // Lowercase numerals indicate minor
    difficulty: "beginner",
    commonIn: ["rock", "folk", "blues"]
  },
  // More progressions...
];

// Placeholder for intermediate and advanced progressions
const MAJOR_PROGRESSIONS_INTERMEDIATE: ChordProgression[] = [];
const MAJOR_PROGRESSIONS_ADVANCED: ChordProgression[] = [];
const MINOR_PROGRESSIONS_INTERMEDIATE: ChordProgression[] = [];
const MINOR_PROGRESSIONS_ADVANCED: ChordProgression[] = [];

/**
 * Get a random chord progression based on key and skill level
 */
function getRandomProgression(key: Key | null, skillLevel: string = 'beginner'): ChordProgression | null {
  // If no key is provided, return null
  if (!key) return null;
  
  let availableProgressions: ChordProgression[] = [];
  
  // Select progressions based on key quality and skill level
  if (key.quality === 'major') {
    // For major keys
    switch(skillLevel) {
      case 'beginner':
        availableProgressions = [...MAJOR_PROGRESSIONS_BEGINNER];
        break;
      case 'intermediate':
        availableProgressions = [...MAJOR_PROGRESSIONS_BEGINNER, ...MAJOR_PROGRESSIONS_INTERMEDIATE];
        break;
      case 'advanced':
        availableProgressions = [...MAJOR_PROGRESSIONS_BEGINNER, ...MAJOR_PROGRESSIONS_INTERMEDIATE, ...MAJOR_PROGRESSIONS_ADVANCED];
        break;
      default:
        availableProgressions = [...MAJOR_PROGRESSIONS_BEGINNER];
    }
  } else {
    // For minor keys
    switch(skillLevel) {
      case 'beginner':
        availableProgressions = [...MINOR_PROGRESSIONS_BEGINNER];
        break;
      case 'intermediate':
        availableProgressions = [...MINOR_PROGRESSIONS_BEGINNER, ...MINOR_PROGRESSIONS_INTERMEDIATE];
        break;
      case 'advanced':
        availableProgressions = [...MINOR_PROGRESSIONS_BEGINNER, ...MINOR_PROGRESSIONS_INTERMEDIATE, ...MINOR_PROGRESSIONS_ADVANCED];
        break;
      default:
        availableProgressions = [...MINOR_PROGRESSIONS_BEGINNER];
    }
  }
  
  // Return a random progression from the available options
  if (availableProgressions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableProgressions.length);
  return availableProgressions[randomIndex];
}

/**
 * Convert a chord progression to actual chords in a given key
 */
function progressionToChords(progression: ChordProgression, key: Key): string[] {
  // Early return if progression is invalid
  if (!progression || !progression.nashvilleNums) return [];
  
  // Get all notes of the chromatic scale
  const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  // Get the index of the root note
  const rootIndex = ALL_NOTES.indexOf(key.root);
  if (rootIndex === -1) return []; // Invalid root note
  
  // Convert each Nashville number to an actual chord
  return progression.nashvilleNums.map(nashvilleNum => {
    // Parse the Nashville number to get the degree and quality
    const regex = /^(b*)(\d+)(m|min|maj|dim|aug|sus4|sus2|\+|°)?$/;
    const match = nashvilleNum.match(regex);
    
    if (!match) return nashvilleNum; // Return as-is if not valid
    
    const [_, flat, degreeStr, quality] = match;
    const degree = parseInt(degreeStr) - 1; // Convert to 0-based index
    
    // Calculate the note index, considering flats
    const noteIndex = (rootIndex + key.notes[degree % key.notes.length].charCodeAt(0) - 'C'.charCodeAt(0)) % 12;
    const finalNoteIndex = (noteIndex - flat.length + 12) % 12;
    const note = ALL_NOTES[finalNoteIndex];
    
    // Determine the chord quality
    let chordQuality = '';
    
    // Apply explicit quality from the Nashville number if present
    if (quality) {
      chordQuality = quality === 'm' || quality === 'min' ? 'm' : quality;
    } else {
      // If no explicit quality, use default based on key type
      if (key.quality === 'minor' && (degree === 0 || degree === 3 || degree === 4)) {
        chordQuality = 'm';
      }
      // For major key, major quality is implied for I, IV, V (0, 3, 4)
    }
    
    return note + chordQuality;
  });
}

export { getRandomProgression, progressionToChords };