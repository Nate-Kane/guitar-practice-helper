import { FC } from 'react';
import { Practice } from '../../../types/practice';
import StringNotesDisplay from '../sharedPracticeComponents/StringNotesDisplay';

interface MemorizeNotesProps {
  practice: Practice;
  skillLevel: string;
}

const MemorizeNotes: FC<MemorizeNotesProps> = () => {
  return (
    <div className="w-full">
      <StringNotesDisplay heading="Memorize the notes of a single string" />
    </div>
  );
};

export default MemorizeNotes;
