import { FC, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

interface SkillCardProps {
  title: string;
  description: string;
  icon: string;
  level: string;
  onClick: () => void;
}

interface LandingPageProps {
  onSkillSelect: (level: string) => void;
}

const SkillCard: FC<SkillCardProps> = ({ title, description, icon, onClick }) => (
  <div className="card card-clickable" onClick={onClick}>
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const LandingPage: FC<LandingPageProps> = ({ onSkillSelect }) => {
  const navigate = useNavigate();

  const handleSkillLevelClick = (level: string) => {
    onSkillSelect(level);
    navigate('/practices');
  }

  const skillLevels = [
    {
      title: 'Beginning Guitarist',
      description: 'I know some simple chords and scales. I want to start learning to play around the neck.',
      icon: '🌱',
      level: 'beginner'
    },
    {
      title: 'Intermediate Guitarist',
      description: 'I know lots of chords and scales and can play around the neck. I want to become even more proficient and well versed.',
      icon: '🌿',
      level: 'intermediate'
    },
    {
      title: 'Advanced Guitarist',
      description: "I understand guitar and music theory well. I'm looking to switch up my practice routine and play with new ideas.",
      icon: '🌳',
      level: 'advanced'
    }
  ];

  // CSS-in-JS styles for page-specific modifications
  const styles: Record<string, CSSProperties> = {
    landingPageHeader: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  };

  return (
    <div className="container">
      <header className="header" style={styles.landingPageHeader}>
        <h1>Your personal guitar practice assistant</h1>
        <p className="header-subtitle">
          Randomized practice routines to help you break out of the box
        </p>
      </header>

      <section>
        <h2>I am a...</h2>
        <div className="card-container">
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