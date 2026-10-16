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
export function generateImprovisationPractice() {
  // Import individually to avoid circular references
  const { getRandomKey } = require('./keys');
  const { getRandomProgression, progressionToChords } = require('./progressions');
  const { getRandomTimeSignature } = require('./timeSignatures');
  const { getRandomBPMForDifficulty } = require('./tempos');
  const { getRandomExtension, applyExtension } = require('./extensions');
  const { getRandomFretRange } = require('./fretRanges');

  const key = getRandomKey();
  const progression = getRandomProgression(key);
  const basicsChords = progressionToChords(progression.nashville, key.root, key.quality);
  const extension = getRandomExtension();
  const chords = basicsChords.map((chord: string) => applyExtension(chord, extension));
  const timeSignature = getRandomTimeSignature();
  const tempo = getRandomBPMForDifficulty();
  const fretRange = getRandomFretRange();
  
  // Return the complete practice details
  return {
    key,
    progression: {
      ...progression,
      chords: chords,
      basicsChords
    },
    extension,
    timeSignature,
    tempo,
    fretRange
  };
}
