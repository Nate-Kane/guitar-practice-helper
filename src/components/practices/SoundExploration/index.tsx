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
import Collapsible from '../../Collapsible';

interface SoloImprovisationProps {
    practice: Practice;
    skillLevel: string;
}

const SoloImprovisation: FC<SoloImprovisationProps> = ({ skillLevel }) => {
    // State for key and progression using custom hooks
    const { currentKey, generateNewKey } = useKeyGenerator(skillLevel);
    const { currentProgression, currentChords, generateNewProgression } = useProgressionGenerator(currentKey, skillLevel);
    const { currentExtension, generateNewExtension, shouldShowExtension } = useExtensionGenerator(skillLevel);
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();
    
    return (
        <div>
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey} 
            />
            <br/>
            <Collapsible title={`Click here to find "${currentKey?.root}" on the fretboard`} defaultOpen={false}>
                <FretboardDisplay
                    highlightedNote={currentKey?.root}
                    showIntervalSelector={true} 
                />
            </Collapsible>
            
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