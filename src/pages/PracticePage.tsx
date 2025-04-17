import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPracticeById } from '../services/practiceService';
import { Practice } from '../types/practice';
import styles from './PracticePage.module.css';

const PracticePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPractice = async () => {
      if (!id) {
        setError('Practice ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const practiceData = await getPracticeById(id);
        if (!practiceData) {
          setError('Practice not found');
        } else {
          setPractice(practiceData);
        }
      } catch (error) {
        console.error('Error fetching practice:', error);
        setError('Failed to load practice data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPractice();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-message">Loading practice...</div>
      </div>
    );
  }

  if (error || !practice) {
    return (
      <div className="container">
        <div className="error-message">{error || 'Practice not found'}</div>
        <button 
          className="button button-secondary" 
          onClick={() => navigate('/practices')}
        >
          Back to Practices
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <header className={styles.practiceHeader}>
        <button 
          className={`button button-secondary ${styles.backButton}`}
          onClick={() => navigate('/practices')}
        >
          Back
        </button>
        <h1>{practice.title}</h1>
      </header>

      <div className="card">
        <p className={styles.description}>{practice.description}</p>

        <div className={styles.practiceDetails}>
          <h2>Practice Details</h2>
          <p>This practice is for {practice.skillLevels.map(level => level.charAt(0).toUpperCase() + level.slice(1)).join(', ')} players.</p>
          
          {practice.customDirections && (
            <div className={styles.directions}>
              <h3>Directions</h3>
              <p>{practice.customDirections}</p>
            </div>
          )}
          
          <div className={styles.elementsList}>
            <h3>Elements</h3>
            <ul>
              {practice.elements.keys && <li>Musical Keys</li>}
              {practice.elements.chordProgressions && <li>Chord Progressions</li>}
              {practice.elements.tempos && <li>Tempos</li>}
              {practice.elements.timeSignatures && <li>Time Signatures</li>}
              {practice.elements.chordExtensions && <li>Chord Extensions</li>}
              {practice.elements.fretLimitations && <li>Fret Limitations</li>}
            </ul>
          </div>
          
          <div className={styles.practiceContent}>
            <h2>Practice Content</h2>
            <p className={styles.comingSoon}>Practice content generation coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage; 