import { FC, useMemo } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import { useProgressionGenerator } from '../sharedPracticeComponents/hooks/useProgressionGenerator';
import { useExtensionGenerator } from '../sharedPracticeComponents/hooks/useExtensionGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import ProgressionDisplay from '../sharedPracticeComponents/ProgressionDisplay';
import ExtensionDisplay from '../sharedPracticeComponents/ExtensionDisplay';
import { useFretLimitGenerator } from '../sharedPracticeComponents/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../sharedPracticeComponents/FretLimitDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import { FRETBOARD_REFERENCE_HEADING } from '../sharedPracticeComponents/fretboardConstants';
import { respellChordSymbols } from '../../../assets/practiceAssets/keys';

const SoloImprovisation: FC = () => {
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
    const { currentProgression, currentChords, generateNewProgression } = useProgressionGenerator(currentKey);
    const { currentExtension, generateNewExtension, shouldShowExtension } = useExtensionGenerator();
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();

    const spelledChords = useMemo(
        () =>
            respellChordSymbols(
                currentChords,
                letter,
                accidental,
                currentKey?.quality === 'minor' ? 'minor' : 'major'
            ),
        [currentChords, letter, accidental, currentKey?.quality]
    );
    
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

            <ProgressionDisplay 
                progression={currentProgression}
                chords={spelledChords}
                onRegenerateProgression={generateNewProgression}
            />

            {shouldShowExtension && (
                <ExtensionDisplay
                    extension={currentExtension}
                    onRegenerateExtension={generateNewExtension}
                />
            )}

            <FretLimitDisplay
                currentFretLimit={currentFretLimit}
                onRegenerateFretLimit={generateNewFretLimit}
            />

            <FretboardDisplay
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

export default SoloImprovisation;
