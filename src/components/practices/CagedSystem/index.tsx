import { FC } from 'react';
import CagedDisplay from './CagedDisplay';

interface CagedSystemProps {
  skillLevel: string;
}

/** skillLevel is passed by PracticeRenderer; CAGED uses fixed major chords instead of a key picker. */
const CagedSystem: FC<CagedSystemProps> = () => {
  return (
    <div className="w-full space-y-8">
      <CagedDisplay />
    </div>
  );
};

export default CagedSystem;
