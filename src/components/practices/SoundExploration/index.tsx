import { FC } from 'react';
import { Practice } from '../../../types/practice';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import { useProgressionGenerator } from '../sharedPracticeComponents/hooks/useProgressionGenerator';
import { useExtensionGenerator } from '../sharedPracticeComponents/hooks/useExtensionGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import ProgressionDisplay from '../sharedPracticeComponents/ProgressionDisplay';
import ExtensionDisplay from '../sharedPracticeComponents/ExtensionDisplay';
import { useFretLimitGenerator } from '../sharedPracticeComponents/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../sharedPracticeComponents/FretLimitDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';

interface SoloImprovisationProps {
    practice: Practice;
    skillLevel: string;
}

const SoloImprovisation: FC<SoloImprovisationProps> = ({ skillLevel }) => {
    // State for key and progression using custom hooks
    const { 
        currentKey, 
        generateNewKey, 
        selectKey, 
        isKeySelectorOpen, 
        openKeySelector, 
        closeKeySelector 
    } = useKeyGenerator(skillLevel);
    const { currentProgression, currentChords, generateNewProgression } = useProgressionGenerator(currentKey, skillLevel);
    const { currentExtension, generateNewExtension, shouldShowExtension } = useExtensionGenerator(skillLevel);
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();
    
    return (
        <div className="space-y-6">
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey}
                skillLevel={skillLevel}
                isKeySelectorOpen={isKeySelectorOpen}
                openKeySelector={openKeySelector}
                closeKeySelector={closeKeySelector}
                onSelectKey={selectKey}
            />

            <FretboardDisplay
                highlightedNote={currentKey?.root}
                showIntervalSelector={true} 
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

            {/* add tempo & time signature */}
        </div>
    );
};

export default SoloImprovisation;