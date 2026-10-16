import { FC } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import TriadsDisplay from '../sharedPracticeComponents/TriadsDisplay';

const VisualizingTriads: FC = () => {
  const {
    currentKey,
    letter,
    accidental,
    scaleView,
    showAllNotes,
    setShowAllNotes,
    generateNewKey,
    selectLetter,
    selectAccidental,
    selectScaleView,
  } = useKeyGenerator();

  return (
    <div className="w-full space-y-8">
      <KeyDisplay
        currentKey={currentKey}
        letter={letter}
        accidental={accidental}
        scaleView={scaleView}
        showAllNotes={showAllNotes}
        onLetterChange={selectLetter}
        onAccidentalChange={selectAccidental}
        onScaleViewChange={selectScaleView}
        onShowAllNotesChange={setShowAllNotes}
        onRegenerateKey={generateNewKey}
        showQuality
      />

      {currentKey && (
        <TriadsDisplay
          currentKey={currentKey}
          letter={letter}
          accidental={accidental}
          showAllNotes={showAllNotes}
        />
      )}
    </div>
  );
};

export default VisualizingTriads;
