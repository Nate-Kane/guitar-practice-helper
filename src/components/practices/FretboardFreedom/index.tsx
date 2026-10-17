import { FC } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import { useFretLimitGenerator } from '../sharedPracticeComponents/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../sharedPracticeComponents/FretLimitDisplay';
import { useStringLimitGenerator } from '../sharedPracticeComponents/hooks/useStringLimitGenerator';
import { StringLimitDisplay } from '../sharedPracticeComponents/StringLimitDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import { FRETBOARD_REFERENCE_HEADING } from '../sharedPracticeComponents/fretboardConstants';

const FretboardFreedom: FC = () => {
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
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();
    const { currentStringLimit, generateNewStringLimit } = useStringLimitGenerator();

    return (
        <div className="space-y-6">
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
            />

            <FretLimitDisplay
                currentFretLimit={currentFretLimit}
                onRegenerateFretLimit={generateNewFretLimit}
            />

            <StringLimitDisplay
                currentStringLimit={currentStringLimit}
                onRegenerateStringLimit={generateNewStringLimit}
            />
            
            <FretboardDisplay
                maxFret={14}
                highlightedNote={currentKey?.root}
                keyQuality={currentKey?.quality}
                scaleView={scaleView}
                onScaleViewChange={selectScaleView}
                rootLetter={letter}
                accidental={showAllNotes ? noteSpelling : accidental}
                showAllNotes={showAllNotes}
                showIntervalSelector={true}
                sectionHeading={FRETBOARD_REFERENCE_HEADING}
            />

            {/* add tempo & time signature */}
        </div>
    );
};

export default FretboardFreedom;
