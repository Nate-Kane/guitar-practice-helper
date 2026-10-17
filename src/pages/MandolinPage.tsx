import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import BasicChords from '../components/practices/BasicChords';
import { MANDOLIN_BASIC_CHORDS } from '../components/practices/BasicChords/mandolinChordData';
import FretboardMapper from '../components/practices/FretboardMapper';
import MemorizeNotes from '../components/practices/MemorizeNotes';
import { practiceCardHoverClass } from '../components/practiceCardHover';
import { MANDOLIN_INSTRUMENT } from '../components/practices/sharedPracticeComponents/fretboardConstants';

type MandolinPracticeId = 'notes' | 'fretboard' | 'chords';

const MANDOLIN_PRACTICES: { id: MandolinPracticeId; title: string; description: string }[] = [
  {
    id: 'chords',
    title: 'Basic Chords',
    description: 'A through G, major then minor, with finger numbers on each chart.',
  },
  {
    id: 'notes',
    title: 'Note Memorization',
    description:
      'Learn the notes on one string, one note across the neck, or every note at once.',
  },
  {
    id: 'fretboard',
    title: 'Explore the Fretboard',
    description: 'Choose a key and see those notes light up across the mandolin fretboard.',
  },
];

const SCROLL_DURATION_MS = 1100;

/** Ease the page to the practice heading. Native smooth scroll has a fixed speed. */
const scrollToPractice = (
  node: HTMLElement,
  frameRef: { current: number | null }
) => {
  if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

  const start = window.scrollY;
  const target = node.getBoundingClientRect().top + start - 24;
  const distance = target - start;
  if (Math.abs(distance) < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, target);
    return;
  }

  const startTime = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / SCROLL_DURATION_MS);
    const eased = 1 - (1 - progress) ** 3;
    window.scrollTo(0, start + distance * eased);
    frameRef.current = progress < 1 ? requestAnimationFrame(tick) : null;
  };
  frameRef.current = requestAnimationFrame(tick);
};

const MandolinPage: FC = () => {
  const [activePractice, setActivePractice] = useState<MandolinPracticeId>('chords');
  const practiceRef = useRef<HTMLDivElement>(null);
  const shouldScroll = useRef(false);
  const scrollFrame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!shouldScroll.current || !practiceRef.current) return;
    shouldScroll.current = false;
    scrollToPractice(practiceRef.current, scrollFrame);
  }, [activePractice]);

  const selectPractice = (id: MandolinPracticeId) => {
    if (id === activePractice) {
      if (practiceRef.current) scrollToPractice(practiceRef.current, scrollFrame);
      return;
    }
    shouldScroll.current = true;
    setActivePractice(id);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-[1280px]">
      <div className="mx-auto w-full max-w-[1000px] space-y-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900">Map My... Mandolin?</h1>
          <p className="text-amber-800 text-sm md:text-base mt-2 max-w-2xl">
            Mandolin players are welcome here too! Standard tuning for a mandolin is G, D, A, E from
            the lowest pitched string to the highest. Pick a practice below to start navigating the
            fretboard.
          </p>
        </div>

        <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 items-stretch">
          {MANDOLIN_PRACTICES.map((practice) => {
            const isSelected = activePractice === practice.id;
            return (
              <div key={practice.id} className="flex h-full flex-col">
                <p
                  className={`mb-1.5 flex h-5 items-center gap-1 text-xs font-semibold text-amber-900 ${
                    isSelected ? '' : 'invisible'
                  }`}
                  aria-hidden={!isSelected}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                    <path d="M5 21h14" />
                  </svg>
                  currently showing
                </p>
              <div
                data-practice-card
                className={`flex h-full flex-col rounded-lg border shadow overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 ${practiceCardHoverClass} ${
                  isSelected ? 'border-amber-200' : 'border-amber-800/30'
                }`}
              >
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start flex-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-stone-50 border-b border-amber-200/80 pb-1.5 mb-1">
                        {practice.title}
                      </h3>
                      <p className="text-sm text-stone-50 line-clamp-3 mt-2 leading-snug">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex justify-end px-4 pb-4 pt-0">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectPractice(practice.id)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors shadow h-8 px-3 text-stone-50 cursor-pointer ${
                      isSelected ? 'bg-amber-900' : 'hover:bg-amber-900'
                    }`}
                  >
                    Practice
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
                      className="ml-1.5 h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              </div>
            );
          })}
        </div>

        <div ref={practiceRef} className="scroll-mt-6">
          {activePractice === 'notes' && <MemorizeNotes instrument={MANDOLIN_INSTRUMENT} />}

          {activePractice === 'fretboard' && (
            <FretboardMapper
              instrument={MANDOLIN_INSTRUMENT}
              maxFret={12}
              heading="Choose a key, then explore the mandolin fretboard"
            />
          )}

          {activePractice === 'chords' && (
            <BasicChords
              chords={MANDOLIN_BASIC_CHORDS}
              stringCount={4}
              heading="Basic mandolin chords"
              description="A through G, major then minor. Strings run low G to high E, left to right. Numbers show which finger to use. Click any chart to enlarge it."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default MandolinPage;
