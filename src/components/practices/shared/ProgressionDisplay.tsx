import { FC } from 'react';
import { ChordProgression } from '../../../assets/practiceAssets/progressions';
import styles from '../practices.module.css';

interface ProgressionDisplayProps {
  progression: ChordProgression | null;
  chords: string[];
  onRegenerateProgression: () => void;
}

const ProgressionDisplay: FC<ProgressionDisplayProps> = ({ 
  progression, 
  chords, 
  onRegenerateProgression 
}) => {
  if (!progression || chords.length === 0) return null;
  
  return (
    <div className={`${styles.practiceDataContainer}`}>
      <div className={`${styles.practiceInfo}`}>
        <h4>{progression.name}</h4>
        <h5>{progression.nashvilleRomanNums.join(' - ')}</h5>
        <p>{chords.join(' - ')}</p>
        {progression.description && (
          <p className={styles.description}>{progression.description}</p>
        )}
      </div>
      <button 
        className="button button-secondary button-regen"
        onClick={onRegenerateProgression}
      >
        &#8635;
      </button>
    </div>
  );
};

export default ProgressionDisplay;
