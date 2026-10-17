import { FC } from 'react';
import {
  Accidental,
  accidentalAvailable,
  displayRoot,
  Key,
  NATURAL_LETTERS,
  ScaleViewId,
  scaleViewLabel,
  spellScale,
} from '../../../assets/practiceAssets/keys';

const DEFAULT_HEADING = 'Choose or randomize a key';

const choiceButtonClass = (isSelected: boolean) =>
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer ${
    isSelected
      ? 'bg-amber-900 text-stone-50 shadow'
      : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
  }`;

interface KeyDisplayProps {
  currentKey: Key | null;
  letter: string;
  accidental: Accidental;
  scaleView: ScaleViewId;
  showAllNotes: boolean;
  noteSpelling: 'sharp' | 'flat';
  onLetterChange: (letter: string) => void;
  onAccidentalChange: (accidental: Accidental) => void;
  onNoteSpellingChange: (spelling: 'sharp' | 'flat') => void;
  onScaleViewChange: (scale: ScaleViewId) => void;
  onShowAllNotesChange: (show: boolean) => void;
  onRegenerateKey: () => void;
  heading?: string;
  /** Major / minor row for practices that have no fretboard scale buttons. */
  showQuality?: boolean;
}

const ACCIDENTALS: { id: Accidental; label: string }[] = [
  { id: 'natural', label: 'Natural' },
  { id: 'sharp', label: 'Sharp' },
  { id: 'flat', label: 'Flat' },
];

const KeyDisplay: FC<KeyDisplayProps> = ({
  currentKey,
  letter,
  accidental,
  scaleView,
  showAllNotes,
  noteSpelling,
  onLetterChange,
  onAccidentalChange,
  onNoteSpellingChange,
  onScaleViewChange,
  onShowAllNotesChange,
  onRegenerateKey,
  heading = DEFAULT_HEADING,
  showQuality = false,
}) => {
  if (!currentKey) return null;

  const quality = currentKey.quality === 'minor' ? 'minor' : 'major';
  const summary = showAllNotes
    ? noteSpelling === 'flat'
      ? 'Every note, written with flats'
      : 'Every note, written with sharps'
    : `${displayRoot(letter, accidental)} ${scaleViewLabel(scaleView)} · ${spellScale(
        letter,
        accidental,
        scaleView
      )
        .map((note) => note.spelled)
        .join(', ')}`;

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-bold text-amber-900">{heading}</h2>

      <div className="space-y-6 rounded-lg border border-amber-800/40 bg-white p-5 shadow-sm md:p-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-amber-900">Notes</h3>
          <button
            type="button"
            aria-pressed={showAllNotes}
            onClick={() => onShowAllNotesChange(!showAllNotes)}
            className={choiceButtonClass(showAllNotes)}
          >
            Show all notes
          </button>
        </div>

        <div className={`space-y-2 ${showAllNotes ? 'opacity-40' : ''}`}>
          <h3 className="text-sm font-semibold text-amber-900">Letter</h3>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Letter">
            {NATURAL_LETTERS.map((noteLetter) => {
              const isSelected = !showAllNotes && letter === noteLetter;
              return (
                <button
                  key={noteLetter}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={showAllNotes}
                  onClick={() => onLetterChange(noteLetter)}
                  className={`${choiceButtonClass(isSelected)} disabled:cursor-not-allowed`}
                >
                  {noteLetter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-amber-900">Accidentals</h3>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Accidentals">
            {(showAllNotes ? ACCIDENTALS.filter((option) => option.id !== 'natural') : ACCIDENTALS).map(
              (option) => {
                const available = showAllNotes || accidentalAvailable(letter, option.id);
                const isSelected = showAllNotes
                  ? noteSpelling === option.id
                  : accidental === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!available}
                    onClick={() => {
                      if (showAllNotes) {
                        if (option.id === 'sharp' || option.id === 'flat') {
                          onNoteSpellingChange(option.id);
                        }
                        return;
                      }
                      onAccidentalChange(option.id);
                    }}
                    className={`${choiceButtonClass(isSelected)} disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {option.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {showQuality && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">Scale</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Scale">
              {(
                [
                  { id: 'major' as const, label: 'Major' },
                  { id: 'minor' as const, label: 'Minor' },
                ]
              ).map((option) => {
                const isSelected = !showAllNotes && quality === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={showAllNotes}
                    onClick={() => onScaleViewChange(option.id)}
                    className={`${choiceButtonClass(isSelected)} disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-amber-800/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-amber-900">{summary}</p>
          <button
            type="button"
            onClick={onRegenerateKey}
            className={`${choiceButtonClass(false)} shrink-0`}
          >
            Randomize
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyDisplay;
