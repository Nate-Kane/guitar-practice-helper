import { useState, useEffect } from 'react';
import { getRandomKey, Key } from '../../../../assets/practiceAssets/keys.ts';

export const useKeyGenerator = () => {
  const [currentKey, setCurrentKey] = useState<Key | null>(null);
  const [isKeySelectorOpen, setIsKeySelectorOpen] = useState<boolean>(false);

  const generateNewKey = () => {
    let newKey = getRandomKey();
    let regenAttempts = 0;

    while((currentKey && currentKey.name === newKey.name) && regenAttempts < 5) {
      newKey = getRandomKey();
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

  useEffect(() => {
    generateNewKey();
  }, []);

  return {
    currentKey,
    generateNewKey,
    selectKey,
    isKeySelectorOpen,
    openKeySelector,
    closeKeySelector
  };
};
