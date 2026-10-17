import { FC, useEffect, useMemo, useState } from 'react';
import { Key, Accidental, displayRoot, spellScale } from '../../../assets/practiceAssets/keys';
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

const choiceButtonClass = (isSelected: boolean) =>
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer disabled:cursor-not-allowed ${
    isSelected
      ? 'bg-amber-900 text-stone-50 shadow'
      : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
  }`;

interface TriadsDisplayProps {
  currentKey: Key;
  letter: string;
  accidental: Accidental;
  showAllNotes?: boolean;
  noteSpelling?: 'sharp' | 'flat';
  maxFret?: number;
}

const TriadsDisplay: FC<TriadsDisplayProps> = ({
  currentKey,
  letter,
  accidental,
  showAllNotes = false,
  noteSpelling = 'sharp',
  maxFret = 12,
}) => {
  const { findAllPositionsOfNote, getNoteAt } = useMapFretboard(maxFret);
  const triads = useMemo(() => getDiatonicTriadsForKey(currentKey), [currentKey]);
  const [selectedTriadRoot, setSelectedTriadRoot] = useState<string | null>(null);
  const [selectedStringSet, setSelectedStringSet] = useState<TriadStringSetId>('gbe');

  useEffect(() => {
    setSelectedTriadRoot(triads[0]?.root ?? null);
  }, [currentKey, triads]);

  const spelledScale = useMemo(
    () => spellScale(letter, accidental, currentKey.quality === 'minor' ? 'minor' : 'major'),
    [letter, accidental, currentKey.quality]
  );

  const spellNote = (canonical: string) =>
    spelledScale.find((note) => note.canonical === canonical)?.spelled ?? canonical;

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

  const triadNames = triads.map((triad) => spellNote(triad.root));
  const triadList =
    triadNames.length === 3
      ? `${triadNames[0]}, ${triadNames[1]}, and ${triadNames[2]}`
      : triadNames.join(', ');
  const keyName = `${displayRoot(letter, accidental)} ${currentKey.quality}`;

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-amber-900">Choose a triad</h2>

        <div
          className={`space-y-6 rounded-lg border border-amber-800/40 bg-white p-5 shadow-sm md:p-6 ${
            showAllNotes ? 'opacity-40' : ''
          }`}
        >
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">Triad</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Triad">
              {triads.map((triad) => {
                const isSelected = !showAllNotes && selectedTriad?.root === triad.root;
                return (
                  <button
                    key={triad.root}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={showAllNotes}
                    onClick={() => setSelectedTriadRoot(triad.root)}
                    className={`${choiceButtonClass(isSelected)} disabled:opacity-40`}
                  >
                    {spellNote(triad.root)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">String set</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="String set">
              {TRIAD_STRING_SETS.map((stringSet) => {
                const isSelected = !showAllNotes && selectedStringSet === stringSet.id;
                return (
                  <button
                    key={stringSet.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={showAllNotes}
                    onClick={() => setSelectedStringSet(stringSet.id)}
                    className={`${choiceButtonClass(isSelected)} disabled:opacity-40`}
                  >
                    {stringSet.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-amber-800/20 pt-4">
            <p className="font-semibold text-amber-900">
              {keyName} · {triadList}
            </p>
          </div>
        </div>
      </div>

      {selectedTriad && (
        <FretboardDisplay
          maxFret={maxFret}
          highlightedNotes={highlightedNotes}
          triadGroupings={triadGroupings}
          disableKeyHighlights
          showOpenStringLabels={false}
          showAllNotes={showAllNotes}
          accidental={showAllNotes ? noteSpelling : accidental}
          rootLetter={letter}
          staticIntervalLegend={staticIntervalLegend}
          mutedFretLabels
          fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT}
        />
      )}
    </div>
  );
};

export default TriadsDisplay;
