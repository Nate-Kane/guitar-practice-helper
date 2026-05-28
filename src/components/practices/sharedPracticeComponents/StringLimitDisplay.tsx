import { FC } from 'react';
import PracticeLimitCard from './PracticeLimitCard';

interface StringLimitDisplayProps {
  currentStringLimit: string;
  onRegenerateStringLimit: () => void;
}

const StringLimitIcon = () => (
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
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const StringLimitDisplay: FC<StringLimitDisplayProps> = ({
  currentStringLimit,
  onRegenerateStringLimit,
}) => (
  <PracticeLimitCard
    title="String Limit"
    description={
      <>
        Only use strings{' '}
        <span className="font-bold text-stone-50">{currentStringLimit}</span>
      </>
    }
    icon={<StringLimitIcon />}
    onRegenerate={onRegenerateStringLimit}
  />
);
