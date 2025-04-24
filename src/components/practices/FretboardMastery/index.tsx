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

    // Group positions by fret position instead of string name
    const renderPositionsByFret = () => {
        if (!currentKey) return null;
        
        // Get all positions of the current note
        const allPositions = findAllPositionsOfNote(currentKey.root);
        
        // Group by fret number
        const positionsByFret: Record<number, Array<{string: number, note: string}>> = {};
        
        // Initialize the object to store positions by fret
        allPositions.forEach(pos => {
            if (!positionsByFret[pos.fret]) {
                positionsByFret[pos.fret] = [];
            }
            
            positionsByFret[pos.fret].push({
                string: pos.string,
                note: pos.note
            });
        });
        
        // Format string name nicely
        const formatStringName = (stringNum: number): string => {
            switch(stringNum) {
                case 0: return "Low E";
                case 5: return "High e";
                default: return `${stringNames[stringNum].slice(0, 1)} string`;
            }
        };
        
        // Render each fret section - sort frets from lowest to highest
        return Object.entries(positionsByFret)
            .sort((a, b) => Number(a[0]) - Number(b[0])) // Sort by fret number
            .map(([fret, positions]) => (
                <div key={`fret-${fret}`} className="fret-positions">
                    <br/>
                    <h5>{fret === "0" ? "Open" : `Fret ${fret}`}:</h5>
                    <p>
                        {positions.map(pos => formatStringName(pos.string)).join(", ")}
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
                    <br/>
                    <h4>Find "{currentKey.root}" on the fretboard:</h4>
                    <FretboardDisplay 
                        highlightedNote={currentKey.root}
                        showIntervalSelector={true} 
                    />
                </>
            )}
            
            {/* <br/> */}
            <Collapsible title={`(Click here for a list view of "${currentKey?.root}" on the fretboard)`}>
                <div className="fretboard-positions">
                    {renderPositionsByFret()}
                </div>
            </Collapsible>
        </div>
    )
}

export default FretboardMastery;