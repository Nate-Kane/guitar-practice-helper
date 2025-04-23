import { FC } from "react";
import styles from '../practices.module.css';

interface StringLimit {
    currentStringLimit: string;
    onRegenerateStringLimit: () => void;
}

export const StringLimitDisplay: FC<StringLimit> = ({ currentStringLimit, onRegenerateStringLimit}) => {
    return (
        <div className={`${styles.practiceDataContainer}`}>
            <div className={`${styles.practiceInfo}`}>
                <h4>Only use strings &nbsp; <span className={`${styles.spanHighlight}`}>{currentStringLimit}</span></h4>
            </div>
            <button 
                className="button button-secondary button-regen"
                onClick={onRegenerateStringLimit}
            >
                &#8635;
            </button>
        </div>
    )
}