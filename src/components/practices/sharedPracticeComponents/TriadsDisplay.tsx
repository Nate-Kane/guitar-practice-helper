import { FC, useEffect, useMemo, useState } from 'react';
import { Key } from '../../../assets/practiceAssets/keys';
import { getDiatonicTriadsForKey } from './diatonicTriads';
import FretboardDisplay, { HighlightedNoteInfo } from './FretboardDisplay';
import {
  DARK_ROSEWOOD_LABEL_TEXT,
  MAJOR_THIRD_INTERVAL_COLOR,
  MINOR_THIRD_INTERVAL_COLOR,
  PERFECT_FIFTH_INTERVAL_COLOR,
  ROOT_INTERVAL_COLOR,
  TRIAD_STRING_SETS,
  TriadStringSetId,
} from './fretboardConstants';
import { useMapFretboard } from './hooks/useMapFretboard';
import { findTriadVoicings } from './triadVoicings';
import { TriadQuality } from './triadShapeTemplates';

interface TriadsDisplayProps {
  currentKey: Key;
  maxFret?: number;
}

const TriadsDisplay: FC<TriadsDisplayProps> = ({ currentKey, maxFret = 12 }) => {
  const { findAllPositionsOfNote, getNoteAt } = useMapFretboard(maxFret);
  const triads = useMemo(() => getDiatonicTriadsForKey(currentKey), [currentKey]);
  const [selectedTriadRoot, setSelectedTriadRoot] = useState<string | null>(null);
  const [selectedStringSet, setSelectedStringSet] = useState<TriadStringSetId>('gbe');

  useEffect(() => {
    setSelectedTriadRoot(triads[0]?.root ?? null);
  }, [currentKey, triads]);

  const selectedTriad =
    triads.find((t) => t.root === selectedTriadRoot) ?? triads[0] ?? null;

  const staticIntervalLegend = useMemo(() => {
    const thirdName = currentKey.quality === 'major' ? 'Major 3' : 'Minor 3';
    const thirdColor =
      currentKey.quality === 'major'
        ? MAJOR_THIRD_INTERVAL_COLOR
        : MINOR_THIRD_INTERVAL_COLOR;

    return [
      { name: 'Root', color: ROOT_INTERVAL_COLOR },
      { name: thirdName, color: thirdColor },
      { name: 'Perfect 5', color: PERFECT_FIFTH_INTERVAL_COLOR },
    ];
  }, [currentKey.quality]);

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    if (!selectedTriad) return [];

    const thirdColor =
      currentKey.quality === 'major'
        ? MAJOR_THIRD_INTERVAL_COLOR
        : MINOR_THIRD_INTERVAL_COLOR;
    const thirdLabel = currentKey.quality === 'major' ? 'M3' : 'm3';

    const triadNoteSpecs = [
      {
        note: selectedTriad.notes[0],
        color: ROOT_INTERVAL_COLOR,
        label: 'Root',
      },
      {
        note: selectedTriad.notes[1],
        color: thirdColor,
        label: thirdLabel,
      },
      {
        note: selectedTriad.notes[2],
        color: PERFECT_FIFTH_INTERVAL_COLOR,
        label: 'P5',
      },
    ];

    if (selectedStringSet === 'all') {
      return triadNoteSpecs.map((spec) => ({
        ...spec,
        variant: 'interval' as const,
      }));
    }

    const allowedStrings =
      TRIAD_STRING_SETS.find((set) => set.id === selectedStringSet)?.strings ?? [];

    return triadNoteSpecs.flatMap((spec) =>
      findAllPositionsOfNote(spec.note)
        .filter((position) => allowedStrings.includes(position.string))
        .map((position) => ({
          note: spec.note,
          color: spec.color,
          label: spec.label,
          variant: 'interval' as const,
          string: position.string,
          fret: position.fret,
        }))
    );
  }, [selectedTriad, currentKey.quality, selectedStringSet, findAllPositionsOfNote]);

  const triadGroupings = useMemo(() => {
    if (!selectedTriad || selectedStringSet === 'all') return [];

    const stringSet =
      TRIAD_STRING_SETS.find((set) => set.id === selectedStringSet) ?? null;

    if (!stringSet) return [];

    return findTriadVoicings(
      selectedTriad.notes,
      selectedStringSet,
      currentKey.quality as TriadQuality,
      stringSet.strings,
      (string, fret) => getNoteAt(string, fret)?.note,
      maxFret
    );
  }, [selectedTriad, selectedStringSet, currentKey.quality, getNoteAt, maxFret]);

  if (triads.length === 0) {
    return (
      <p className="text-amber-800">No diatonic triads found for this key.</p>
    );
  }

  const romanNumerals =
    currentKey.quality === 'major' ? 'I, IV, and V' : 'i, iv, and v';
  const triadNamesList = triads.map((t) => t.name).join(', ');

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-bold text-amber-900">
        Choose a triad to visualize
      </h2>

      <div className="space-y-3 text-amber-800 text-sm md:text-base max-w-3xl">
        <p>
          Let's focus on the{' '}
          <span className="font-semibold">{romanNumerals}</span> chords — the classic{' '}
          <span className="font-semibold">1-4-5</span>. These three triads are the staples for finding your way around the neck.
        </p>
        <p>
        In the key of <span className="font-semibold">{currentKey.name}</span>, that means <span className="font-semibold">{triadNamesList}</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {triads.map((triad) => {
          const isSelected = selectedTriad?.root === triad.root;
          return (
            <button
              key={triad.root}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedTriadRoot(triad.root)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer ${
                isSelected
                  ? 'bg-amber-900 text-stone-50 shadow'
                  : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
              }`}
            >
              {triad.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-bold text-amber-900">String set</h3>
        <p className="text-amber-800 text-sm md:text-base max-w-3xl">
          Triads are easiest to learn in string sets - a group of three strings (one for each note in a triad). Choose one set to focus on at a time. Each highlight wraps one close-position triad shape on the neck.
        </p>
        <div className="flex flex-wrap gap-2">
          {TRIAD_STRING_SETS.map((stringSet) => {
            const isSelected = selectedStringSet === stringSet.id;
            return (
              <button
                key={stringSet.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedStringSet(stringSet.id)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-900 text-stone-50 shadow'
                    : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
                }`}
              >
                {stringSet.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedTriad && (
        <FretboardDisplay
          maxFret={maxFret}
          highlightedNotes={highlightedNotes}
          triadGroupings={triadGroupings}
          disableKeyHighlights
          showOpenStringLabels={false}
          staticIntervalLegend={staticIntervalLegend}
          mutedFretLabels
          fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT}
        />
      )}
    </div>
  );
};

export default TriadsDisplay;
