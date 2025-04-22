import { useState, useEffect } from 'react';
import { getRandomKey, Key } from '../../../../assets/practiceAssets/keys.ts';

export const useKeyGenerator = (skillLevel: string) => {
  const [currentKey, setCurrentKey] = useState<Key | null>(null);

  const generateNewKey = () => {
    const newKey = getRandomKey(skillLevel);
    setCurrentKey(newKey);
    return newKey;
  };

  // Initialize key on mount or skill level change
  useEffect(() => {
    generateNewKey();
  }, [skillLevel]);

  return {
    currentKey,
    generateNewKey
  };
};
