import { FC } from 'react';
import BasicChords from '../components/practices/BasicChords';
import { MANDOLIN_BASIC_CHORDS } from '../components/practices/BasicChords/mandolinChordData';
import FretboardMapper from '../components/practices/FretboardMapper';
import MemorizeNotes from '../components/practices/MemorizeNotes';
import { MANDOLIN_INSTRUMENT } from '../components/practices/sharedPracticeComponents/fretboardConstants';

const MandolinPage: FC = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-[1280px]">
      <div className="mx-auto w-full max-w-[1000px] space-y-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900">Map My... Mandolin?</h1>
          <p className="text-amber-800 text-sm md:text-base mt-2 max-w-2xl">
            Mandolin players are welcome here too! Standard tuning for a mandolin is G, D, A, E from
            the lowest pitched string to the highest. Explore the tools down below to learn how to
            navigate around your mandolin fretboard.
          </p>
        </div>

        <MemorizeNotes instrument={MANDOLIN_INSTRUMENT} />

        <FretboardMapper
          instrument={MANDOLIN_INSTRUMENT}
          maxFret={12}
          heading="Choose a key, then explore the mandolin fretboard"
        />

        <BasicChords
          chords={MANDOLIN_BASIC_CHORDS}
          stringCount={4}
          heading="Basic mandolin chords"
          description="A through G, major then minor. Strings run low G to high E, left to right. Numbers show which finger to use. Click any chart to enlarge it."
        />
      </div>
    </main>
  );
};

export default MandolinPage;
