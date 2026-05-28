import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import { DARK_ROSEWOOD_LABEL_TEXT } from '../sharedPracticeComponents/fretboardConstants';
import StringNotesDisplay from '../sharedPracticeComponents/StringNotesDisplay';
import { FC } from 'react';

interface FretboardMapperyProps {
    skillLevel: string;
}

const FretboardMappery: FC<FretboardMapperyProps> = ({ skillLevel }) => {
    const { 
        currentKey, 
        generateNewKey,
        selectKey,
        isKeySelectorOpen,
        openKeySelector,
        closeKeySelector
    } = useKeyGenerator(skillLevel);

    return (
        <div className="max-w-[900px] space-y-8 -mt-2">

            <KeyDisplay
                currentKey={currentKey}
                onRegenerateKey={generateNewKey}
                skillLevel={skillLevel}
                isKeySelectorOpen={isKeySelectorOpen}
                openKeySelector={openKeySelector}
                closeKeySelector={closeKeySelector}
                onSelectKey={selectKey}
                heading="Choose a key, then explore the interactive fretboard"
            />

            {currentKey && (
                <>
                    <FretboardDisplay
                        highlightedNote={currentKey.root}
                        keyQuality={currentKey.quality}
                        showIntervalSelector={true}
                        mutedFretLabels /* grey nut */
                        fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT} /* label text only */
                    />
                    <br/>
                    <StringNotesDisplay heading="Memorize the notes of a single string" />
                </>
            )}
        </div>
    )
}

export default FretboardMappery;