import { FC } from 'react';
import { Practice } from '../../../types/practice';
import NoteAcrossFretboardDisplay from '../sharedPracticeComponents/NoteAcrossFretboardDisplay';
import StringNotesDisplay from '../sharedPracticeComponents/StringNotesDisplay';

interface MemorizeNotesProps {
  practice: Practice;
  skillLevel: string;
}

const MemorizeNotes: FC<MemorizeNotesProps> = () => {
  return (
    <div className="w-full space-y-8">
      <StringNotesDisplay heading="Memorize the notes of a single string" />
      <NoteAcrossFretboardDisplay heading="Memorize one note across the whole fretboard" />
    </div>
  );
};

export default MemorizeNotes;
