// Re-export everything from each module
export * from './keys';
export * from './progressions';
export * from './timeSignatures';
export * from './tempos';
export * from './extensions';
export * from './fretRanges';

// Add utility functions for generating practice sessions

/**
 * Generate a complete improvisation practice based on the user's skill level
 */
export function generateImprovisationPractice(skillLevel: string) {
  // Import individually to avoid circular references
  const { getRandomKey } = require('./keys');
  const { getRandomProgression, progressionToChords } = require('./progressions');
  const { getRandomTimeSignature } = require('./timeSignatures');
  const { getRandomBPMForDifficulty } = require('./tempos');
  const { getRandomExtension, applyExtension } = require('./extensions');
  const { getRandomFretRange } = require('./fretRanges');
  
  // Get a random key appropriate for the skill level
  const key = getRandomKey(skillLevel);
  
  // Get a random chord progression
  const progression = getRandomProgression(skillLevel);
  
  // Convert Nashville numbers to actual chords in the selected key
  const basicsChords = progressionToChords(progression.nashville, key.root, key.quality);
  
  // Select a random extension and apply to chords if above basics level
  const extension = getRandomExtension(skillLevel);
  const chords = basicsChords.map((chord: string) => 
    skillLevel === 'basics' ? chord : applyExtension(chord, extension)
  );
  
  // Get a random time signature
  const timeSignature = getRandomTimeSignature(skillLevel);
  
  // Get a random tempo
  const tempo = getRandomBPMForDifficulty(skillLevel);
  
  // Get a random fret range
  const fretRange = getRandomFretRange(skillLevel);
  
  // Return the complete practice details
  return {
    key,
    progression: {
      ...progression,
      chords: chords,
      basicsChords
    },
    extension: skillLevel === 'basics' ? null : extension,
    timeSignature,
    tempo,
    fretRange
  };
}
