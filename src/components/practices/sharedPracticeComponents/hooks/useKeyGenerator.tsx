import { useState, useEffect } from 'react';
import { getRandomKey, Key } from '../../../../assets/practiceAssets/keys.ts';

export const useKeyGenerator = (skillLevel: string) => {
  const [currentKey, setCurrentKey] = useState<Key | null>(null);
  const [isKeySelectorOpen, setIsKeySelectorOpen] = useState<boolean>(false);

  const generateNewKey = () => {
    let newKey = getRandomKey(skillLevel);
    let regenAttempts = 0;

    while((currentKey && currentKey.name === newKey.name) && regenAttempts < 5) {
      newKey = getRandomKey(skillLevel);
      regenAttempts++;
    }

    setCurrentKey(newKey);
    return newKey;
  };

  // Manually select a key
  const selectKey = (key: Key) => {
    setCurrentKey(key);
    return key;
  };

  // Open key selector modal
  const openKeySelector = () => {
    setIsKeySelectorOpen(true);
  };

  // Close key selector modal
  const closeKeySelector = () => {
    setIsKeySelectorOpen(false);
  };

  // Initialize key on mount or skill level change
  useEffect(() => {
    generateNewKey();
  }, [skillLevel]);

  return {
    currentKey,
    generateNewKey,
    selectKey,
    isKeySelectorOpen,
    openKeySelector,
    closeKeySelector
  };
};
