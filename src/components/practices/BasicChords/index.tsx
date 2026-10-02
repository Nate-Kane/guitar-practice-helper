import { FC, useEffect, useState } from 'react';
import { Practice } from '../../../types/practice';
import { BASIC_CHORDS, ChordShape } from './chordData';
import ChordChart from './ChordChart';
import FingerLegend from './FingerLegend';

interface BasicChordsProps {
  practice: Practice;
  skillLevel: string;
}

const BasicChords: FC<BasicChordsProps> = () => {
  const [enlargedChord, setEnlargedChord] = useState<ChordShape | null>(null);

  useEffect(() => {
    if (!enlargedChord) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEnlargedChord(null);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [enlargedChord]);

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amber-900">Basic chord charts</h2>
        <p className="text-amber-800 text-sm md:text-base mt-1 max-w-2xl">
          Start with C, A, G, E, and D, then build out from there. Numbers show which finger to
          use. Click any chart to enlarge it.
        </p>
      </div>

      <div className="rounded-lg border border-amber-900/20 bg-stone-50 shadow-sm p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {BASIC_CHORDS.map((chord, index) => (
            <button
              key={`${chord.name}-${index}`}
              type="button"
              onClick={() => setEnlargedChord(chord)}
              className="cursor-pointer rounded-lg p-2 -m-2 transition-colors hover:bg-amber-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2"
              aria-label={`Enlarge ${chord.name} chord chart`}
            >
              <ChordChart chord={chord} />
            </button>
          ))}
          <FingerLegend />
        </div>
      </div>

      {enlargedChord && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${enlargedChord.name} chord chart enlarged`}
          onClick={() => setEnlargedChord(null)}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-stone-50 border border-amber-900/20 shadow-xl p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setEnlargedChord(null)}
              aria-label="Close enlarged chord chart"
              className="absolute top-3 right-4 text-3xl leading-none text-amber-900/50 hover:text-amber-900 cursor-pointer transition-colors"
            >
              &times;
            </button>
            <ChordChart chord={enlargedChord} size="large" />
            <p className="mt-4 text-center text-sm text-amber-800/80">
              Click outside or press Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicChords;
