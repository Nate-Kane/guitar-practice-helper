import { useMapFretboard } from '../shared/hooks/useMapFretboard'
import { useKeyGenerator } from '../shared/hooks/useKeyGenerator';
import KeyDisplay from '../shared/KeyDisplay';
import Collapsible from '../../Collapsible';
import FretboardDisplay from '../../FretboardDisplay';
import { FC } from 'react';


interface FretboardMasteryProps {
    skillLevel: string;
}

// First, let's create a mapping from string numbers to names
const stringNames: Record<number, string> = {
  0: 'Low E (6th string)',
  1: 'A (5th string)',
  2: 'D (4th string)',
  3: 'G (3rd string)',
  4: 'B (2nd string)',
  5: 'High E (1st string)'
};

const FretboardMastery: FC<FretboardMasteryProps> = ({ skillLevel }) => {
    const { findAllPositionsOfNote } = useMapFretboard();
    const { currentKey, generateNewKey } = useKeyGenerator(skillLevel);

    // Group positions by string name
    const renderPositionsByString = () => {
        if (!currentKey) return null;
        
        // Group the positions by string
        const positionsByString: Record<string, Array<{fret: number, note: string}>> = {};
        
        // Initialize strings in order from high to low (for display purposes)
        const orderedStringNames = Object.entries(stringNames)
            .sort((a, b) => Number(a[0]) - Number(b[0])) // Sort from high to low
            .map(entry => entry[1]);
            
        orderedStringNames.forEach(stringName => {
            positionsByString[stringName] = [];
        });
        
        // Fill with positions
        findAllPositionsOfNote(currentKey.root).forEach(pos => {
            const stringName = stringNames[pos.string];
            positionsByString[stringName].push({
                fret: pos.fret,
                note: pos.note
            });
        });
        
        // Render each string section
        return Object.entries(positionsByString).map(([stringName, positions]) => (
            <div key={stringName} className="string-positions">
                <br/>
                <h5>{stringName}:</h5>
                <p>
                    {positions.length === 0 ? 
                        "None" : 
                        positions.map(pos => 
                            `${pos.fret === 0 ? "Open" : `Fret ${pos.fret}`}`
                        ).join(", ")
                    }
                </p>
            </div>
        ));
    };

    return (
        <div>
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey} 
            />
            
            {currentKey && (
                <>
                    <h4>Find "{currentKey.root}" on the fretboard:</h4>
                    <FretboardDisplay highlightedNote={currentKey.root} />
                </>
            )}
            
            <br/>
            <Collapsible title={`Find "${currentKey?.root}" everywhere on the fretboard (list view)`}>
                <div className="fretboard-positions">
                    {renderPositionsByString()}
                </div>
            </Collapsible>
        </div>
    )
}

export default FretboardMastery;

// save description and directions for this practice while displaying "in progress"
/**
 * Description: Take the strain out of memorizing the notes on the fretboard. I'll help you locate and memorize the entire fretboard through patterns and repetition.
 * 
 * 
 * Directions: The hardest part of memorizing the fretboard is finding all of the notes for the first time. I'll take that strain away by helping you locate them. Patterns are crucial for fretboard mastery. To help you see the patterns, we'll start by mapping out the root of the key and then use that root to find every other interval.
 */