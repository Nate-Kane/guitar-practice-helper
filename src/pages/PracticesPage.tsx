import { FC } from 'react';
import styles from './PracticesPage.module.css';

const PracticesPage: FC = () => {

    const skillLevels = [
        {
            title: "Solo Improvisation",
            description: "Randomized chords, tempo (if using a metronome), and time signature. Play by yourself."
        }
    ]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Practice Methods</h1>
      </header>
      <div className={styles.practiceMethodsContainer}>
        {skillLevels.map((method, index) => (
            <div className={styles.practiceMethodCard} key={index}>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PracticesPage; 