import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

interface SkillCardProps {
  title: string;
  description: string;
  icon: string;
  level: string;
  onClick: () => void;
}

const SkillCard: FC<SkillCardProps> = ({ title, description, icon, onClick }) => (
  <div className={styles.skillCard} onClick={onClick}>
    <div className={styles.icon}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const LandingPage: FC = () => {
  const navigate = useNavigate();

  const handleSkillLevelClick = (level: string) => {
    localStorage.setItem('skillLevel', level);
    navigate('/practices');
  }

  const skillLevels = [
    {
      title: 'Beginner Player',
      description: 'I know some simple chords and scales. I want to start learning to play around the neck.',
      icon: '🌱',
      level: 'beginner'
    },
    {
      title: 'Intermediate Player',
      description: 'I know lots of chords and scales and can play around the neck. I want to become even more proficient and well versed.',
      icon: '🌿',
      level: 'intermediate'
    },
    {
      title: 'Advanced Player',
      description: "I understand guitar and music theory well. I'm looking to switch up my practice routine and play with new ideas.",
      icon: '🌳',
      level: 'advanced'
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1>Your personal guitar practice assistant</h1>
        <p className={styles.subtitle}>
          Randomized practice routines to help you break out of the box
        </p>
      </header>

      <section className={styles.skillLevels}>
        <h2>I am a...</h2>
        <div className={styles.skillLevelContainer}>
          {skillLevels.map((skillLevel, index) => (
            <SkillCard 
              key={index} 
              {...skillLevel} 
              onClick={() => handleSkillLevelClick(skillLevel.level)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 