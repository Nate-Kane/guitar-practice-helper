import { FC } from 'react';
import { useKeyGenerator } from '../shared/hooks/useKeyGenerator';
import KeyDisplay from '../shared/KeyDisplay';
import { useFretLimitGenerator } from '../shared/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../shared/FretLimitDisplay';
import { useStringLimitGenerator } from '../shared/hooks/useStringLimitGenerator';
import { StringLimitDisplay } from '../shared/StringLimitDisplay';
import FretboardDisplay from '../../FretboardDisplay';

interface FretboardFreedomProps {
    skillLevel: string;
}

const FretboardFreedom: FC<FretboardFreedomProps> = ({ skillLevel }) => {
    const { currentKey, generateNewKey } = useKeyGenerator(skillLevel);
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();
    const { currentStringLimit, generateNewStringLimit } = useStringLimitGenerator();

    return (
        <div>
            

            <FretLimitDisplay
                currentFretLimit={currentFretLimit}
                onRegenerateFretLimit={generateNewFretLimit}
            />

            <StringLimitDisplay
                currentStringLimit={currentStringLimit}
                onRegenerateStringLimit={generateNewStringLimit}
            />

            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey} 
            />
            <br/>
            <h4>Find "{currentKey?.root}" on the fretboard:</h4>
            <FretboardDisplay
                highlightedNote={currentKey?.root}
                showIntervalSelector={true} 
            />

            {/* add tempo & time signature */}
        </div>
    );
};

export default FretboardFreedom;