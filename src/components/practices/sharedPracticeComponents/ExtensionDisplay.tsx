import { FC } from 'react';
import { ChordExtension } from '../../../assets/practiceAssets/extensions';
import PracticeLimitCard from './PracticeLimitCard';

interface ExtensionDisplayProps {
  extension: ChordExtension | null;
  onRegenerateExtension: () => void;
}

const ExtensionIcon = () => (
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
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
);

const ExtensionDisplay: FC<ExtensionDisplayProps> = ({
  extension,
  onRegenerateExtension,
}) => {
  if (!extension) return null;

  return (
    <PracticeLimitCard
      title="Chord Extensions"
      icon={<ExtensionIcon />}
      onRegenerate={onRegenerateExtension}
    >
      <p className="text-base md:text-lg font-medium text-stone-50">
        Try using {extension.name}&apos;s
      </p>
      <p className="text-stone-400 text-sm pt-1">{extension.description}</p>
    </PracticeLimitCard>
  );
};

export default ExtensionDisplay;
