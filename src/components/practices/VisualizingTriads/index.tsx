import { FC } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import TriadsDisplay from '../sharedPracticeComponents/TriadsDisplay';

interface VisualizingTriadsProps {
  skillLevel: string;
}

const VisualizingTriads: FC<VisualizingTriadsProps> = ({ skillLevel }) => {
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

      {currentKey && <TriadsDisplay currentKey={currentKey} />}
    </div>
  );
};

export default VisualizingTriads;
