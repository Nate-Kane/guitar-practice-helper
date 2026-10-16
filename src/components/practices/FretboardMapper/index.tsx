import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import {
    DARK_ROSEWOOD_LABEL_TEXT,
    FretboardInstrument,
    GUITAR_INSTRUMENT,
} from '../sharedPracticeComponents/fretboardConstants';
import { FC } from 'react';

interface FretboardMapperyProps {
    skillLevel: string;
    instrument?: FretboardInstrument;
    maxFret?: number;
    heading?: string;
}

const FretboardMappery: FC<FretboardMapperyProps> = ({
    skillLevel,
    instrument = GUITAR_INSTRUMENT,
    maxFret = 14,
    heading = 'Choose a key, then explore the interactive fretboard',
}) => {
    const { 
        currentKey, 
        generateNewKey,
        selectKey,
        isKeySelectorOpen,
        openKeySelector,
        closeKeySelector
    } = useKeyGenerator(skillLevel);

    return (
        <div className="w-full space-y-8 -mt-2">

            <KeyDisplay
                currentKey={currentKey}
                onRegenerateKey={generateNewKey}
                skillLevel={skillLevel}
                isKeySelectorOpen={isKeySelectorOpen}
                openKeySelector={openKeySelector}
                closeKeySelector={closeKeySelector}
                onSelectKey={selectKey}
                heading={heading}
            />

            {currentKey && (
                <>
                    <FretboardDisplay
                        instrument={instrument}
                        maxFret={maxFret}
                        highlightedNote={currentKey.root}
                        keyQuality={currentKey.quality}
                        showIntervalSelector={true}
                        mutedFretLabels /* grey nut */
                        fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT} /* label text only */
                    />
                </>
            )}
        </div>
    )
}

export default FretboardMappery;