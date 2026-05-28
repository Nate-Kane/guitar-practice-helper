import { FC, useMemo } from 'react';
import { Key } from '../../../assets/practiceAssets/keys';
import { getDiatonicTriadsForKey } from './diatonicTriads';
import FretboardDisplay, { HighlightedNoteInfo } from './FretboardDisplay';
import PracticeToolCard from './PracticeToolCard';
import { NEUTRAL_MARKER_COLOR, NEUTRAL_MARKER_ROOT_COLOR } from './fretboardConstants';

interface TriadsDisplayProps {
  currentKey: Key;
  maxFret?: number;
}

const TriadsDisplay: FC<TriadsDisplayProps> = ({ currentKey, maxFret = 12 }) => {
  const triads = useMemo(() => getDiatonicTriadsForKey(currentKey), [currentKey]);

  const qualityLabel = currentKey.quality === 'major' ? 'major' : 'minor';

  const highlightedNotes = useMemo((): HighlightedNoteInfo[] => {
    const triadRoots = new Set(triads.map((t) => t.root));
    const notesInTriads = new Set<string>();

    triads.forEach((triad) => {
      triad.notes.forEach((note) => notesInTriads.add(note));
    });

    return [...notesInTriads].map((note) => ({
      note,
      color: triadRoots.has(note) ? NEUTRAL_MARKER_ROOT_COLOR : NEUTRAL_MARKER_COLOR,
      variant: 'neutral' as const,
    }));
  }, [triads]);

  const triadSummary = triads.map((t) => t.name).join(', ');

  return (
    <PracticeToolCard
      heading="Diatonic triads in this key"
      title={`${qualityLabel.charAt(0).toUpperCase() + qualityLabel.slice(1)} triads in ${currentKey.name}`}
      description={
        triads.length > 0
          ? `${triadSummary} — each uses root, ${qualityLabel === 'major' ? 'major 3rd' : 'minor 3rd'}, and perfect 5th.`
          : 'No diatonic triads found for this key.'
      }
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
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="m8 8 8 8" />
          <path d="m16 8-8 8" />
        </svg>
      }
    >
      {triads.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {triads.map((triad) => (
            <li
              key={triad.root}
              className="text-sm text-stone-300 bg-stone-50/10 border border-stone-50/20 rounded-lg px-3 py-1.5"
            >
              <span className="font-semibold text-stone-50">{triad.name}</span>
              <span className="text-stone-400"> — {triad.notes.join(', ')}</span>
            </li>
          ))}
        </ul>
      )}
      <FretboardDisplay
        maxFret={maxFret}
        highlightedNotes={highlightedNotes}
        disableKeyHighlights
        showOpenStringLabels={false}
      />
    </PracticeToolCard>
  );
};

export default TriadsDisplay;
