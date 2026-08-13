import { FC, useMemo, useState } from 'react';
import FretboardDisplay, {
  HighlightedNoteInfo,
} from '../sharedPracticeComponents/FretboardDisplay';
import {
  CHROMATIC_NOTES,
  DARK_ROSEWOOD_LABEL_TEXT,
  MAJOR_THIRD_INTERVAL_COLOR,
  PERFECT_FIFTH_INTERVAL_COLOR,
  ROOT_INTERVAL_COLOR,
} from '../sharedPracticeComponents/fretboardConstants';

/** The five CAGED open-chord shapes — always treated as major triads */
const CAGED_CHORDS = ['C', 'A', 'G', 'E', 'D'] as const;
type CagedChord = (typeof CAGED_CHORDS)[number];

/** Shape 1 = C shape, 2 = A, 3 = G, 4 = E, 5 = D */
const CAGED_SHAPES = [1, 2, 3, 4, 5] as const;
type CagedShape = (typeof CAGED_SHAPES)[number];

const MAJOR_TRIAD_SEMITONES = [0, 4, 7] as const;

const noteAtInterval = (root: string, semitones: number): string => {
  const rootIndex = CHROMATIC_NOTES.indexOf(
    root as (typeof CHROMATIC_NOTES)[number]
  );
  if (rootIndex === -1) return root;
  return CHROMATIC_NOTES[(rootIndex + semitones) % 12];
};

const getMajorTriadNotes = (root: CagedChord): [string, string, string] => [
  noteAtInterval(root, MAJOR_TRIAD_SEMITONES[0]),
  noteAtInterval(root, MAJOR_TRIAD_SEMITONES[1]),
  noteAtInterval(root, MAJOR_TRIAD_SEMITONES[2]),
];

const STATIC_INTERVAL_LEGEND = [
  { name: 'Root', color: ROOT_INTERVAL_COLOR },
  { name: 'Major 3', color: MAJOR_THIRD_INTERVAL_COLOR },
  { name: 'Perfect 5', color: PERFECT_FIFTH_INTERVAL_COLOR },
];

interface CagedDisplayProps {
  maxFret?: number;
}

const CagedDisplay: FC<CagedDisplayProps> = ({ maxFret = 15 }) => {
  const [selectedChord, setSelectedChord] = useState<CagedChord>('C');
  const [selectedShape, setSelectedShape] = useState<CagedShape>(1);

  const triadNotes = useMemo(
    () => getMajorTriadNotes(selectedChord),
    [selectedChord]
  );

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    const [root, majorThird, perfectFifth] = triadNotes;

    return [
      {
        note: root,
        color: ROOT_INTERVAL_COLOR,
        label: 'Root',
        variant: 'interval',
      },
      {
        note: majorThird,
        color: MAJOR_THIRD_INTERVAL_COLOR,
        label: 'M3',
        variant: 'interval',
      },
      {
        note: perfectFifth,
        color: PERFECT_FIFTH_INTERVAL_COLOR,
        label: 'P5',
        variant: 'interval',
      },
    ];
  }, [triadNotes]);

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-bold text-amber-900">Choose a CAGED chord</h2>

      <div className="flex flex-wrap gap-2">
        {CAGED_CHORDS.map((chord) => {
          const isSelected = selectedChord === chord;
          return (
            <button
              key={chord}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedChord(chord)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer ${
                isSelected
                  ? 'bg-amber-900 text-stone-50 shadow'
                  : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
              }`}
            >
              {chord}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-bold text-amber-900">Highlight shape</h3>
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="CAGED shape"
        >
          {CAGED_SHAPES.map((shape) => {
            const isSelected = selectedShape === shape;
            return (
              <button
                key={shape}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedShape(shape)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 min-w-9 px-4 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-900 text-stone-50 shadow'
                    : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
                }`}
              >
                {shape}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 text-amber-800 text-base font-bold md:text-base max-w-3xl">
        <p>
          Highlighting{' '}
          <span className="font-semibold">{selectedChord} major</span> (
          {triadNotes.join(', ')}), shape{' '}
          <span className="font-semibold">{selectedShape}</span>.
        </p>
      </div>

      <FretboardDisplay
        maxFret={maxFret}
        highlightedNotes={highlightedNotes}
        disableKeyHighlights
        showOpenStringLabels={false}
        staticIntervalLegend={STATIC_INTERVAL_LEGEND}
        mutedFretLabels
        fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT}
      />
    </div>
  );
};

export default CagedDisplay;
