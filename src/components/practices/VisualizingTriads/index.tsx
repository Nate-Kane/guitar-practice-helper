import { FC } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import TriadsDisplay from '../sharedPracticeComponents/TriadsDisplay';

const VisualizingTriads: FC = () => {
  const {
    currentKey,
    generateNewKey,
    selectKey,
    isKeySelectorOpen,
    openKeySelector,
    closeKeySelector,
  } = useKeyGenerator();

  return (
    <div className="w-full space-y-8">
      <KeyDisplay
        currentKey={currentKey}
        onRegenerateKey={generateNewKey}
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
