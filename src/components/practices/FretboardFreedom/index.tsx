import { FC } from 'react';
import { useKeyGenerator } from '../shared/hooks/useKeyGenerator';
import KeyDisplay from '../shared/KeyDisplay';
import { useFretLimitGenerator } from '../shared/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../shared/FretLimitDisplay';

interface FretboardFreedomProps {
    skillLevel: string;
}

const FretboardFreedom: FC<FretboardFreedomProps> = ({ skillLevel }) => {
    const { currentKey, generateNewKey } = useKeyGenerator(skillLevel);
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();

    return (
        <div>
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey} 
            />

            <FretLimitDisplay
                currentFretLimit={currentFretLimit}
                onRegenerateFretLimit={generateNewFretLimit}
            />
    
            {/* add fret limitations */}

            {/* add tempo & time signature */}
        </div>
    );
};

export default FretboardFreedom;