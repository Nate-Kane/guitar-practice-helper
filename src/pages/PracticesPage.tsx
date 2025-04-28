import { FC, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PracticesPage.module.css';
import { getPracticesBySkillLevel } from '../services/practiceService';
import { Practice } from '../types/practice';
import IntroAnimation from '../components/IntroAnimation';

interface PracticesPageProps {
    skillLevel: string;
    onSkillSelect: (level: string) => void;
}

const PracticesPage: FC<PracticesPageProps> = ({ skillLevel, onSkillSelect }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const [practices, setPractices] = useState<Practice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showIntro, setShowIntro] = useState(false);
    const [disableInteractions, setDisableInteractions] = useState(false);
    const [activeSwitch, setActiveSwitch] = useState<string | null>(null);

    useEffect(() => {
        const fetchPractices = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const practices = await getPracticesBySkillLevel(skillLevel);
                setPractices(practices);
            } catch (error) {
                console.error('Error fetching practices:', error);
                setError('Failed to load practices. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPractices();
    }, [skillLevel]);

    useEffect(() => {
        if (location.pathname === '/') {
            setShowIntro(true);
            setDisableInteractions(true);
            
            const timer = setTimeout(() => {
                setShowIntro(false);
                setDisableInteractions(false);
            }, 3500);
            
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    const handleSkillLevelClick = (level: string) => {
        const skillLevels = ['basics', 'intermediate', 'advanced'];
        let currentLevel = skillLevels.indexOf(level);
        const nextIndex = (currentLevel + 1) % skillLevels.length;
        onSkillSelect(skillLevels[nextIndex])
    }

    const handleSwitchClick = (practiceId: string) => {
        setActiveSwitch(practiceId);
        
        setTimeout(() => {
            navigate(`/practice/${practiceId}`);
        }, 650);
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="loading-message">Loading practices...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (practices.length === 0) {
            return <div className="empty-message">No practices available for this skill level.</div>;
        }

        return (
            <div className="card-container">
                {practices.map((practice) => (
                    <div 
                        className={`card card-clickable ${styles.practiceCard}`} 
                        key={practice.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchClick(practice.id || '');
                        }}
                    >
                        <div className={styles["rivet-top-left"]}></div>
                        <div className={styles["rivet-bottom-left"]}></div>
                        <div className={styles["rivet-bottom-right"]}></div>
                        <h3>{practice.title}</h3>
                        <p>
                            <span>{practice.description}</span>
                            <div className={styles["switch-container"]}>
                                <div className={`${styles["toggle-switch"]} ${activeSwitch === practice.id ? styles.active : ''}`}>
                                    <div className={styles["toggle-handle"]}></div>
                                    <div className={styles["switch-labels"]}>
                                        <span>ON</span>
                                        <span>OFF</span>
                                    </div>
                                </div>
                                <div className={`${styles["indicator-light"]} ${activeSwitch === practice.id ? styles.active : ''}`}></div>
                            </div>
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`container ${disableInteractions ? styles.disableInteractions : ''}`}>
            {showIntro && <IntroAnimation />}
            <header className={`header ${styles.practicePageHeader}`}>
                <h1>Practice Methods</h1>
                <div 
                    className={`button button-secondary ${styles.rightButton}`}
                    onClick={() => handleSkillLevelClick(skillLevel)}
                >{capitalize(skillLevel)}</div>
            </header>
            {renderContent()}
        </div>
    );
};

export default PracticesPage; 