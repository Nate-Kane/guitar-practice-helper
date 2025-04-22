import { FC, useState, useEffect } from 'react';
import { Practice } from '../../../types/practice';
import { getRandomKey, Key } from '../../../practiceAssets/keys';
import { getRandomProgression, progressionToChords, ChordProgression } from '../../../practiceAssets/progressions';
import { getRandomExtension, ChordExtension } from '../../../practiceAssets/extensions';
import styles from './index.module.css'

interface SoloImprovisationProps {
    practice: Practice;
    skillLevel: string;
}

const SoloImprovisation: FC<SoloImprovisationProps> = ({ skillLevel }) => {
    // State for key and progression
    const [currentKey, setCurrentKey] = useState<Key | null>(null);
    const [currentProgression, setCurrentProgression] = useState<ChordProgression | null>(null);
    const [currentChords, setCurrentChords] = useState<string[]>([]);
    const [currentExtension, setCurrentExtension] = useState<ChordExtension | null>(null);
    
    // Generate new chord progression with current key
    const generateNewProgression = () => {
        if (currentKey) {
            const progression = getRandomProgression(currentKey, skillLevel);
            setCurrentProgression(progression);
            
            if (progression) {
                const chords = progressionToChords(progression, currentKey);
                setCurrentChords(chords);
            }
        }
    };
    
    // Generate new key and update progression to match
    const generateNewKey = () => {
        const key = getRandomKey(skillLevel);
        setCurrentKey(key);
    };

    const generateNewExtension = () => {
        const extension = getRandomExtension(skillLevel);
        setCurrentExtension(extension);
    }
    
    // Initialize both key and progression on component mount or skill level change
    useEffect(() => {
        const key = getRandomKey(skillLevel);
        setCurrentKey(key);
    }, [skillLevel]);


    useEffect(() => {
        if (currentKey) {
            const progression = getRandomProgression(currentKey, skillLevel);
            setCurrentProgression(progression);
            
            if (progression) {
                const chords = progressionToChords(progression, currentKey);
                setCurrentChords(chords);
            }
            
            // Initialize the extension if not beginner and it hasn't been set yet
            if (skillLevel !== 'beginner' && !currentExtension) {
                const extension = getRandomExtension(skillLevel);
                setCurrentExtension(extension);
            }
        }
    }, [currentKey, skillLevel]);
    
    return (
        <div>
            {currentKey && (
                <div className={`${styles.practiceDataContainer}`}>
                    <div className={`${styles.practiceInfo}`}>
                        <h4>{currentKey.name} ({currentKey.relativeKey})</h4>
                        <p>The notes of {currentKey.name} are {currentKey.notes.join(', ')}</p>
                    </div>
                    <button 
                        className="button button-secondary button-regen"
                        onClick={generateNewKey}
                    >
                        &#8635;
                    </button>
                </div>
            )}
            
            {currentProgression && currentChords.length > 0 && (
                <div className={`${styles.practiceDataContainer}`}>
                    <div className={`${styles.practiceInfo}`}>
                        <h4>{currentProgression.name}</h4>
                        <h5>{currentProgression.nashvilleRomanNums.join(' - ')} {/*<span>({currentProgression.nashvilleNums.join(' - ')})</span>*/}</h5>
                        <p>{currentChords.join(' - ')}</p>
                        {currentProgression.description && (
                            <p className={styles.description}>{currentProgression.description}</p>
                        )}
                    </div>
                    <button 
                        className="button button-secondary button-regen"
                        onClick={generateNewProgression}
                    >
                        &#8635;
                    </button>
                </div>
            )}

            {skillLevel !== 'beginner' && currentExtension && (
                <div className={`${styles.practiceDataContainer}`}>
                    <div className={`${styles.practiceInfo}`}>
                        <h4>Try incorporating {currentExtension.name}'s</h4>
                        <p>{currentExtension.description}</p>
                    </div>
                    <button 
                        className="button button-secondary button-regen"
                        onClick={generateNewExtension}
                    >
                        &#8635;
                    </button>
                </div>
            )}
        
            {/* add fret limitations */}

            {/* add tempo & time signature */}
        </div>
    );
};

export default SoloImprovisation;