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
    noteSpelling,
    setNoteSpelling,
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
        noteSpelling={noteSpelling}
        onLetterChange={selectLetter}
        onAccidentalChange={selectAccidental}
        onNoteSpellingChange={setNoteSpelling}
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
          noteSpelling={noteSpelling}
          showAllNotes={showAllNotes}
        />
      )}
    </div>
  );
};

export default VisualizingTriads;
