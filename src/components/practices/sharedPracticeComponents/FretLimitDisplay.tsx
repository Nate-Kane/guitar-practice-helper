import { FC } from 'react';
import PracticeLimitCard from './PracticeLimitCard';

interface FretLimitDisplayProps {
  currentFretLimit: string;
  onRegenerateFretLimit: () => void;
}

const FretLimitIcon = () => (
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
    <path d="M8 5v14" />
    <path d="M12 5v14" />
    <path d="M16 5v14" />
    <path d="M5 5h14" />
    <path d="M5 19h14" />
  </svg>
);

const FretLimitDisplay: FC<FretLimitDisplayProps> = ({
  currentFretLimit,
  onRegenerateFretLimit,
}) => (
  <PracticeLimitCard
    title="Fret Limit"
    description={
      <>
        Only use frets <span className="font-bold text-stone-50">{currentFretLimit}</span>
      </>
    }
    icon={<FretLimitIcon />}
    onRegenerate={onRegenerateFretLimit}
  />
);

export default FretLimitDisplay;
