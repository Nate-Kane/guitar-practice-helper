import { FC } from 'react';
import NoteAcrossFretboardDisplay from '../sharedPracticeComponents/NoteAcrossFretboardDisplay';
import StringNotesDisplay from '../sharedPracticeComponents/StringNotesDisplay';

const MemorizeNotes: FC = () => {
  return (
    <div className="w-full space-y-8">
      <StringNotesDisplay heading="Memorize the notes of a single string" />
      <NoteAcrossFretboardDisplay heading="Memorize one note across the whole fretboard" />
    </div>
  );
};

export default MemorizeNotes;
