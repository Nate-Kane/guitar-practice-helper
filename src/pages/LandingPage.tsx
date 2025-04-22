import { FC, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

interface SkillCardProps {
  title: string;
  description: string;
  icon: string;
  level: string;
  onClick: () => void;
  style?: CSSProperties;
}

interface LandingPageProps {
  onSkillSelect: (level: string) => void;
}

// CSS-in-JS styles for page-specific modifications
const styles: Record<string, CSSProperties> = {
  landingPageHeader: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  card: {
    minWidth: '100%'
  },
  skillCard: {
    display: 'flex',
    minWidth: '100%',
  },
  cardH3: {
    marginBottom: '0'
  },
  icon: {
    marginLeft: 'auto'
  }
};

const SkillCard: FC<SkillCardProps> = ({ title, icon, onClick }) => (
  <div className="card card-clickable" onClick={onClick} style={styles.skillCard}>
    <h3 style={styles.cardH3}>{title}</h3>
    <div className="icon" style={styles.icon}>{icon}</div>
    {/* <p>{description}</p> */}
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
      title: "Master the basics",
      description: "Simple chords. Simple scales. Learn and master the basics.",
      icon: '🌱',
      level: 'basics'
    },
    {
      title: "Intermediate practice",
      description: 'Use and solidify your knowledge of the basics while introducing more complex ideas.',
      icon: '🌿',
      level: 'intermediate'
    },
    {
      title: "Advanced exercises",
      description: "You know your stuff. Now it's time to become more well rounded and find new sounds.",
      icon: '🌳',
      level: 'advanced'
    }
  ];


  return (
    <div className="container">
      <header className="header" style={styles.landingPageHeader}>
        <h1>Practice Assistant</h1>
        <p className="header-subtitle">
          Randomized practice routines to help you break out of the box
        </p>
      </header>

      <section>
        <div className="card-container">
          {skillLevels.map((skillLevel, index) => (
            <SkillCard 
              key={index} 
              {...skillLevel} 
              onClick={() => handleSkillLevelClick(skillLevel.level)}
              style={styles.card}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 