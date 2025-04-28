import { useMemo } from 'react';

type FretboardNote = {
  string: number;
  fret: number;
  note: string;
};

/**
 * Hook to map out all notes on a guitar fretboard in standard tuning
 * string numbers: 0 (high E) to 5 (low E)
 * fret numbers: 0 (open) to maxFret
 */
export const useMapFretboard = (maxFret: number = 12) => {
  const fretboardMap = useMemo(() => {
    // Standard tuning - open strings (low to high: E, A, D, G, B, E)
    const openStringNotes = ['E', 'A', 'D', 'G', 'B', 'E'];
    
    // All chromatic notes in order
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Map the entire fretboard
    const map: FretboardNote[] = [];
    
    for (let stringNum = 0; stringNum < 6; stringNum++) {
      const openNote = openStringNotes[stringNum];
      const openNoteIndex = allNotes.indexOf(openNote);
      
      // Add the open string note
      map.push({
        string: stringNum,
        fret: 0,
        note: openNote
      });
      
      // Add all fretted notes
      for (let fret = 1; fret <= maxFret; fret++) {
        const noteIndex = (openNoteIndex + fret) % 12;
        map.push({
          string: stringNum,
          fret,
          note: allNotes[noteIndex]
        });
      }
    }
    
    return map;
  }, [maxFret]);

  // Helper to get a specific note
  const getNoteAt = (string: number, fret: number) => {
    return fretboardMap.find(
      note => note.string === string && note.fret === fret
    );
  };

  // Helper to find all instances of a particular note
  const findAllPositionsOfNote = (noteName: string) => {
    return fretboardMap.filter(note => note.note === noteName);
  };

  return {
    fretboardMap,
    getNoteAt,
    findAllPositionsOfNote
  };
};

export default useMapFretboard;
