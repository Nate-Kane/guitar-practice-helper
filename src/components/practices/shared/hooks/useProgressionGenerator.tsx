import { useState, useEffect } from 'react';
import { getRandomProgression, progressionToChords, ChordProgression } from '../../../../assets/practiceAssets/progressions';
import { Key } from '../../../../assets/practiceAssets/keys';

export const useProgressionGenerator = (currentKey: Key | null, skillLevel: string) => {
  const [currentProgression, setCurrentProgression] = useState<ChordProgression | null>(null);
  const [currentChords, setCurrentChords] = useState<string[]>([]);

  const generateNewProgression = () => {
    if (!currentKey) return null;
    
    const progression = getRandomProgression(currentKey, skillLevel);
    setCurrentProgression(progression);
    
    if (progression) {
      const chords = progressionToChords(progression, currentKey);
      setCurrentChords(chords);
      return progression;
    }
    return null;
  };

  // Update progression when key changes
  useEffect(() => {
    if (currentKey) {
      generateNewProgression();
    }
  }, [currentKey, skillLevel]);

  return {
    currentProgression,
    currentChords,
    generateNewProgression
  };
};
