import { FC } from 'react';
import { Practice } from '../../../types/practice';
import { useKeyGenerator } from '../shared/hooks/useKeyGenerator';
import { useProgressionGenerator } from '../shared/hooks/useProgressionGenerator';
import { useExtensionGenerator } from '../shared/hooks/useExtensionGenerator';
import KeyDisplay from '../shared/KeyDisplay';
import ProgressionDisplay from '../shared/ProgressionDisplay';
import ExtensionDisplay from '../shared/ExtensionDisplay';
import { useFretLimitGenerator } from '../shared/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../shared/FretLimitDisplay';
import FretboardDisplay from '../../FretboardDisplay';
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