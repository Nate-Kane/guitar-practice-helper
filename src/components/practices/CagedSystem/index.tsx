import { FC } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import { DARK_ROSEWOOD_LABEL_TEXT } from '../sharedPracticeComponents/fretboardConstants';

interface CagedSystemProps {
  skillLevel: string;
}

const CagedSystem: FC<CagedSystemProps> = ({ skillLevel }) => {
  const {
    currentKey,
    generateNewKey,
    selectKey,
    isKeySelectorOpen,
    openKeySelector,
    closeKeySelector,
  } = useKeyGenerator(skillLevel);

  return (
    <div className="w-full space-y-8">
      <KeyDisplay
        currentKey={currentKey}
        onRegenerateKey={generateNewKey}
        skillLevel={skillLevel}
        isKeySelectorOpen={isKeySelectorOpen}
        openKeySelector={openKeySelector}
        closeKeySelector={closeKeySelector}
        onSelectKey={selectKey}
      />

      {currentKey && (
        <FretboardDisplay
          highlightedNote={currentKey.root}
          keyQuality={currentKey.quality}
          showIntervalSelector={true}
          mutedFretLabels
          fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT}
        />
      )}
    </div>
  );
};

export default CagedSystem;
