import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import {
    DARK_ROSEWOOD_LABEL_TEXT,
    FretboardInstrument,
    GUITAR_INSTRUMENT,
} from '../sharedPracticeComponents/fretboardConstants';
import { FC } from 'react';

interface FretboardMapperyProps {
    instrument?: FretboardInstrument;
    maxFret?: number;
    heading?: string;
}

const FretboardMappery: FC<FretboardMapperyProps> = ({
    instrument = GUITAR_INSTRUMENT,
    maxFret = 14,
    heading = 'Choose a key, then explore the interactive fretboard',
}) => {
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
        <div className="w-full space-y-8 -mt-2">

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
                heading={heading}
            />

            {currentKey && (
                <>
                    <FretboardDisplay
                        instrument={instrument}
                        maxFret={maxFret}
                        highlightedNote={currentKey.root}
                        keyQuality={currentKey.quality}
                        scaleView={scaleView}
                        onScaleViewChange={selectScaleView}
                        rootLetter={letter}
                        accidental={showAllNotes ? noteSpelling : accidental}
                        showAllNotes={showAllNotes}
                        showIntervalSelector={true}
                        mutedFretLabels /* grey nut */
                        fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT} /* label text only */
                    />
                </>
            )}
        </div>
    )
}

export default FretboardMappery;
