import { FC } from 'react';
import { Key } from '../../../assets/practiceAssets/keys';
import styles from '../practices.module.css';

interface KeyDisplayProps {
  currentKey: Key | null;
  onRegenerateKey: () => void;
}

const KeyDisplay: FC<KeyDisplayProps> = ({ currentKey, onRegenerateKey }) => {
  if (!currentKey) return null;
  
  return (
    <div className={`${styles.practiceDataContainer}`}>
      <div className={`${styles.practiceInfo}`}>
        <h4>Key of {currentKey.name} <span className={`${styles.spanHighlight}`}>({currentKey.relativeKey})</span></h4>
        <p>The notes of {currentKey.name} are {currentKey.notes.join(', ')}</p>
      </div>
      <button 
        className="button button-secondary button-regen"
        onClick={onRegenerateKey}
      >
        &#8635;
      </button>
    </div>
  );
};

export default KeyDisplay;
