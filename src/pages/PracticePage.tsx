import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPracticeById } from '../services/practiceService';
import { Practice } from '../types/practice';
import styles from './PracticePage.module.css';
import { useWindowSize } from '../hooks/useWindowSize';

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
    const skillLevels = ['beginner', 'intermediate', 'advanced'];
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
  
  const renderDesktopHeader = () => (
    <header className={`header ${styles.desktopHeader} ${styles.practicePageHeader}`}>
      <div 
        className={`button button-secondary ${styles.leftButton}`}
        onClick={() => navigate('/practices')}
      >Go Back</div>
      <h1>{practice.title}</h1>
      <div 
          className={`button button-secondary  ${styles.rightButton}`}
          onClick={() => handleSkillLevelClick(skillLevel)}
      >{capitalize(skillLevel)}</div>
    </header>
  );

  const renderMobileHeader = () => (
    <header className={`header ${styles.mobileHeader} ${styles.practicePageHeader}`}>
      <h1>{practice.title}</h1>
      <div className={styles.buttonContainer}>
        <div 
          className="button button-secondary"
          onClick={() => navigate('/practices')}
        >Go Back</div>
        <div 
          className="button button-secondary"
          onClick={() => handleSkillLevelClick(skillLevel)}
        >{capitalize(skillLevel)}</div>
      </div>
    </header>
  );

  return (
    <div className="container">
      {width > MOBILE_BREAKPOINT ? renderDesktopHeader() : renderMobileHeader()}

      <div className="card">
        <div className={styles.practiceDetails}>
          {practice.customDirections && (
            <div className={styles.directions}>
              <h3>Directions</h3>
              <p>{practice.customDirections}</p>
            </div>
          )}

          {practice.practiceTips && (
            <div>{practice.practiceTips}</div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PracticePage; 