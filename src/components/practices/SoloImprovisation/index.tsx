import { FC, useState, useEffect } from 'react';
import { Practice } from '../../../types/practice';
import { getRandomKey, Key } from '../../../practiceAssets/keys';
import { getRandomProgression, progressionToChords, ChordProgression } from '../../../practiceAssets/progressions';
import styles from './index.module.css'

interface SoloImprovisationProps {
    practice: Practice;
    skillLevel: string;
}

const SoloImprovisation: FC<SoloImprovisationProps> = ({ practice, skillLevel }) => {
    // State for key and progression
    const [currentKey, setCurrentKey] = useState<Key | null>(null);
    const [currentProgression, setCurrentProgression] = useState<ChordProgression | null>(null);
    const [currentChords, setCurrentChords] = useState<string[]>([]);
    
    // Generate new chord progression with current key
    const generateNewProgression = () => {
        if (currentKey) {
            const progression = getRandomProgression(skillLevel);
            setCurrentProgression(progression);
            
            // Convert Nashville notation to actual chords based on current key
            const chords = progressionToChords(
                progression.nashville, 
                currentKey.root, 
                currentKey.quality
            );
            setCurrentChords(chords);
        }
    };
    
    // Generate new key and update progression to match
    const generateNewKey = () => {
        const key = getRandomKey(skillLevel);
        setCurrentKey(key);
        
        // If we have a progression, update the chords to match the new key
        if (currentProgression) {
            const chords = progressionToChords(
                currentProgression.nashville, 
                key.root, 
                key.quality
            );
            setCurrentChords(chords);
        }
    };
    
    // Initialize both key and progression on component mount or skill level change
    useEffect(() => {
        const key = getRandomKey(skillLevel);
        setCurrentKey(key);
        
        const progression = getRandomProgression(skillLevel);
        setCurrentProgression(progression);
        
        const chords = progressionToChords(
            progression.nashville, 
            key.root, 
            key.quality
        );
        setCurrentChords(chords);
    }, [skillLevel]);
    
    return (
        <div>
            {currentKey && (
                <div className={`${styles.practiceDataContainer}`}>
                    <div>
                        <h4>{currentKey.name} ({currentKey.relativeKey})</h4>
                        <p>{currentKey.notes.join(', ')}</p>
                    </div>
                    <button 
                        className="button button-secondary"
                        onClick={generateNewKey}
                    >
                        Change
                    </button>
                </div>
            )}
            
            {currentProgression && currentChords.length > 0 && (
                <div className={`${styles.practiceDataContainer}`}>
                    <div>
                        <h4>{currentProgression.name} ({currentProgression.nashville.join(' - ')})</h4>
                        <p>Progression: {currentChords.join(' - ')}</p>
                        {currentProgression.description && (
                            <p className={styles.description}>{currentProgression.description}</p>
                        )}
                    </div>
                    <button 
                        className="button button-secondary"
                        onClick={generateNewProgression}
                    >
                        Change
                    </button>
                </div>
            )}
        </div>
    );
};

export default SoloImprovisation;