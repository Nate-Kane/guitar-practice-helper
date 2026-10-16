import { FC } from 'react';
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

const SoloImprovisation: FC = () => {
    // State for key and progression using custom hooks
    const { 
        currentKey, 
        generateNewKey, 
        selectKey, 
        isKeySelectorOpen, 
        openKeySelector, 
        closeKeySelector 
    } = useKeyGenerator();
    const { currentProgression, currentChords, generateNewProgression } = useProgressionGenerator(currentKey);
    const { currentExtension, generateNewExtension, shouldShowExtension } = useExtensionGenerator();
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();
    
    return (
        <div className="space-y-6">
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey}
                isKeySelectorOpen={isKeySelectorOpen}
                openKeySelector={openKeySelector}
                closeKeySelector={closeKeySelector}
                onSelectKey={selectKey}
            />

            <ProgressionDisplay 
                progression={currentProgression}
                chords={currentChords}
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
                showIntervalSelector={true}
                sectionHeading={FRETBOARD_REFERENCE_HEADING}
            />

            {/* add tempo & time signature */}
        </div>
    );
};

export default SoloImprovisation;