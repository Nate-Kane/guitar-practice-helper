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
    commonIn: ["rock", "folk", "country", "blues"]
  },
  {
    name: "1-5-6-4",
    description: "The 'pop punk' progression, used in many hit songs",
    nashvilleNums: ["1", "5", "6m", "4"],
    nashvilleRomanNums: ["I", "V", "vi", "IV"],
    difficulty: "beginner",
    commonIn: ["pop", "rock", "punk", "contemporary"]
  }
];

const MAJOR_PROGRESSIONS_INTERMEDIATE = [
  {
    name: "2-5-1",
    description: "The jazz fundamental progression, the backbone of jazz harmony",
    nashvilleNums: ["2m", "5", "1"],
    nashvilleRomanNums: ["ii", "V", "I"],
    difficulty: "intermediate",
    commonIn: ["jazz", "bossa nova", "fusion"]
  },
  {
    name: "Circle of Fifths",
    description: "Progression moving through the circle of fifths, creates a sense of motion",
    nashvilleNums: ["6m", "2m", "5", "1"],
    nashvilleRomanNums: ["vi", "ii", "V", "I"],
    difficulty: "intermediate",
    commonIn: ["jazz", "classical", "pop"]
  }
];

const MAJOR_PROGRESSIONS_ADVANCED = [
  {
    name: "Rhythm Changes",
    description: "Jazz progression based on Gershwin's 'I Got Rhythm'",
    nashvilleNums: ["1", "6m", "2m", "5", "1", "6", "2m", "5"],
    nashvilleRomanNums: ["I", "vi", "ii", "V", "I", "VI7", "ii", "V"],
    difficulty: "advanced",
    commonIn: ["jazz", "bebop"]
  },
  {
    name: "Modal Interchange",
    description: "Using chords borrowed from parallel modes for rich harmony",
    nashvilleNums: ["1", "b6", "b7", "1"],
    nashvilleRomanNums: ["I", "bVI", "bVII", "I"],
    difficulty: "advanced",
    commonIn: ["rock", "metal", "fusion", "jazz"]
  }
];

// For minor progressions, we explicitly mark the chord quality
const MINOR_PROGRESSIONS_BEGINNER = [
  {
    name: "Minor 1-4-5",
    description: "The classic three-chord progression in minor",
    nashvilleNums: ["1m", "4m", "5m"],  // Using 'm' suffix for minor
    nashvilleRomanNums: ["i", "iv", "v"],  // Lowercase numerals indicate minor
    difficulty: "beginner",
    commonIn: ["rock", "folk", "blues"]
  },
  {
    name: "1-6-7",
    description: "Common minor progression with a strong emotional impact",
    nashvilleNums: ["1m", "6", "7"],
    nashvilleRomanNums: ["i", "VI", "VII"],
    difficulty: "beginner",
    commonIn: ["pop", "ballads", "film music"]
  }
];

const MINOR_PROGRESSIONS_INTERMEDIATE = [
  {
    name: "Andalusian Cadence",
    description: "Descending progression from Spanish/Flamenco music",
    nashvilleNums: ["1m", "7", "6", "5"],
    nashvilleRomanNums: ["i", "VII", "VI", "V"],
    difficulty: "intermediate",
    commonIn: ["flamenco", "rock", "classical"]
  },
  {
    name: "Minor Line Cliché",
    description: "Creating tension with a descending chromatic line in the bass",
    nashvilleNums: ["1m", "1m/7", "1m/b7", "1m/6"],
    nashvilleRomanNums: ["i", "i/VII", "i/bVII", "i/VI"],
    difficulty: "intermediate",
    commonIn: ["jazz", "film scores", "ballads"]
  }
];

const MINOR_PROGRESSIONS_ADVANCED = [
  {
    name: "Minor with Diminished",
    description: "Using diminished chords for tension",
    nashvilleNums: ["1m", "6", "7dim", "1m"],
    nashvilleRomanNums: ["i", "VI", "vii°", "i"],
    difficulty: "advanced",
    commonIn: ["classical", "jazz", "film music"]
  },
  {
    name: "Harmonic Minor Cycle",
    description: "Utilizing the harmonic minor sound",
    nashvilleNums: ["1m", "4m", "5", "1m"],
    nashvilleRomanNums: ["i", "iv", "V", "i"],
    difficulty: "advanced",
    commonIn: ["neo-classical", "jazz", "metal"]
  }
];

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
    const regex = /^(b*)(\d+)(m|min|maj|dim|aug|sus4|sus2|\+|°)?(\/\w+)?$/;
    const match = nashvilleNum.match(regex);
    
    if (!match) return nashvilleNum; // Return as-is if not valid
    
    const [_, flat, degreeStr, quality, slash] = match;
    const degree = parseInt(degreeStr) - 1; // Convert to 0-based index
    
    // Calculate semitones based on scale degree
    const semitones = degree % 7 === 0 ? 0 : 
                     degree % 7 === 1 ? 2 : 
                     degree % 7 === 2 ? 4 : 
                     degree % 7 === 3 ? 5 : 
                     degree % 7 === 4 ? 7 : 
                     degree % 7 === 5 ? 9 : 11;
    
    // Calculate the note index, considering flats
    const noteIndex = (rootIndex + semitones) % 12;
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
    
    // Handle slash chords
    let chordName = note + chordQuality;
    if (slash) {
      // For slash chords, calculate the bass note
      const bassMatch = slash.match(/\/(\w+)/);
      if (bassMatch && bassMatch[1]) {
        const bassNote = bassMatch[1];
        chordName += '/' + bassNote;
      }
    }
    
    return chordName;
  });
}

export { getRandomProgression, progressionToChords };