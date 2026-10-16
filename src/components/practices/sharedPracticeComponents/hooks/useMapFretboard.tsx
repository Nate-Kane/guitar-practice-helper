import { useCallback, useMemo } from 'react';
import { GUITAR_INSTRUMENT } from '../fretboardConstants';

type FretboardNote = {
  string: number;
  fret: number;
  note: string;
};

const DEFAULT_OPEN_STRINGS = GUITAR_INSTRUMENT.strings.map((string) => string.openNote);

/**
 * Map every note on a fretboard.
 * String 0 is the lowest course. Guitar default is E A D G B E.
 * Pass `openStringNotes` (low to high) for another instrument, such as mandolin G D A E.
 * Fret 0 is the open string.
 */
export const useMapFretboard = (
  maxFret: number = 12,
  openStringNotes: readonly string[] = DEFAULT_OPEN_STRINGS
) => {
  const tuningKey = openStringNotes.join(',');

  const fretboardMap = useMemo(() => {
    const tuning = tuningKey.split(',');

    // All chromatic notes in order
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Map the entire fretboard
    const map: FretboardNote[] = [];
    
    for (let stringNum = 0; stringNum < tuning.length; stringNum++) {
      const openNote = tuning[stringNum];
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
  }, [maxFret, tuningKey]);

  const getNoteAt = useCallback(
    (string: number, fret: number) =>
      fretboardMap.find((note) => note.string === string && note.fret === fret),
    [fretboardMap]
  );

  const findAllPositionsOfNote = useCallback(
    (noteName: string) => fretboardMap.filter((note) => note.note === noteName),
    [fretboardMap]
  );

  return {
    fretboardMap,
    getNoteAt,
    findAllPositionsOfNote
  };
};

export default useMapFretboard;
