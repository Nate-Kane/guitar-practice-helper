import React, { useState } from 'react';
import './FretboardDisplay.css';
import { useMapFretboard } from './hooks/useMapFretboard';
import Collapsible from '../../Collapsible';

interface HighlightedNoteInfo {
  note: string;
  color: string;
  label?: string;
}

// Define intervals and their colors
interface IntervalInfo {
  name: string;
  semitones: number;
  color: string;
  selected?: boolean;
}

const intervalOptions: IntervalInfo[] = [
  { name: 'Major 2nd', semitones: 2, color: '#3DA2C7', selected: false }, // Deeper amber/orange
  { name: 'Minor 3rd', semitones: 3, color: '#C13C28', selected: false }, // Brighter cherry red
  { name: 'Major 3rd', semitones: 4, color: '#D68C00', selected: false }, // Vibrant gold
  { name: 'Perfect 4th', semitones: 5, color: '#A67C4E', selected: false }, // Lighter rosewood
  { name: 'Perfect 5th', semitones: 7, color: '#4668B0', selected: false }, // Blue (vintage amp blue)
  { name: 'Major 6th', semitones: 9, color: '#D17832', selected: false }, // Bright maple 
  { name: 'Minor 7th', semitones: 10, color: '#B87346', selected: false }, // Brighter mahogany
  { name: 'Major 7th', semitones: 11, color: '#CA8C4D', selected: false }, // Brighter sunburst
];

interface FretboardDisplayProps {
  highlightedNote?: string; // Kept for backward compatibility
  highlightedNotes?: HighlightedNoteInfo[]; // For manually specifying highlighted notes
  maxFret?: number;
  showIntervalSelector?: boolean; // Control whether to show interval selector
}

const FretboardDisplay: React.FC<FretboardDisplayProps> = ({
  highlightedNote,
  highlightedNotes = [],
  maxFret = 12,
  showIntervalSelector = false
}) => {
  const { getNoteAt } = useMapFretboard(maxFret);
  const [intervals, setIntervals] = useState<IntervalInfo[]>(intervalOptions);
  
  const stringNames = ['E', 'A', 'D', 'G', 'B', 'E']; // standard tuning!
  
  const getNoteAtPosition = (stringIndex: number, fret: number): string => {
    return getNoteAt(stringIndex, fret)?.note || '';
  };

  // Calculate interval notes based on root note
  const getIntervalNotes = (): HighlightedNoteInfo[] => {
    if (!highlightedNote) return [];

    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = allNotes.indexOf(highlightedNote);
    if (rootIndex === -1) return [];
    
    return intervals
      .filter(interval => interval.selected)
      .map(interval => {
        const noteIndex = (rootIndex + interval.semitones) % 12;
        return {
          note: allNotes[noteIndex],
          color: interval.color,
          label: interval.name
        };
      });
  };

  // Toggle interval selection
  const toggleInterval = (index: number) => {
    const newIntervals = [...intervals];
    newIntervals[index].selected = !newIntervals[index].selected;
    setIntervals(newIntervals);
  };
  
  // Find if a position should be highlighted and with what info
  const getHighlightInfo = (stringIndex: number, fret: number): HighlightedNoteInfo | null => {
    const noteAtPosition = getNoteAtPosition(stringIndex, fret);
    
    // First, check if there's a direct match with the highlightedNote prop (for backward compatibility)
    if (highlightedNote && noteAtPosition === highlightedNote) {
      return { note: noteAtPosition, color: '#328647', label: 'Root' };
    }
    
    // Check manually specified highlighted notes
    for (const noteInfo of highlightedNotes) {
      if (noteAtPosition === noteInfo.note) {
        return noteInfo;
      }
    }
    
    // Check for interval-based highlights
    const intervalBasedNotes = getIntervalNotes();
    for (const noteInfo of intervalBasedNotes) {
      if (noteAtPosition === noteInfo.note) {
        return noteInfo;
      }
    }
    
    return null;
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
    <>
      <div className="fretboard-container">
        {showIntervalSelector && (
          <Collapsible title={`See more intervals`}>
            <div className="interval-selector">
              {intervals.map((interval, index) => (
                <label key={interval.name} className="interval-checkbox">
                  <input
                    type="checkbox"
                    checked={interval.selected}
                    onChange={() => toggleInterval(index)}
                  />
                  <span style={{ color: interval.color }}>{interval.name}</span>
                </label>
              ))}
            </div>
            
              <div className="interval-legend">
                <div className="interval-item">
                  <span className="interval-color" style={{ backgroundColor: '#328647' }}></span>
                  <span>Root</span>
                </div>
                {intervals.filter(i => i.selected).map(interval => (
                  <div key={interval.name} className="interval-item">
                    <span className="interval-color" style={{ backgroundColor: interval.color }}></span>
                    <span>{interval.name}</span>
                  </div>
                ))}
              </div>
          </Collapsible>
        )}
        
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
                  {Array.from({ length: maxFret + 1 }).map((_, fretIndex) => {
                    const highlightInfo = getHighlightInfo(stringIndex, fretIndex);
                    return (
                      <div 
                        key={`fret-${fretIndex}`} 
                        className={`fret ${highlightInfo ? 'highlighted' : ''}`}
                      >
                        <div 
                          className="note-marker"
                          style={{
                            backgroundColor: highlightInfo ? highlightInfo.color : 'transparent',
                            color: highlightInfo ? 'white' : 'inherit',
                            boxShadow: highlightInfo ? '0 0 4px rgba(0, 0, 0, 0.3)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {highlightInfo && (
                            <div className="note-name">
                              {getNoteAtPosition(stringIndex, fretIndex)}
                              {/* {highlightInfo.label && (
                                <span className="note-label">{highlightInfo.label}</span>
                              )} */}
                            </div>
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
                    );
                  })}
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
      <br/>
    </>
  );
};

export default FretboardDisplay; 