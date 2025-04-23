import { FC } from "react";
import styles from '../practices.module.css';



interface FretLimit {
    currentFretLimit: string;
    onRegenerateFretLimit: () => void;
}

const FretLimitDisplay: FC<FretLimit> = ({ currentFretLimit, onRegenerateFretLimit }) => {

    return (
        <div className={`${styles.practiceDataContainer}`}>
            <div className={`${styles.practiceInfo}`}>
                <h4>Only use frets <span className={`${styles.spanHighlight}`}>{currentFretLimit}</span></h4>
            </div>
            <button 
                className="button button-secondary button-regen"
                onClick={onRegenerateFretLimit}
            >
                &#8635;
            </button>
        </div>
    )
}

export default FretLimitDisplay;