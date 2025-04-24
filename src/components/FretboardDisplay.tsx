import React from 'react';
import './FretboardDisplay.css';
import { useMapFretboard } from './practices/shared/hooks/useMapFretboard';

interface FretboardDisplayProps {
  highlightedNote?: string;
  maxFret?: number;
}

const FretboardDisplay: React.FC<FretboardDisplayProps> = ({
  highlightedNote,
  maxFret = 12
}) => {
  const { getNoteAt } = useMapFretboard(maxFret);
  
  const stringNames = ['E', 'A', 'D', 'G', 'B', 'E']; // standard tuning!
  
  const getNoteAtPosition = (stringIndex: number, fret: number): string => {
    return getNoteAt(stringIndex, fret)?.note || '';
  };
  
  const shouldHighlight = (stringIndex: number, fret: number): boolean => {
    if (!highlightedNote) return false;
    return getNoteAt(stringIndex, fret)?.note === highlightedNote;
  };
  
  const hasFretMarker = (stringIndex: number, fret: number): boolean => {
    // Only place markers between D and G strings (index 2 and 3)
    if (stringIndex !== 2) return false;
    
    const singleDotFrets = [3, 5, 7, 9];
    const doubleDotFrets = [12];
    
    return singleDotFrets.includes(fret) || doubleDotFrets.includes(fret);
  };
  
  const isDoubleDotMarker = (fret: number): boolean => {
    return fret === 12;
  };
  
  const getStringNameDisplay = (index: number) => {
    if (index === 5) return 'e';
    return stringNames[index];
  };
  
  return (
    <div className="fretboard-container">
      <div className="fretboard-with-names">
        <div className="string-names">
          {/* Render string names from high E to low E */}
          {[...Array(6)].map((_, i) => (
            <div key={`string-name-${i}`} className="string-name">
              {getStringNameDisplay(5 - i)}
            </div>
          ))}
        </div>
        
        <div className="fretboard">
          {/* Render strings from high to low (reverse the order) */}
          {[...Array(6)].map((_, i) => {
            // Map from high E (index 5) down to low E (index 0)
            const stringIndex = 5 - i;
            return (
              <div key={`string-${stringIndex}`} className="string">
                {Array.from({ length: maxFret + 1 }).map((_, fretIndex) => (
                  <div 
                    key={`fret-${fretIndex}`} 
                    className={`fret ${shouldHighlight(stringIndex, fretIndex) ? 'highlighted' : ''}`}
                  >
                    <div className="note-marker">
                      {shouldHighlight(stringIndex, fretIndex) && (
                        <div className="note-name">{getNoteAtPosition(stringIndex, fretIndex)}</div>
                      )}
                    </div>
                    
                    {/* Add fret markers directly on the fretboard */}
                    {hasFretMarker(stringIndex, fretIndex) && (
                      <div className="inlay-marker">
                        {isDoubleDotMarker(fretIndex) ? (
                          <>
                            <div className="inlay-dot"></div>
                            <div className="inlay-dot"></div>
                          </>
                        ) : (
                          <div className="inlay-dot"></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="fret-numbers">
        {Array.from({ length: maxFret + 1 }).map((_, fretIndex) => (
          <div key={`fret-num-${fretIndex}`} className="fret-number">
            {fretIndex === 0 ? 'Open' : fretIndex}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FretboardDisplay; 