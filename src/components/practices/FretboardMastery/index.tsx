import { useKeyGenerator } from '../sharedPracticeComponents/hooks/useKeyGenerator';
import KeyDisplay from '../sharedPracticeComponents/KeyDisplay';
import FretboardDisplay from '../sharedPracticeComponents/FretboardDisplay';
import { FC } from 'react';

interface FretboardMasteryProps {
    skillLevel: string;
}

const FretboardMastery: FC<FretboardMasteryProps> = ({ skillLevel }) => {
    const { 
        currentKey, 
        generateNewKey,
        selectKey,
        isKeySelectorOpen,
        openKeySelector,
        closeKeySelector
    } = useKeyGenerator(skillLevel);

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
            
            {currentKey && (
                <FretboardDisplay 
                    highlightedNote={currentKey.root}
                    showIntervalSelector={true} 
                />
            )}
            
            {/* <Collapsible title={`(Click here for a list view of "${currentKey?.root}" on the fretboard)`}>
                <div className="fretboard-positions">
                    {renderPositionsByFret()}
                </div>
            </Collapsible> */}
        </div>
    )
}

export default FretboardMastery;