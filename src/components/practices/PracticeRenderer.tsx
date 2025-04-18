import { FC, Suspense, lazy } from 'react';
import { Practice } from '../../types/practice';

// Component mapping by practice title
const PRACTICE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'Solo Improvisation': lazy(() => import('./SoloImprovisation')),
  // Add more practices
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
