import { FC, ReactNode, useMemo, useState } from 'react';
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
import { useMapFretboard } from '../sharedPracticeComponents/hooks/useMapFretboard';
import {
  getAllCagedShapePositions,
  getCagedShapePositions,
  positionKey,
} from './cagedShapes';

/** The five CAGED open-chord shapes — always treated as major triads */
const CAGED_CHORDS = ['C', 'A', 'G', 'E', 'D'] as const;
type CagedChord = (typeof CAGED_CHORDS)[number];

/** Shape 1 = C shape … 5 = D shape; 'all' last */
const CAGED_SHAPE_OPTIONS = [1, 2, 3, 4, 5, 'all'] as const;
type CagedShapeSelection = (typeof CAGED_SHAPE_OPTIONS)[number];
type CagedShapeNumber = 1 | 2 | 3 | 4 | 5;

/** Which open major chord each numbered shape looks like */
const SHAPE_LOOKS_LIKE: Record<CagedShapeNumber, CagedChord> = {
  1: 'C',
  2: 'A',
  3: 'G',
  4: 'E',
  5: 'D',
};

/** Native open-chord shape for each CAGED chord (C→1, A→2, …) */
const CHORD_NATIVE_SHAPE: Record<CagedChord, CagedShapeNumber> = {
  C: 1,
  A: 2,
  G: 3,
  E: 4,
  D: 5,
};

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

const getHighlightSummary = (
  chord: CagedChord,
  shape: CagedShapeSelection
): { title: ReactNode; detail?: ReactNode } => {
  if (shape === 'all') {
    return {
      title: (
        <span className="font-bold">
          Highlighting all five shapes of {chord} major.
        </span>
      ),
    };
  }

  // Open C→shape 1, open A→shape 2, etc.
  if (CHORD_NATIVE_SHAPE[chord] === shape) {
    return {
      title: (
        <span className="font-bold">
          The open {chord} major chord uses shape {shape}.
        </span>
      ),
      detail: (
        <>
          <span className="block mb-4">
            Notice how this shape is also repeated at the 12th fret.
          </span>
        </>
      ),
    };
  }

  const openLookalike = SHAPE_LOOKS_LIKE[shape];
  return {
    title: (
      <span className="font-bold">
        Highlighting {chord} major — shape {shape}.
      </span>
    ),
    detail: (
      <>
        Notice how this resembles the{' '}
        <span className="font-bold">open {openLookalike} major chord</span> (which also uses shape {shape}). 
        <br/>
        <span className="font-bold">{chord} major in position {shape}</span> (i.e., shape {shape}) and <span className="font-bold">open{' '}
        {openLookalike}</span> major <span className="font-bold">both use shape {shape}</span>.
      </>
    ),
  };
};

interface CagedDisplayProps {
  maxFret?: number;
}

const CagedDisplay: FC<CagedDisplayProps> = ({ maxFret = 15 }) => {
  const [selectedChord, setSelectedChord] = useState<CagedChord>('C');
  const [selectedShape, setSelectedShape] =
    useState<CagedShapeSelection>(1);
  const { findAllPositionsOfNote } = useMapFretboard(maxFret);

  const triadNotes = useMemo(
    () => getMajorTriadNotes(selectedChord),
    [selectedChord]
  );

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    const [root, majorThird, perfectFifth] = triadNotes;

    const intervalSpecs = [
      { note: root, color: ROOT_INTERVAL_COLOR, label: 'Root' },
      { note: majorThird, color: MAJOR_THIRD_INTERVAL_COLOR, label: 'M3' },
      { note: perfectFifth, color: PERFECT_FIFTH_INTERVAL_COLOR, label: 'P5' },
    ] as const;

    const shapePositions =
      selectedShape === 'all'
        ? getAllCagedShapePositions(root, findAllPositionsOfNote, maxFret)
        : getCagedShapePositions(
            selectedShape,
            root,
            findAllPositionsOfNote,
            maxFret
          );

    const shapePositionKeys = shapePositions
      ? new Set(shapePositions.map(positionKey))
      : null;

    return intervalSpecs.flatMap((spec) =>
      findAllPositionsOfNote(spec.note).map((position) => {
        const key = positionKey(position);
        const emphasis = shapePositionKeys
          ? shapePositionKeys.has(key)
            ? ('shape' as const)
            : ('context' as const)
          : undefined;

        return {
          note: spec.note,
          color: spec.color,
          label: spec.label,
          variant: 'interval' as const,
          string: position.string,
          fret: position.fret,
          emphasis,
        };
      })
    );
  }, [triadNotes, selectedShape, findAllPositionsOfNote, maxFret]);

  const highlightSummary = getHighlightSummary(selectedChord, selectedShape);

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-amber-900">
            Choose a CAGED chord
          </h2>
          <p className="text-amber-800 text-sm md:text-base max-w-3xl">
            Choose which chord to see mapped{' '}
            across the fretboard (currently viewing{' '}
            <span className="font-semibold">{selectedChord} major</span>)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CAGED_CHORDS.map((chord) => {
            const isSelected = selectedChord === chord;
            return (
              <button
                key={chord}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedChord(chord);
                  setSelectedShape(CHORD_NATIVE_SHAPE[chord]);
                }}
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
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-amber-900">Choose a shape to highlight</h2>
          {/*<ul className="list-disc pl-5 space-y-1.5 text-amber-800 text-sm md:text-base max-w-3xl">
            <li>
              Shape 1 looks like an open C major. Shape 2 like an open A, and so
              on (3 → G, 4 → E, 5 → D).
            </li>
            <li>
              Reverse that thinking: An open C major <span className="font-semibold">uses</span>{' '}
              shape 1. An open A major <span className="font-semibold">uses</span> shape 2, and so on.
            </li>
          </ul>*/}
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="CAGED shape"
        >
          {CAGED_SHAPE_OPTIONS.map((shape) => {
            const isSelected = selectedShape === shape;
            const label = shape === 'all' ? 'All' : shape;
            return (
              <button
                key={String(shape)}
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
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="max-w-3xl space-y-2 text-left">
          <p className="text-amber-900 text-lg md:text-xl leading-snug">
            {highlightSummary.title}
          </p>
          {highlightSummary.detail && (
            <p className="text-amber-800 text-sm md:text-base leading-relaxed font-normal">
              {highlightSummary.detail}
            </p>
          )}
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
    </div>
  );
};

export default CagedDisplay;
