import { FC, Suspense, lazy } from 'react';
import { Practice } from '../../types/practice';

// Component mapping by practice title
const PRACTICE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'Sound Exploration': lazy(() => import('./SoundExploration')),
  // Add a lead guitar practice; limit frets; generate style and key;
  /** add a timing practice (metronome!); play w/ metronome, start slow 
   * and move towards faster. This practice tells you choose one thing 
   * to play, and then play in three different, incrementing tempos
  */
  // Fretboard mastery (memorize frets)
  // Fretboard freedom (lead guitar; random key; fret, and string limitations)
  // Uncage your playing (caged system practice somehow)
 
  };

interface PracticeRendererProps {
  practice: Practice;
  skillLevel: string;
}

const PracticeRenderer: FC<PracticeRendererProps> = ({ practice, skillLevel }) => {
  // Find the appropriate component
  const PracticeComponent = PRACTICE_COMPONENTS[practice.title];
  
  if (!PracticeComponent) {
    return <div className="error-message">No component found for practice: {practice.title}</div>;
  }
  
  return (
    <Suspense fallback={<div className="loading-message">Loading practice...</div>}>
      <PracticeComponent practice={practice} skillLevel={skillLevel} />
    </Suspense>
  );
};

export default PracticeRenderer;
