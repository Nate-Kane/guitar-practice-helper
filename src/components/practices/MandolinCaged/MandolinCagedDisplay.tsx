import { FC, useMemo, useState } from 'react';
import FretboardDisplay, {
  HighlightedNoteInfo,
} from '../sharedPracticeComponents/FretboardDisplay';
import {
  CHROMATIC_NOTES,
  DARK_ROSEWOOD_LABEL_TEXT,
  MAJOR_THIRD_INTERVAL_COLOR,
  MANDOLIN_INSTRUMENT,
  PERFECT_FIFTH_INTERVAL_COLOR,
  ROOT_INTERVAL_COLOR,
} from '../sharedPracticeComponents/fretboardConstants';
import { useMapFretboard } from '../sharedPracticeComponents/hooks/useMapFretboard';
import {
  getAllMandolinCagedPositions,
  getMandolinCagedShapePositions,
  MandolinCagedShape,
  positionKey,
} from './mandolinCagedShapes';

/** The five open major shapes. Order is how they connect up the neck. */
const CAGED_CHORDS = ['C', 'A', 'G', 'E', 'D'] as const;
type CagedChord = (typeof CAGED_CHORDS)[number];

const SHAPE_OPTIONS = [...CAGED_CHORDS, 'all'] as const;
type ShapeSelection = (typeof SHAPE_OPTIONS)[number];

/** Open position of each chord is that letter's own shape. */
const CHORD_NATIVE_SHAPE: Record<CagedChord, MandolinCagedShape> = {
  C: 'C',
  A: 'A',
  G: 'G',
  E: 'E',
  D: 'D',
};

const MAJOR_TRIAD_SEMITONES = [0, 4, 7] as const;

const noteAtInterval = (root: string, semitones: number): string => {
  const rootIndex = CHROMATIC_NOTES.indexOf(root as (typeof CHROMATIC_NOTES)[number]);
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

const choiceButtonClass = (isSelected: boolean) =>
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer ${
    isSelected
      ? 'bg-amber-900 text-stone-50 shadow'
      : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
  }`;

const summaryFor = (chord: CagedChord, shape: ShapeSelection): string => {
  if (shape === 'all') return `${chord} major · all shapes`;
  if (CHORD_NATIVE_SHAPE[chord] === shape) return `Open ${chord} major`;
  return `${chord} major · ${shape} shape`;
};

interface MandolinCagedDisplayProps {
  maxFret?: number;
}

const OPEN_STRINGS = MANDOLIN_INSTRUMENT.strings.map((string) => string.openNote);

const MandolinCagedDisplay: FC<MandolinCagedDisplayProps> = ({ maxFret = 12 }) => {
  const [selectedChord, setSelectedChord] = useState<CagedChord>('C');
  const [selectedShape, setSelectedShape] = useState<ShapeSelection>('C');
  const { findAllPositionsOfNote } = useMapFretboard(maxFret, OPEN_STRINGS);

  const triadNotes = useMemo(() => getMajorTriadNotes(selectedChord), [selectedChord]);

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    const [root, majorThird, perfectFifth] = triadNotes;

    const intervalSpecs = [
      { note: root, color: ROOT_INTERVAL_COLOR, label: 'Root' },
      { note: majorThird, color: MAJOR_THIRD_INTERVAL_COLOR, label: 'M3' },
      { note: perfectFifth, color: PERFECT_FIFTH_INTERVAL_COLOR, label: 'P5' },
    ] as const;

    const shapePositions =
      selectedShape === 'all'
        ? getAllMandolinCagedPositions(root, findAllPositionsOfNote, maxFret)
        : getMandolinCagedShapePositions(
            selectedShape,
            root,
            findAllPositionsOfNote,
            maxFret
          );

    const shapePositionKeys = new Set(shapePositions.map(positionKey));

    return intervalSpecs.flatMap((spec) =>
      findAllPositionsOfNote(spec.note).map((position) => {
        const key = positionKey(position);
        return {
          note: spec.note,
          color: spec.color,
          label: spec.label,
          variant: 'interval' as const,
          string: position.string,
          fret: position.fret,
          emphasis: shapePositionKeys.has(key) ? ('shape' as const) : ('context' as const),
        };
      })
    );
  }, [triadNotes, selectedShape, findAllPositionsOfNote, maxFret]);

  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-amber-900">CAGED shapes</h2>
          <p className="text-amber-800 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
            The CAGED system is five simple chord shapes. Your open C major, A major, G major, E major, and D major chords are those shapes. The <span className="font-semibold">shape</span> determines the quality, such as major or minor. The <span className="font-semibold">root</span> determines the letter of the chord, such as A, B, or C.
          </p>
        </div>

        <div className="space-y-6 rounded-lg border border-amber-800/40 bg-white p-5 shadow-sm md:p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">Chord</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chord">
              {CAGED_CHORDS.map((chord) => {
                const isSelected = selectedChord === chord;
                return (
                  <button
                    key={chord}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedChord(chord);
                      setSelectedShape(CHORD_NATIVE_SHAPE[chord]);
                    }}
                    className={choiceButtonClass(isSelected)}
                  >
                    {chord}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">Shape</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Shape">
              {SHAPE_OPTIONS.map((shape) => {
                const isSelected = selectedShape === shape;
                const label = shape === 'all' ? 'All' : `${shape} shape`;
                return (
                  <button
                    key={shape}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedShape(shape)}
                    className={choiceButtonClass(isSelected)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-amber-800/20 pt-4">
            <p className="font-semibold text-amber-900">{summaryFor(selectedChord, selectedShape)}</p>
          </div>
        </div>
      </div>

      <FretboardDisplay
        instrument={MANDOLIN_INSTRUMENT}
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

export default MandolinCagedDisplay;
