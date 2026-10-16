import { FC, useMemo, useState } from 'react';
import FretboardDisplay, {
  HighlightedNoteInfo,
} from '../sharedPracticeComponents/FretboardDisplay';
import {
  DARK_ROSEWOOD_LABEL_TEXT,
  MAJOR_SEVENTH_INTERVAL_COLOR,
  MAJOR_THIRD_INTERVAL_COLOR,
  MINOR_SEVENTH_INTERVAL_COLOR,
  MINOR_THIRD_INTERVAL_COLOR,
  PERFECT_FIFTH_INTERVAL_COLOR,
  ROOT_INTERVAL_COLOR,
} from '../sharedPracticeComponents/fretboardConstants';
import {
  CHORD_QUALITIES,
  ChordDegree,
  ChordQualityId,
  DROP2_INVERSIONS,
  DROP2_STRING_SETS,
  DROP3_INVERSIONS,
  DROP3_STRING_SETS,
  DROP_FAMILIES,
  DropFamilyId,
  getDrop2Voicings,
  getDrop3Voicings,
  InversionId,
  NATURAL_ROOTS,
  NaturalRoot,
} from './dropVoicings';

const choiceButtonClass = (isSelected: boolean) =>
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer ${
    isSelected
      ? 'bg-amber-900 text-stone-50 shadow'
      : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
  }`;

const toneAppearance = (
  quality: ChordQualityId,
  degree: ChordDegree
): { name: string; color: string; label: string } => {
  if (degree === 'root') {
    return { name: 'Root', color: ROOT_INTERVAL_COLOR, label: 'Root' };
  }
  if (degree === 'fifth') {
    return { name: 'Perfect 5', color: PERFECT_FIFTH_INTERVAL_COLOR, label: 'P5' };
  }
  if (degree === 'third') {
    if (quality === 'min7') {
      return { name: 'Minor 3', color: MINOR_THIRD_INTERVAL_COLOR, label: 'm3' };
    }
    return { name: 'Major 3', color: MAJOR_THIRD_INTERVAL_COLOR, label: 'M3' };
  }
  if (quality === 'maj7') {
    return { name: 'Major 7', color: MAJOR_SEVENTH_INTERVAL_COLOR, label: 'M7' };
  }
  return { name: 'Minor 7', color: MINOR_SEVENTH_INTERVAL_COLOR, label: 'm7' };
};

const inversionsFor = (family: DropFamilyId) =>
  family === 'drop2' ? DROP2_INVERSIONS : DROP3_INVERSIONS;

const stringSetsFor = (family: DropFamilyId) =>
  family === 'drop2' ? DROP2_STRING_SETS : DROP3_STRING_SETS;

interface DropChordsDisplayProps {
  maxFret?: number;
}

const DropChordsDisplay: FC<DropChordsDisplayProps> = ({ maxFret = 15 }) => {
  const [selectedRoot, setSelectedRoot] = useState<NaturalRoot>('A');
  const [selectedQuality, setSelectedQuality] = useState<ChordQualityId>('maj7');
  const [selectedFamily, setSelectedFamily] = useState<DropFamilyId>('drop2');
  const [selectedStringSet, setSelectedStringSet] = useState('high');
  const [selectedInversion, setSelectedInversion] =
    useState<InversionId>('root');

  const quality = CHORD_QUALITIES.find((item) => item.id === selectedQuality);
  const qualityLabel = quality?.sentenceLabel ?? 'major 7';
  const stringSets = stringSetsFor(selectedFamily);
  const inversions = inversionsFor(selectedFamily);
  const stringSet =
    stringSets.find((set) => set.id === selectedStringSet) ?? stringSets[0];

  const voicings = useMemo(() => {
    const place = selectedFamily === 'drop2' ? getDrop2Voicings : getDrop3Voicings;
    return place(selectedRoot, selectedQuality, stringSet.strings, maxFret);
  }, [selectedFamily, selectedRoot, selectedQuality, stringSet, maxFret]);

  const staticIntervalLegend = useMemo(() => {
    const degrees: ChordDegree[] = ['root', 'third', 'fifth', 'seventh'];
    return degrees.map((degree) => {
      const tone = toneAppearance(selectedQuality, degree);
      return { name: tone.name, color: tone.color };
    });
  }, [selectedQuality]);

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    const ordered = [...voicings].sort((a, b) => {
      const aSelected = a.inversion === selectedInversion;
      const bSelected = b.inversion === selectedInversion;
      if (aSelected !== bSelected) return aSelected ? -1 : 1;
      return a.notes[0].fret - b.notes[0].fret;
    });

    return ordered.flatMap((voicing) =>
      voicing.notes.map((voicingNote) => {
        const tone = toneAppearance(selectedQuality, voicingNote.degree);
        return {
          note: voicingNote.note,
          color: tone.color,
          label: tone.label,
          variant: 'interval' as const,
          string: voicingNote.string,
          fret: voicingNote.fret,
          emphasis:
            voicing.inversion === selectedInversion
              ? ('shape' as const)
              : ('context' as const),
        };
      })
    );
  }, [voicings, selectedInversion, selectedQuality]);

  const selectedInversionMeta = inversions.find(
    (item) => item.id === selectedInversion
  );

  return (
    <div className="w-full space-y-8">
      <div>
        <div className="flex gap-1" role="tablist" aria-label="Drop">
          {DROP_FAMILIES.map((family) => {
            const isSelected = selectedFamily === family.id;
            return (
              <button
                key={family.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedFamily(family.id);
                  setSelectedStringSet('high');
                }}
                className={`relative rounded-t-lg px-5 py-2 text-sm font-semibold cursor-pointer ${
                  isSelected
                    ? 'z-10 -mb-px border border-amber-800/40 border-b-white bg-white text-amber-900'
                    : 'border border-transparent text-amber-800 hover:text-amber-900'
                }`}
              >
                {family.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          className={`relative z-0 -mt-px space-y-6 rounded-lg border border-amber-800/40 bg-white p-5 shadow-sm md:p-6 ${
            selectedFamily === 'drop2' ? 'rounded-tl-none' : ''
          }`}
        >
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-amber-900">Root</h2>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Root">
              {NATURAL_ROOTS.map((root) => {
                const isSelected = selectedRoot === root;
                return (
                  <button
                    key={root}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedRoot(root)}
                    className={choiceButtonClass(isSelected)}
                  >
                    {root}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-amber-900">Chord</h2>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chord">
              {CHORD_QUALITIES.map((chordQuality) => {
                const isSelected = selectedQuality === chordQuality.id;
                return (
                  <button
                    key={chordQuality.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedQuality(chordQuality.id)}
                    className={choiceButtonClass(isSelected)}
                  >
                    {chordQuality.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-amber-900">String set</h2>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="String set">
                {stringSets.map((set) => {
                  const isSelected = stringSet.id === set.id;
                  return (
                    <button
                      key={set.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedStringSet(set.id)}
                      className={choiceButtonClass(isSelected)}
                    >
                      {set.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-amber-900">Inversion</h2>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Inversion">
                {inversions.map((inversion) => {
                  const isSelected = selectedInversion === inversion.id;
                  return (
                    <button
                      key={inversion.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedInversion(inversion.id)}
                      className={choiceButtonClass(isSelected)}
                    >
                      {inversion.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-amber-800/20 pt-4">
            <p className="font-semibold text-amber-900">
              {selectedRoot} {qualityLabel} · {selectedInversionMeta?.bassLabel}
            </p>
          </div>
        </div>
      </div>

      <FretboardDisplay
          maxFret={maxFret}
          highlightedNotes={highlightedNotes}
          disableKeyHighlights
          showOpenStringLabels
          staticIntervalLegend={staticIntervalLegend}
          mutedFretLabels
          fretLabelTextColor={DARK_ROSEWOOD_LABEL_TEXT}
        />
    </div>
  );
};

export default DropChordsDisplay;
