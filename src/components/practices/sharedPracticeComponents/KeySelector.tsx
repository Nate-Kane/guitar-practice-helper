import { FC, useState } from 'react';
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
  
  const [qualityFilter, setQualityFilter] = useState<string>("Major");
  const [onlyShowSharps, setOnlyShowSharps] = useState<boolean>(false);
  
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
  
  const filteredKeys = availableKeys.filter(key => {
    if (key.quality !== qualityFilter.toLowerCase()) {
      return false;
    }
    
    if (onlyShowSharps !== key.root.includes('#')) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className={keyStyles.modalOverlay}>
      <div className={keyStyles.modalContent}>
        <div className={keyStyles.modalHeader}>
          <h3>Select a Key</h3>
          <h1 onClick={onClose}>&times;</h1>
        </div>
        
        <div className={keyStyles.filterControls}>
          <div className={keyStyles.filterGroup}>
            <div className={keyStyles.toggleButtons}>
              <button 
                className={`${keyStyles.toggleButton} ${qualityFilter === "Major" ? keyStyles.activeToggle : ""}`}
                onClick={() => setQualityFilter("Major")}
              >
                Major
              </button>
              <button 
                className={`${keyStyles.toggleButton} ${qualityFilter === "Minor" ? keyStyles.activeToggle : ""}`}
                onClick={() => setQualityFilter("Minor")}
              >
                Minor
              </button>
            </div>
          </div>
          
          <div className={keyStyles.filterGroup}>
            <div className={keyStyles.toggleButtons}>
              <button 
                className={`${keyStyles.toggleButton} ${!onlyShowSharps ? keyStyles.activeToggle : ""}`}
                onClick={() => setOnlyShowSharps(false)}
              >
                No sharps
              </button>
              <button 
                className={`${keyStyles.toggleButton} ${onlyShowSharps ? keyStyles.activeToggle : ""}`}
                onClick={() => setOnlyShowSharps(true)}
              >
                Sharps
              </button>
            </div>
          </div>
        </div>
        
        <div className={keyStyles.keyGrid}>
          {filteredKeys.map((key) => (
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
        
        {filteredKeys.length === 0 && (
          <p className={keyStyles.noResults}>No keys match your filter criteria.</p>
        )}
        
        <br />
        <p className={keyStyles.disclaimer}>*The available keys are dependent on your selected practice level!</p>
      </div>
    </div>
  );
};

export default KeySelector; 