import { FC, useCallback, useMemo, useState } from 'react';
import { Practice } from '../../../types/practice';
import PracticeToolCard from '../sharedPracticeComponents/PracticeToolCard';

type TimeSignature = '4/4' | '3/4';

interface StrummingProps {
  practice: Practice;
  skillLevel: string;
}

const BEATS_BY_TIME_SIGNATURE: Record<TimeSignature, string[]> = {
  '4/4': ['1', '+', '2', '+', '3', '+', '4', '+'],
  '3/4': ['1', '+', '2', '+', '3', '+'],
};

const generatePattern = (count: number, previous?: boolean[]): boolean[] => {
  let pattern: boolean[] = [];
  let attempts = 0;

  do {
    pattern = Array.from({ length: count }, () => Math.random() < 0.5);
    attempts += 1;
  } while (
    (!pattern.some(Boolean) ||
      (previous &&
        previous.length === count &&
        previous.every((active, index) => active === pattern[index]))) &&
    attempts < 12
  );

  // Guarantee at least one strum if randomness kept failing
  if (!pattern.some(Boolean)) {
    pattern[Math.floor(Math.random() * count)] = true;
  }

  return pattern;
};

const StrumIcon = () => (
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

const RegenerateIcon = () => (
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
    className="h-5 w-5 mr-2 shrink-0"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const Strumming: FC<StrummingProps> = () => {
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const beats = useMemo(() => BEATS_BY_TIME_SIGNATURE[timeSignature], [timeSignature]);
  const [activeBeats, setActiveBeats] = useState<boolean[]>(() =>
    generatePattern(BEATS_BY_TIME_SIGNATURE['4/4'].length)
  );

  const handleTimeSignatureChange = (next: TimeSignature) => {
    if (next === timeSignature) return;
    setTimeSignature(next);
    setActiveBeats(generatePattern(BEATS_BY_TIME_SIGNATURE[next].length));
  };

  const randomizePattern = useCallback(() => {
    setActiveBeats((previous) => generatePattern(beats.length, previous));
  }, [beats.length]);

  const activeBeatLabels = beats.filter((_, index) => activeBeats[index]).join(', ');

  // Pair each downbeat with its "+", e.g. ["1","+"], ["2","+"], ...
  const beatGroups = useMemo(() => {
    const groups: { label: string; index: number }[][] = [];
    for (let i = 0; i < beats.length; i += 2) {
      groups.push([
        { label: beats[i], index: i },
        ...(beats[i + 1] !== undefined ? [{ label: beats[i + 1], index: i + 1 }] : []),
      ]);
    }
    return groups;
  }, [beats]);

  return (
    <div className="w-full space-y-6">
      <PracticeToolCard
        heading="Practice a randomized strumming pattern"
        title={`${timeSignature} pattern`}
        description="Pick a time signature, then strum only on the circled counts."
        icon={<StrumIcon />}
        actions={
          <button
            type="button"
            onClick={randomizePattern}
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors shadow h-9 px-4 py-2 text-stone-50 bg-amber-900 hover:bg-amber-800 cursor-pointer"
          >
            <RegenerateIcon />
            Randomize
          </button>
        }
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Time signature">
          {(['4/4', '3/4'] as const).map((option) => {
            const isSelected = timeSignature === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleTimeSignatureChange(option)}
                className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors shadow h-9 min-w-[3.5rem] px-4 cursor-pointer ${
                  isSelected
                    ? 'text-stone-50 bg-amber-900 hover:bg-amber-800'
                    : 'text-stone-50 bg-zinc-700 hover:bg-zinc-600 border border-stone-50/20'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </PracticeToolCard>

      <div className="rounded-lg border border-amber-900/20 bg-stone-50 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-2">
          <p className="text-sm font-medium text-amber-900/70">
            Strum on the circled counts
          </p>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10 px-6 py-8"
          aria-label={`Strum on: ${activeBeatLabels || 'none'}`}
        >
          {beatGroups.map((group, groupIndex) => (
            <div
              key={`${timeSignature}-group-${groupIndex}`}
              className="flex items-center gap-2 sm:gap-3"
            >
              {group.map(({ label, index }) => {
                const isActive = Boolean(activeBeats[index]);
                return (
                  <div
                    key={`${timeSignature}-${index}`}
                    className={`flex h-14 w-14 sm:h-[4.25rem] sm:w-[4.25rem] items-center justify-center rounded-full text-2xl sm:text-3xl font-bold tabular-nums text-amber-950 ${
                      isActive
                        ? 'border-[3px] border-amber-900 bg-amber-100'
                        : 'border-[3px] border-transparent'
                    }`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="border-t border-amber-900/10 px-6 py-4">
          <p className="text-center text-amber-950/80 text-sm sm:text-base">
            {activeBeatLabels
              ? `Strum on: ${activeBeatLabels}`
              : 'Hit Randomize to get a pattern'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Strumming;
