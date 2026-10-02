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

/** Imperfect loop with chalk/pencil-style stroke via SVG noise. */
const HandDrawnCircle = ({ seed }: { seed: number }) => {
  const rotation = (seed % 5) * 17 - 28;
  // Wobblier path variants so neighboring circles don't look identical
  const paths = [
    'M 49 6 C 61 5, 74 8, 84 18 C 93 27, 97 40, 96 52 C 95 66, 88 80, 74 89 C 62 96, 46 98, 34 93 C 20 87, 9 74, 6 58 C 3 42, 8 26, 20 16 C 30 8, 40 6, 49 6 Z',
    'M 51 7 C 66 4, 82 11, 90 24 C 97 36, 98 50, 94 63 C 89 78, 76 90, 60 95 C 46 99, 30 96, 18 86 C 8 77, 4 60, 7 46 C 10 30, 22 14, 38 9 C 43 7, 47 7, 51 7 Z',
    'M 47 8 C 59 5, 78 7, 88 19 C 96 29, 99 45, 95 58 C 91 74, 78 88, 62 93 C 48 97, 32 94, 20 84 C 10 75, 5 58, 8 43 C 11 27, 24 12, 40 8 C 43 7, 45 8, 47 8 Z',
    'M 53 9 C 68 6, 85 14, 92 28 C 98 40, 96 56, 90 68 C 83 82, 68 93, 52 95 C 36 97, 20 90, 12 76 C 5 64, 4 48, 10 34 C 16 20, 32 9, 46 8 C 49 8, 51 8, 53 9 Z',
  ];
  const d = paths[seed % paths.length];
  const roughId = `strum-rough-${seed}`;
  const chalkId = `strum-chalk-${seed}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-[-6%] h-[112%] w-[112%] text-amber-900"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <defs>
        {/* Distort edges so the outline isn't geometrically clean */}
        <filter id={roughId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.045"
            numOctaves="3"
            seed={seed * 11 + 5}
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="4.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {/* Finer displacement — breaks the stroke into a chalky/pencil grain */}
        <filter id={chalkId} x="-35%" y="-35%" width="170%" height="170%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75 0.9"
            numOctaves="3"
            seed={seed * 3 + 2}
            result="grain"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grain"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>

      <g filter={`url(#${roughId})`}>
        {/* Light brand cream/yellow wash */}
        <path d={d} fill="#fdfaf0" stroke="none" />
        {/* Soft under-pass — wider, faded */}
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeOpacity="0.22"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${chalkId})`}
        />
        {/* Main pencil stroke */}
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeOpacity="0.88"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${chalkId})`}
        />
      </g>
    </svg>
  );
};

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
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-2">
          <p className="text-sm font-medium text-amber-900/70">
            Strum on the circled counts
          </p>
        </div>

        <div
          className="flex flex-nowrap items-center justify-center gap-x-1.5 sm:gap-x-3 md:gap-x-4 px-3 sm:px-6 py-6 sm:py-8"
          aria-label={`Strum on: ${activeBeatLabels || 'none'}`}
        >
          {beats.map((label, index) => {
            const isActive = Boolean(activeBeats[index]);
            const isPlus = label === '+';
            return (
              <div
                key={`${timeSignature}-${index}`}
                className="relative flex h-9 w-9 sm:h-14 sm:w-14 md:h-[4.25rem] md:w-[4.25rem] shrink-0 items-center justify-center font-bold tabular-nums text-amber-900"
              >
                {isActive && <HandDrawnCircle seed={index} />}
                {isPlus ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="relative z-10 h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8"
                    aria-hidden="true"
                  >
                    {/* Thin long strokes — size grows, weight stays light */}
                    <path
                      d="M12 3.25v17.5M3.25 12h17.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <span className="relative z-10 text-base sm:text-2xl md:text-3xl">
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Strumming;
