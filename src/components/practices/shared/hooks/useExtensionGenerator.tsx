import { useState, useEffect } from 'react';
import { getRandomExtension, ChordExtension } from '../../../../assets/practiceAssets/extensions';

export const useExtensionGenerator = (skillLevel: string) => {
  const [currentExtension, setCurrentExtension] = useState<ChordExtension | null>(null);

  const generateNewExtension = () => {
    const extension = getRandomExtension(skillLevel);
    setCurrentExtension(extension);
    return extension;
  };

  // Initialize extension when key changes or skill level changes
  useEffect(() => {
    if (skillLevel !== 'beginner') {
      generateNewExtension();
    } else {
      setCurrentExtension(null);
    }
  }, [skillLevel]);

  return {
    currentExtension,
    generateNewExtension,
    shouldShowExtension: skillLevel !== 'beginner'
  };
};
