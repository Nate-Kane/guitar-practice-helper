import { FC } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import { useFretLimitGenerator } from '../sharedPracticeComponents/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../sharedPracticeComponents/FretLimitDisplay';
import { useStringLimitGenerator } from '../sharedPracticeComponents/hooks/useStringLimitGenerator';
import { StringLimitDisplay } from '../sharedPracticeComponents/StringLimitDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';

interface FretboardFreedomProps {
    skillLevel: string;
}

const FretboardFreedom: FC<FretboardFreedomProps> = ({ skillLevel }) => {
    const { 
        currentKey, 
        generateNewKey,
        selectKey,
        isKeySelectorOpen,
        openKeySelector,
        closeKeySelector
    } = useKeyGenerator(skillLevel);
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
                skillLevel={skillLevel}
                isKeySelectorOpen={isKeySelectorOpen}
                openKeySelector={openKeySelector}
                closeKeySelector={closeKeySelector}
                onSelectKey={selectKey}
            />
            <br/>
            <FretboardDisplay
                highlightedNote={currentKey?.root}
                showIntervalSelector={true} 
            />

            {/* add tempo & time signature */}
        </div>
    );
};

export default FretboardFreedom;