export interface ChordProgression {
  name: string; // Easily readable name (e.g., "the pop punk progression")
  description?: string;
  nashvilleNums: string[]; // nashville system but not in roman numerals. I.e, 1, 4, 5.
  nashvilleRomanNums: string[]; // Nashville roman number system notation (e.g., ["I", "IV", "V"])
  difficulty: string; // "basics", "intermediate", or "advanced"
  commonIn?: string[];
}

import { Key } from './keys';

const MAJOR_PROGRESSIONS_basics = [
  {
    name: "Major 1-4-5 Progression",
    description: "The classic three-chord progression",
    nashvilleNums: ["1", "4", "5"],
    nashvilleRomanNums: ["I", "IV", "V"],
    difficulty: "basics",
    commonIn: ["rock", "folk", "country", "blues"]
  },
  {
    name: "Pop Punk Progression",
    description: "The 'pop punk' progression, used in many hit songs",
    nashvilleNums: ["1", "5", "6m", "4"],
    nashvilleRomanNums: ["I", "V", "vi", "IV"],
    difficulty: "basics",
    commonIn: ["pop", "rock", "punk", "contemporary"]
  },
  {
    name: "50s Progression",
    description: "Classic doo-wop sequence used in countless hits from the 50s onwards",
    nashvilleNums: ["1", "6m", "4", "5"],
    nashvilleRomanNums: ["I", "vi", "IV", "V"],
    difficulty: "basics",
    commonIn: ["doo-wop", "pop", "rock", "ballads"]
  },
  {
    name: "Blues Progression",
    description: "Simple 12-bar blues structure, foundation of blues and rock",
    nashvilleNums: ["1", "1", "1", "1", "4", "4", "1", "1", "5", "4", "1", "5"],
    nashvilleRomanNums: ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"],
    difficulty: "basics",
    commonIn: ["blues", "rock", "country", "jazz"]
  },
  {
    name: "Simple Jazz Progression",
    description: "The jazz fundamental progression, the backbone of jazz harmony",
    nashvilleNums: ["2m", "5", "1"],
    nashvilleRomanNums: ["ii", "V", "I"],
    difficulty: "intermediate",
    commonIn: ["jazz", "bossa nova", "fusion"]
  },
  {
    name: "Unexpected Turn",
    description: "Takes a unexpected turn when the V chord moves to vi instead of I",
    nashvilleNums: ["1", "4", "5", "6m"],
    nashvilleRomanNums: ["I", "IV", "V", "vi"],
    difficulty: "intermediate",
    commonIn: ["pop", "rock", "film music", "classical"]
  }
];

const MAJOR_PROGRESSIONS_INTERMEDIATE = [
  {
    name: "Circle of Fifths Progression",
    description: "Progression moving through the circle of fifths, creates a sense of motion",
    nashvilleNums: ["6m", "2m", "5", "1"],
    nashvilleRomanNums: ["vi", "ii", "V", "I"],
    difficulty: "intermediate",
    commonIn: ["jazz", "classical", "pop"]
  }
];

const MAJOR_PROGRESSIONS_ADVANCED = [
  {
    name: "Rhythm Changes Progression",
    description: "Jazz progression based on Gershwin's 'I Got Rhythm'",
    nashvilleNums: ["1", "6m", "2m", "5", "1", "6", "2m", "5"],
    nashvilleRomanNums: ["I", "vi", "ii", "V", "I", "VI7", "ii", "V"],
    difficulty: "advanced",
    commonIn: ["jazz", "bebop"]
  },
  {
    name: "Modal Interchange Progression",
    description: "Using chords borrowed from parallel modes for rich harmony",
    nashvilleNums: ["1", "b6", "b7", "1"],
    nashvilleRomanNums: ["I", "bVI", "bVII", "I"],
    difficulty: "advanced",
    commonIn: ["rock", "metal", "fusion", "jazz"]
  }
];

// For minor progressions, we explicitly mark the chord quality
const MINOR_PROGRESSIONS_basics = [
  {
    name: "Minor 1-4-5 Progression",
    description: "The classic three-chord progression in minor",
    nashvilleNums: ["1m", "4m", "5m"],
    nashvilleRomanNums: ["i", "iv", "v"],
    difficulty: "basics",
    commonIn: ["rock", "folk", "blues"]
  },
  {
    name: "Ballad Progression",
    description: "Common minor progression with a strong emotional impact",
    nashvilleNums: ["1m", "6", "7"],
    nashvilleRomanNums: ["i", "VI", "VII"],
    difficulty: "basics",
    commonIn: ["pop", "ballads", "film music"]
  },
  {
    name: "Minor Pop Progression",
    description: "A simple, catchy progression commonly used in minor key pop songs",
    nashvilleNums: ["1m", "6", "7", "5"],
    nashvilleRomanNums: ["i", "VI", "VII", "v"],
    difficulty: "basics",
    commonIn: ["pop", "indie", "alternative", "rock"]
  },
  {
    name: "Dark Rock Progression",
    description: "Common in rock and metal for a darker, more intense feel",
    nashvilleNums: ["1m", "5", "6", "5"],
    nashvilleRomanNums: ["i", "v", "VI", "v"],
    difficulty: "basics",
    commonIn: ["rock", "metal", "alternative", "grunge"]
  },
  {
    name: "Sad Ballad Progression",
    description: "Creates a melancholic, emotional atmosphere",
    nashvilleNums: ["1m", "3", "4m", "6"],
    nashvilleRomanNums: ["i", "III", "iv", "VI"],
    difficulty: "basics",
    commonIn: ["ballads", "folk", "pop", "singer-songwriter"]
  },
  {
    name: "Dramatic Minor Progression",
    description: "Creates a tense, dramatic feel often used in film",
    nashvilleNums: ["1m", "6", "3", "5"],
    nashvilleRomanNums: ["i", "VI", "III", "V"],
    difficulty: "intermediate",
    commonIn: ["film scores", "dramatic pop", "classical", "rock"]
  },
];

