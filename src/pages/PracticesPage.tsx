import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PracticesPage.module.css';
import { useWindowSize } from '../hooks/useWindowSize';

const MOBILE_BREAKPOINT = 960;

interface PracticesPageProps {
    skillLevel: string;
    onSkillSelect: (level: string) => void;
}

const PracticesPage: FC<PracticesPageProps> = ({ skillLevel, onSkillSelect }) => {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

    const handleSkillLevelClick = (level: string) => {
        const skillLevels = ['beginner', 'intermediate', 'advanced'];
        let currentLevel = skillLevels.indexOf(level);
        const nextIndex = (currentLevel + 1) % skillLevels.length;
        onSkillSelect(skillLevels[nextIndex])
    }
    
    const skillLevels = [
        {
            title: "Solo Improvisation",
            description: "Randomized chords, tempo (if using metronome), and time signature. Play by yourself."
        }
    ];

    const renderDesktopHeader = () => (
        <header className={`header ${styles.desktopHeader} ${styles.practicePageHeader}`}>
            <div 
                className={`button button-secondary ${styles.leftButton}`}
                onClick={() => navigate('/')}
            >Go Back</div>
            <h1>Practice Methods</h1>
            <div 
                className={`button button-secondary ${styles.rightButton}`}
                onClick={() => handleSkillLevelClick(skillLevel)}
            >{capitalize(skillLevel)}</div>
        </header>
    );

    const renderMobileHeader = () => (
        <header className={`header ${styles.mobileHeader} ${styles.practicePageHeader}`}>
            <h1>Practice Methods</h1>
            <div className={styles.buttonContainer}>
                <div 
                    className="button button-secondary"
                    onClick={() => navigate('/')}
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
            <div className="card-container">
                {skillLevels.map((method, index) => (
                    <div className={`card  ${styles.practiceCard}`} key={index}>
                        <h3>{method.title}</h3>
                        <p>{method.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PracticesPage; 