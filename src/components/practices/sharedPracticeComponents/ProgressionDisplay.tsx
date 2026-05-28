import { FC } from 'react';
import { ChordProgression } from '../../../assets/practiceAssets/progressions';
import PracticeLimitCard from './PracticeLimitCard';

interface ProgressionDisplayProps {
  progression: ChordProgression | null;
  chords: string[];
  onRegenerateProgression: () => void;
}

const ProgressionIcon = () => (
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
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const ProgressionDisplay: FC<ProgressionDisplayProps> = ({
  progression,
  chords,
  onRegenerateProgression,
}) => {
  if (!progression || chords.length === 0) return null;

  return (
    <PracticeLimitCard
      title="Chord Progression"
      icon={<ProgressionIcon />}
      onRegenerate={onRegenerateProgression}
    >
      <p className="text-base md:text-lg font-medium text-stone-50">
        {progression.name}{' '}
        <span className="font-bold">({progression.nashvilleRomanNums.join(' - ')})</span>
      </p>
      <p className="text-stone-300 text-sm md:text-base font-medium">{chords.join(' - ')}</p>
      {progression.description && (
        <p className="text-stone-400 text-sm pt-1">{progression.description}</p>
      )}
    </PracticeLimitCard>
  );
};

export default ProgressionDisplay;
