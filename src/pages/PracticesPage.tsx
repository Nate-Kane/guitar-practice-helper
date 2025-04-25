import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PracticesPage.module.css';
import { useWindowSize } from '../hooks/useWindowSize';
import { getPracticesBySkillLevel } from '../services/practiceService';
import { Practice } from '../types/practice';

interface PracticesPageProps {
    skillLevel: string;
    onSkillSelect: (level: string) => void;
}

const PracticesPage: FC<PracticesPageProps> = ({ skillLevel, onSkillSelect }) => {
    const navigate = useNavigate();
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const [practices, setPractices] = useState<Practice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSkillLevelClick = (level: string) => {
        const skillLevels = ['basics', 'intermediate', 'advanced'];
        let currentLevel = skillLevels.indexOf(level);
        const nextIndex = (currentLevel + 1) % skillLevels.length;
        onSkillSelect(skillLevels[nextIndex])
    }

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
                        onClick={() => navigate(`/practice/${practice.id}`)}
                    >
                        <h3>{practice.title}</h3>
                        <p>{practice.description}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container">
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