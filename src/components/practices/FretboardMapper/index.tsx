import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import { DARK_ROSEWOOD_LABEL_TEXT } from '../sharedPracticeComponents/fretboardConstants';
import StringNotesDisplay from '../sharedPracticeComponents/StringNotesDisplay';
import TriadsDisplay from '../sharedPracticeComponents/TriadsDisplay';
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
        <div className="space-y-4">
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey}
                skillLevel={skillLevel}
                isKeySelectorOpen={isKeySelectorOpen}
                openKeySelector={openKeySelector}
                closeKeySelector={closeKeySelector}
                onSelectKey={selectKey}
            />
            
            {currentKey && (
                <>
                    <div className="space-y-4 max-w-[900px]">
                        <h2 className="text-xl font-bold text-amber-900">
                            Freely Explore the Fretboard
                        </h2>
                        <FretboardDisplay
                            highlightedNote={currentKey.root}
                            keyQuality={currentKey.quality}
                            showIntervalSelector={true}
                            mutedFretLabels /* grey nut */
                            fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT} /* label text only */
                        />
                    </div>

                    <StringNotesDisplay />


                    <TriadsDisplay currentKey={currentKey} />
                </>
            )}
            
            {/* <Collapsible title={`(Click here for a list view of "${currentKey?.root}" on the fretboard)`}>
                <div className="fretboard-positions">
                    {renderPositionsByFret()}
                </div>
            </Collapsible> */}
        </div>
    )
}

export default FretboardMappery;