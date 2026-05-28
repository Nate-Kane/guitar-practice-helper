import { FC } from 'react';
import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import { useFretLimitGenerator } from '../sharedPracticeComponents/hooks/useFretLimitGenerator';
import FretLimitDisplay from '../sharedPracticeComponents/FretLimitDisplay';
import { useStringLimitGenerator } from '../sharedPracticeComponents/hooks/useStringLimitGenerator';
import { StringLimitDisplay } from '../sharedPracticeComponents/StringLimitDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import { FRETBOARD_REFERENCE_HEADING } from '../sharedPracticeComponents/fretboardConstants';

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

            <FretLimitDisplay
                currentFretLimit={currentFretLimit}
                onRegenerateFretLimit={generateNewFretLimit}
            />

            <StringLimitDisplay
                currentStringLimit={currentStringLimit}
                onRegenerateStringLimit={generateNewStringLimit}
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

export default FretboardFreedom;