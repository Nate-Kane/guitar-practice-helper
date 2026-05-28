import { FC, useMemo, useState } from 'react';
import FretboardDisplay, { HighlightedNoteInfo } from './FretboardDisplay';
import PracticeToolCard from './PracticeToolCard';
import { GUITAR_STRINGS, PERFECT_FIFTH_INTERVAL_COLOR } from './fretboardConstants';
import { useMapFretboard } from './hooks/useMapFretboard';

const DEFAULT_HEADING = 'Explore a single string';

interface StringNotesDisplayProps {
  maxFret?: number;
  heading?: string;
}

const StringNotesDisplay: FC<StringNotesDisplayProps> = ({
  maxFret = 12,
  heading = DEFAULT_HEADING,
}) => {
  const { getNoteAt } = useMapFretboard(maxFret);
  const [selectedStringIndex, setSelectedStringIndex] = useState<number>(GUITAR_STRINGS[0].index);

  const selectedString = GUITAR_STRINGS.find((s) => s.index === selectedStringIndex)!;

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    return Array.from({ length: maxFret + 1 }, (_, fret) => {
      const note = getNoteAt(selectedStringIndex, fret)?.note ?? '';
      return {
        note,
        string: selectedStringIndex,
        fret,
        color: PERFECT_FIFTH_INTERVAL_COLOR,
        variant: 'interval',
        label: note,
      };
    });
  }, [getNoteAt, maxFret, selectedStringIndex]);

  return (
    <PracticeToolCard
      heading={heading}
      title={`Notes on the ${selectedString.displayName} string`}
      description="Start with the Low E string, then move to the A string. Learn the main notes such as E, F, and G before learning the in-between notes such as F# and G#"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M4 6h16" />
          <path d="M4 12h10" />
          <path d="M4 18h14" />
        </svg>
      }
      actions={
        <div className="flex flex-wrap gap-2">
          {GUITAR_STRINGS.map((string) => (
            <button
              key={string.index}
              type="button"
              aria-pressed={selectedStringIndex === string.index}
              onClick={() => setSelectedStringIndex(string.index)}
              className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors shadow h-9 px-3 cursor-pointer ${
                selectedStringIndex === string.index
                  ? 'text-stone-50 bg-amber-900 hover:bg-amber-800'
                  : 'text-stone-50 bg-zinc-700 hover:bg-zinc-600 border border-stone-50/20'
              }`}
            >
              {string.displayName}
            </button>
          ))}
        </div>
      }
    >
      <FretboardDisplay
        maxFret={maxFret}
        highlightedNotes={highlightedNotes}
        disableKeyHighlights
        showOpenStringLabels={false}
        mutedFretLabels
      />
    </PracticeToolCard>
  );
};

export default StringNotesDisplay;
