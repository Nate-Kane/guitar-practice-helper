import { FC } from 'react';
import { ChordExtension } from '../../../assets/practiceAssets/extensions';
import styles from '../practices.module.css';

interface ExtensionDisplayProps {
  extension: ChordExtension | null;
  onRegenerateExtension: () => void;
}

const ExtensionDisplay: FC<ExtensionDisplayProps> = ({ 
  extension, 
  onRegenerateExtension 
}) => {
  if (!extension) return null;
  
  return (
    <div className={`${styles.practiceDataContainer}`}>
      <div className={`${styles.practiceInfo}`}>
        <h4>Try incorporating {extension.name}'s</h4>
        <p>{extension.description}</p>
      </div>
      <button 
        className="button button-secondary button-regen"
        onClick={onRegenerateExtension}
      >
        &#8635;
      </button>
    </div>
  );
};

export default ExtensionDisplay;
