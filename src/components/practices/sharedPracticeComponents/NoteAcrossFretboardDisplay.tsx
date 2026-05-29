import { FC, useMemo, useState } from 'react';
import FretboardDisplay, { HighlightedNoteInfo } from './FretboardDisplay';
import PracticeToolCard from './PracticeToolCard';
import { ROOT_INTERVAL_COLOR } from './fretboardConstants';
import { useMapFretboard } from './hooks/useMapFretboard';

/** A through G with sharps (no enharmonic flats — matches string-note tool) */
const NOTE_PICKER_OPTIONS = [
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
] as const;

type PickableNote = (typeof NOTE_PICKER_OPTIONS)[number];

const DEFAULT_HEADING = 'Find one note across the fretboard';

interface NoteAcrossFretboardDisplayProps {
  maxFret?: number;
  heading?: string;
}

const NoteAcrossFretboardDisplay: FC<NoteAcrossFretboardDisplayProps> = ({
  maxFret = 12,
  heading = DEFAULT_HEADING,
}) => {
  const { findAllPositionsOfNote } = useMapFretboard(maxFret);
  const [selectedNote, setSelectedNote] = useState<PickableNote>('A');

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    return findAllPositionsOfNote(selectedNote).map(({ string, fret }) => ({
      note: selectedNote,
      string,
      fret,
      color: ROOT_INTERVAL_COLOR,
      variant: 'interval' as const,
      label: selectedNote,
    }));
  }, [findAllPositionsOfNote, selectedNote]);

  return (
    <PracticeToolCard
      heading={heading}
      title={`Every ${selectedNote} on the neck`}
      description="Pick one note at a time and learn where it appears on every string. Start with natural notes, then add sharps."
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
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m4.93 19.07 1.41-1.41" />
          <path d="m17.66 6.34 1.41-1.41" />
        </svg>
      }
      actions={
        <div className="flex flex-wrap gap-2">
          {NOTE_PICKER_OPTIONS.map((note) => (
            <button
              key={note}
              type="button"
              aria-pressed={selectedNote === note}
              onClick={() => setSelectedNote(note)}
              className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors shadow h-9 min-w-[2.5rem] px-3 cursor-pointer ${
                selectedNote === note
                  ? 'text-stone-50 bg-amber-900 hover:bg-amber-800'
                  : 'text-stone-50 bg-zinc-700 hover:bg-zinc-600 border border-stone-50/20'
              }`}
            >
              {note}
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

export default NoteAcrossFretboardDisplay;
