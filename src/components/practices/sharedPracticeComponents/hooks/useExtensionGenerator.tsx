import { useState, useEffect } from 'react';
import { getRandomExtension, ChordExtension } from '../../../../assets/practiceAssets/extensions';

export const useExtensionGenerator = () => {
  const [currentExtension, setCurrentExtension] = useState<ChordExtension | null>(null);

  const generateNewExtension = () => {
    let newExtension = getRandomExtension();
    let regenAttempts = 0;
    while((currentExtension && newExtension && currentExtension.name === newExtension.name) && regenAttempts < 5) {
      newExtension = getRandomExtension();
      regenAttempts++;
    }

    setCurrentExtension(newExtension);
    return newExtension;
  };

  useEffect(() => {
    generateNewExtension();
  }, []);

  return {
    currentExtension,
    generateNewExtension,
    shouldShowExtension: true
  };
};
