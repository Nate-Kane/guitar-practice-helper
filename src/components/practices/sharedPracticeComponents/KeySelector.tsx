import { FC } from 'react';
import { ALL_KEYS, basics_KEYS, INTERMEDIATE_KEYS, ADVANCED_KEYS, Key } from '../../../assets/practiceAssets/keys';
import styles from '../practices.module.css';
import keyStyles from './keyDisplay.module.css';

interface KeySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  skillLevel: string;
  onSelectKey: (key: Key) => void;
}

const KeySelector: FC<KeySelectorProps> = ({ isOpen, onClose, skillLevel, onSelectKey }) => {
  if (!isOpen) return null;
  
  // Determine which keys to show based on skill level
  let availableKeys: Key[] = [];
  switch(skillLevel) {
    case "basics":
      availableKeys = basics_KEYS;
      break;
    case "intermediate":
      availableKeys = [...basics_KEYS, ...INTERMEDIATE_KEYS];
      break;
    case "advanced":
      availableKeys = ALL_KEYS;
      break;
    default:
      availableKeys = basics_KEYS;
  }
  
  return (
    <div className={keyStyles.modalOverlay}>
      <div className={keyStyles.modalContent}>
        <div className={keyStyles.modalHeader}>
          <h3>Select a Key</h3>
          <h1 onClick={onClose}>&times;</h1>
        </div>
        <div className={keyStyles.keyGrid}>
          {availableKeys.map((key) => (
            <button
              key={key.name}
              className={`button ${keyStyles.keyButton}`}
              onClick={() => {
                onSelectKey(key);
                onClose();
              }}
            >
              {key.name}
            </button>
          ))}
        </div>
        <br />
        <p>Don't see the key you want? Try changing your skill level! Only 'advanced' shows all keys.</p>

      </div>
    </div>
  );
};

export default KeySelector; 