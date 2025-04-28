import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPracticeById } from '../services/practiceService';
import { Practice } from '../types/practice';
import styles from './PracticePage.module.css';
import { useWindowSize } from '../hooks/useWindowSize';
import PracticeRenderer from '../components/practices/PracticeRenderer';

const MOBILE_BREAKPOINT = 960;

interface PracticePageProps {
  skillLevel: string;
  onSkillSelect: (level: string) => void;
}

const PracticePage: FC<PracticePageProps> = ({skillLevel, onSkillSelect}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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

  const handleSkillLevelClick = (level: string) => {
    const skillLevels = ['basics', 'intermediate', 'advanced'];
    let currentLevel = skillLevels.indexOf(level);
    const nextIndex = (currentLevel + 1) % skillLevels.length;
    onSkillSelect(skillLevels[nextIndex])
}

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
    <div className={`container ${styles.practiceContainer}`}>
      <header className={`header ${styles.practicePageHeader}`}>
        <div>
          <h1>{practice.title}</h1>
          <p onClick={() => navigate('/practices')}>
          &#8592; Back to practices
          </p>
        </div>
        <div 
            className={`button button-secondary`}
            onClick={() => handleSkillLevelClick(skillLevel)}
        >{capitalize(skillLevel)}</div>
      </header>

      <div className={styles.practiceDetails}>
        {practice.customDirections && (
          <div className={styles.directions}>
            <h4>DIRECTIONS</h4>
            <p>{practice.customDirections}</p>
          </div>
        )}
        

        {practice.practiceTips && practice.practiceTips.length > 0 && (
          <div className={styles.tips}>
            <h4>PRACTICE TIPS</h4>
            <ul>
              {practice.practiceTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <PracticeRenderer practice={practice} skillLevel={skillLevel}/>

      </div>
    </div>
  );
};

export default PracticePage; 