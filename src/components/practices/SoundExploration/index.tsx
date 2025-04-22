import { FC } from 'react';
import { Practice } from '../../../types/practice';
import { useKeyGenerator } from '../shared/hooks/useKeyGenerator';
import { useProgressionGenerator } from '../shared/hooks/useProgressionGenerator';
import { useExtensionGenerator } from '../shared/hooks/useExtensionGenerator';
import KeyDisplay from '../shared/keyDisplay';
import ProgressionDisplay from '../shared/ProgressionDisplay';
import ExtensionDisplay from '../shared/ExtensionDisplay';

interface SoloImprovisationProps {
    practice: Practice;
    skillLevel: string;
}

const SoloImprovisation: FC<SoloImprovisationProps> = ({ skillLevel }) => {
    // State for key and progression using custom hooks
    const { currentKey, generateNewKey } = useKeyGenerator(skillLevel);
    const { currentProgression, currentChords, generateNewProgression } = useProgressionGenerator(currentKey, skillLevel);
    const { currentExtension, generateNewExtension, shouldShowExtension } = useExtensionGenerator(skillLevel);
    
    return (
        <div>
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey} 
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
        
            {/* add fret limitations */}
            {/* add tempo & time signature */}
        </div>
    );
};

export default SoloImprovisation;