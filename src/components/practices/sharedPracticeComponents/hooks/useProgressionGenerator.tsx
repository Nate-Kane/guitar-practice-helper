import { useState, useEffect } from 'react';
import { getRandomProgression, progressionToChords, ChordProgression } from '../../../../assets/practiceAssets/progressions';
import { Key } from '../../../../assets/practiceAssets/keys';

export const useProgressionGenerator = (currentKey: Key | null, skillLevel: string) => {
  const [currentProgression, setCurrentProgression] = useState<ChordProgression | null>(null);
  const [currentChords, setCurrentChords] = useState<string[]>([]);

  const generateNewProgression = () => {
    if (!currentKey) return null;
    
    let newProgression = getRandomProgression(currentKey, skillLevel);
    let regenAttempts = 0;
    
    while((currentProgression && newProgression && currentProgression.name === newProgression.name) && regenAttempts < 5) {
      newProgression = getRandomProgression(currentKey, skillLevel);
      regenAttempts++;
    }

    setCurrentProgression(newProgression);
    
    if (newProgression) {
      const chords = progressionToChords(newProgression, currentKey);
      setCurrentChords(chords);
      return newProgression;
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
