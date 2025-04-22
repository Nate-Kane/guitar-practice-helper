import { useState, useEffect } from 'react';
import { getRandomExtension, ChordExtension } from '../../../../assets/practiceAssets/extensions';

export const useExtensionGenerator = (skillLevel: string) => {
  const [currentExtension, setCurrentExtension] = useState<ChordExtension | null>(null);

  const generateNewExtension = () => {
    let newExtension = getRandomExtension(skillLevel);
    let regenAttempts = 0;
    while((currentExtension && newExtension && currentExtension.name === newExtension.name) && regenAttempts < 5) {
      newExtension = getRandomExtension(skillLevel);
      regenAttempts++;
    }

    setCurrentExtension(newExtension);
    return newExtension;
  };

  // Initialize extension when key changes or skill level changes
  useEffect(() => {
    if (skillLevel !== 'basics') {
      generateNewExtension();
    } else {
      setCurrentExtension(null);
    }
  }, [skillLevel]);

  return {
    currentExtension,
    generateNewExtension,
    shouldShowExtension: skillLevel !== 'basics'
  };
};
