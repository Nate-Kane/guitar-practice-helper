import { FC } from 'react';
import { useKeyGenerator } from '../shared/hooks/useKeyGenerator';
import KeyDisplay from '../shared/KeyDisplay';
import { useFretLimitGenerator } from '../shared/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../shared/FretLimitDisplay';
import { useStringLimitGenerator } from '../shared/hooks/useStringLimitGenerator';
import { StringLimitDisplay } from '../shared/StringLimitDisplay';

interface FretboardFreedomProps {
    skillLevel: string;
}

const FretboardFreedom: FC<FretboardFreedomProps> = ({ skillLevel }) => {
    const { currentKey, generateNewKey } = useKeyGenerator(skillLevel);
    const { currentFretLimit, generateNewFretLimit } = useFretLimitGenerator();
    const { currentStringLimit, generateNewStringLimit } = useStringLimitGenerator();

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

            <StringLimitDisplay
                currentStringLimit={currentStringLimit}
                onRegenerateStringLimit={generateNewStringLimit}
            />

            {/* add tempo & time signature */}
        </div>
    );
};

export default FretboardFreedom;