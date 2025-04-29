import { FC } from 'react';
import { Key } from '../../../assets/practiceAssets/keys';
import styles from '../practices.module.css';
import keyStyles from './keyDisplay.module.css';
import KeySelector from './KeySelector';

interface KeyDisplayProps {
  currentKey: Key | null;
  onRegenerateKey: () => void;
  skillLevel: string;
  isKeySelectorOpen: boolean;
  openKeySelector: () => void;
  closeKeySelector: () => void;
  onSelectKey: (key: Key) => void;
}

const KeyDisplay: FC<KeyDisplayProps> = ({ 
  currentKey, 
  onRegenerateKey, 
  skillLevel,
  isKeySelectorOpen,
  openKeySelector,
  closeKeySelector,
  onSelectKey
}) => {
  if (!currentKey) return null;
  
  return (
    <>
      <div className={`${styles.practiceDataContainer}`}>
        <div className={`${styles.practiceInfo}`}>
          <div className={`${keyStyles.keyComponentHeader}`}>
            <h4>Key of {currentKey.name} <span className={`${styles.spanHighlight}`}>({currentKey.relativeKey})</span></h4>
            <button 
              className="button button-secondary"
              onClick={openKeySelector}
            >
              Pick your own key
            </button>
          </div>
          <p>The notes of {currentKey.name} are {currentKey.notes.join(', ')}</p>
        </div>
        <button 
          className="button button-secondary button-regen"
          onClick={onRegenerateKey}
        >
          &#8635;
        </button>
      </div>
      
      <KeySelector
        isOpen={isKeySelectorOpen}
        onClose={closeKeySelector}
        skillLevel={skillLevel}
        onSelectKey={onSelectKey}
      />
    </>
  );
};

export default KeyDisplay;
