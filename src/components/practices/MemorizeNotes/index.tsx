import { FC, useMemo, useState } from 'react';
import {
  Accidental,
  accidentalAvailable,
  displayRoot,
  NATURAL_LETTERS,
  spellChromatic,
  toCanonicalNote,
} from '../../../assets/practiceAssets/keys';
import FretboardDisplay, { HighlightedNoteInfo } from '../sharedPracticeComponents/FretboardDisplay';
import {
  DARK_ROSEWOOD_LABEL_TEXT,
  FretboardInstrument,
  GUITAR_INSTRUMENT,
  PERFECT_FIFTH_INTERVAL_COLOR,
  ROOT_INTERVAL_COLOR,
} from '../sharedPracticeComponents/fretboardConstants';
import { useMapFretboard } from '../sharedPracticeComponents/hooks/useMapFretboard';

interface MemorizeNotesProps {
  instrument?: FretboardInstrument;
  maxFret?: number;
  heading?: string;
}

type ViewMode = 'all' | 'string' | 'note';

const VIEW_OPTIONS: { id: ViewMode; label: string }[] = [
  { id: 'all', label: 'All notes' },
  { id: 'string', label: 'One string' },
  { id: 'note', label: 'One note' },
];

const ACCIDENTALS: { id: Accidental; label: string }[] = [
  { id: 'natural', label: 'Natural' },
  { id: 'sharp', label: 'Sharp' },
  { id: 'flat', label: 'Flat' },
];

const choiceButtonClass = (isSelected: boolean) =>
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer disabled:cursor-not-allowed ${
    isSelected
      ? 'bg-amber-900 text-stone-50 shadow'
      : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
  }`;

const MemorizeNotes: FC<MemorizeNotesProps> = ({
  instrument = GUITAR_INSTRUMENT,
  maxFret = 12,
  heading = 'Memorize the notes',
}) => {
  const [view, setView] = useState<ViewMode>('string');
  const [stringIndex, setStringIndex] = useState(instrument.strings[0]?.index ?? 0);
  const [letter, setLetter] = useState('C');
  const [noteAccidental, setNoteAccidental] = useState<Accidental>('natural');
  const [spelling, setSpelling] = useState<'sharp' | 'flat'>('sharp');

  const openStringNotes = instrument.strings.map((string) => string.openNote);
  const { getNoteAt, findAllPositionsOfNote } = useMapFretboard(maxFret, openStringNotes);

  const selectedString =
    instrument.strings.find((string) => string.index === stringIndex) ?? instrument.strings[0];

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    if (view === 'all') return [];

    if (view === 'string') {
      return Array.from({ length: maxFret + 1 }, (_, fret) => {
        const note = getNoteAt(stringIndex, fret)?.note ?? '';
        return {
          note,
          string: stringIndex,
          fret,
          color: note.includes('#') ? PERFECT_FIFTH_INTERVAL_COLOR : ROOT_INTERVAL_COLOR,
          variant: 'interval' as const,
          displayNote: spellChromatic(note, spelling === 'flat'),
        };
      });
    }

    const canonical = toCanonicalNote(letter, noteAccidental);
    return findAllPositionsOfNote(canonical).map(({ string, fret }) => ({
      note: canonical,
      string,
      fret,
      color: ROOT_INTERVAL_COLOR,
      variant: 'interval' as const,
      displayNote: displayRoot(letter, noteAccidental),
    }));
  }, [view, stringIndex, letter, noteAccidental, spelling, getNoteAt, findAllPositionsOfNote]);

  const summary =
    view === 'all'
      ? spelling === 'flat'
        ? 'Every note, written with flats'
        : 'Every note, written with sharps'
      : view === 'string'
        ? `${selectedString.displayName} string`
        : `Every ${displayRoot(letter, noteAccidental)}`;

  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-amber-900">{heading}</h2>

        <div className="space-y-6 rounded-lg border border-amber-800/40 bg-white p-5 shadow-sm md:p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">View</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="View">
              {VIEW_OPTIONS.map((option) => {
                const isSelected = view === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setView(option.id)}
                    className={choiceButtonClass(isSelected)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {view === 'string' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-900">String</h3>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="String">
                {instrument.strings.map((string) => {
                  const isSelected = stringIndex === string.index;
                  return (
                    <button
                      key={string.index}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setStringIndex(string.index)}
                      className={choiceButtonClass(isSelected)}
                    >
                      {string.displayName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'note' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-900">Letter</h3>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Letter">
                {NATURAL_LETTERS.map((noteLetter) => {
                  const isSelected = letter === noteLetter;
                  return (
                    <button
                      key={noteLetter}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        setLetter(noteLetter);
                        if (!accidentalAvailable(noteLetter, noteAccidental)) {
                          setNoteAccidental('natural');
                        }
                      }}
                      className={choiceButtonClass(isSelected)}
                    >
                      {noteLetter}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">Accidentals</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Accidentals">
              {(view === 'note' ? ACCIDENTALS : ACCIDENTALS.filter((option) => option.id !== 'natural')).map(
                (option) => {
                  const available = view !== 'note' || accidentalAvailable(letter, option.id);
                  const isSelected =
                    view === 'note' ? noteAccidental === option.id : spelling === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={!available}
                      onClick={() => {
                        if (view === 'note') {
                          setNoteAccidental(option.id);
                          return;
                        }
                        if (option.id === 'sharp' || option.id === 'flat') {
                          setSpelling(option.id);
                        }
                      }}
                      className={`${choiceButtonClass(isSelected)} disabled:opacity-40`}
                    >
                      {option.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="border-t border-amber-800/20 pt-4">
            <p className="font-semibold text-amber-900">{summary}</p>
          </div>
        </div>
      </div>

      <FretboardDisplay
        instrument={instrument}
        maxFret={maxFret}
        highlightedNotes={highlightedNotes}
        disableKeyHighlights
        showAllNotes={view === 'all'}
        accidental={view === 'note' ? noteAccidental : spelling}
        showOpenStringLabels
        mutedFretLabels
        fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT}
      />
    </div>
  );
};

export default MemorizeNotes;