const MINOR_PROGRESSIONS_INTERMEDIATE = [
  {
    name: "Andalusian Cadence Progression",
    description: "Descending progression from Spanish/Flamenco music",
    nashvilleNums: ["1m", "7", "6", "5"],
    nashvilleRomanNums: ["i", "VII", "VI", "V"],
    difficulty: "intermediate",
    commonIn: ["flamenco", "rock", "classical"]
  },
  {
    name: "Minor Jazz Turnaround",
    description: "Common turnaround used in minor key jazz standards",
    nashvilleNums: ["1m", "4m", "5", "1m"],
    nashvilleRomanNums: ["i", "iv", "V", "i"],
    difficulty: "intermediate",
    commonIn: ["jazz", "blues", "fusion", "soul"]
  }
];

const MINOR_PROGRESSIONS_ADVANCED = [
  // I just don't like this progression honestly
  // {
  //   name: "Minor with Diminished Progression",
  //   description: "Using diminished chords for tension",
  //   nashvilleNums: ["1m", "6", "7dim", "1m"],
  //   nashvilleRomanNums: ["i", "VI", "vii°", "i"],
  //   difficulty: "advanced",
  //   commonIn: ["classical", "jazz", "film music"]
  // },
  {
    name: "Harmonic Minor Cycle Progression",
    description: "Utilizing the harmonic minor sound",
    nashvilleNums: ["1m", "4m", "5", "1m"],
    nashvilleRomanNums: ["i", "iv", "V", "i"],
    difficulty: "advanced",
    commonIn: ["neo-classical", "jazz", "metal"]
  }
];

function getRandomProgression(key: Key | null, skillLevel: string = 'basics'): ChordProgression | null {
  if (!key) return null;
  
  let availableProgressions: ChordProgression[] = [];
  
  if (key.quality === 'major') {
    // For major keys
    switch(skillLevel) {
      case 'basics':
        availableProgressions = [...MAJOR_PROGRESSIONS_basics];
        break;
      case 'intermediate':
        availableProgressions = [...MAJOR_PROGRESSIONS_basics, ...MAJOR_PROGRESSIONS_INTERMEDIATE];
        break;
      case 'advanced':
        availableProgressions = [...MAJOR_PROGRESSIONS_basics, ...MAJOR_PROGRESSIONS_INTERMEDIATE, ...MAJOR_PROGRESSIONS_ADVANCED];
        break;
      default:
        availableProgressions = [...MAJOR_PROGRESSIONS_basics];
    }
  } else {
    // For minor keys
    switch(skillLevel) {
      case 'basics':
        availableProgressions = [...MINOR_PROGRESSIONS_basics];
        break;
      case 'intermediate':
        availableProgressions = [...MINOR_PROGRESSIONS_basics, ...MINOR_PROGRESSIONS_INTERMEDIATE];
        break;
      case 'advanced':
        availableProgressions = [...MINOR_PROGRESSIONS_basics, ...MINOR_PROGRESSIONS_INTERMEDIATE, ...MINOR_PROGRESSIONS_ADVANCED];
        break;
      default:
        availableProgressions = [...MINOR_PROGRESSIONS_basics];
    }
  }
  
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
  
  const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  const rootIndex = ALL_NOTES.indexOf(key.root);
  if (rootIndex === -1) return []; // Invalid root note
  
  // Define semitone intervals for major and minor scales
  const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
  const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
  
  // Convert each Nashville number to an actual chord
  return progression.nashvilleNums.map(nashvilleNum => {
    // Parse the Nashville number to get the degree and quality
    const regex = /^(b*)(\d+)(m|min|maj|dim|aug|sus4|sus2|\+|°)?(\/\w+)?$/;
    const match = nashvilleNum.match(regex);
    
    if (!match) return nashvilleNum; // Return as-is if not valid
    
    const [_, flat, degreeStr, quality, slash] = match;
    const degree = parseInt(degreeStr) - 1; // Convert to 0-based index
    
    // Choose the correct intervals based on key quality
    const intervals = key.quality === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
    
    // Calculate semitones based on scale degree using the appropriate interval set
    const semitones = intervals[degree % 7];
    
    // Calculate the note index, considering flats
    const noteIndex = (rootIndex + semitones) % 12;
    const finalNoteIndex = (noteIndex - flat.length + 12) % 12;
    const note = ALL_NOTES[finalNoteIndex];
    
    let chordQuality = '';
    
    // Apply explicit quality from the Nashville number if present
    if (quality) {
      chordQuality = quality === 'm' || quality === 'min' ? 'm' : quality;
    } else {
      // If no explicit quality, use default based on key type and degree
      if (key.quality === 'major') {
        // In major keys: I, IV, V are major; ii, iii, vi are minor; vii° is diminished
        if (degree === 1 || degree === 2 || degree === 5) {
          chordQuality = 'm';
        } else if (degree === 6) {
          chordQuality = 'dim';
        }
        // else major quality is implied (degrees 0, 3, 4)
      } else {
        // In minor keys: i, iv, v are minor; III, VI, VII are major; ii° is diminished
        if (degree === 0 || degree === 3 || degree === 4) {
          chordQuality = 'm';
        } else if (degree === 1) {
          chordQuality = 'dim';
        }
        // else major quality is implied (degrees 2, 5, 6)
      }
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