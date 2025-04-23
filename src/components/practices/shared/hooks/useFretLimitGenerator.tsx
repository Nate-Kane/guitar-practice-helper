import { useState, useEffect } from "react"

export const useFretLimitGenerator = () => {
    const [currentFretLimit, setFretLimit] = useState<string>("0-4");

    const getStartingFret = () => {
        return Math.floor(Math.random() * (17))
    }

    const getFretRange = () => {
        return Math.floor(Math.random() * 2) + 4
    }

    const generateFretLimit = () => {
        const startingFret = getStartingFret();
        const range = getFretRange();
        return `${startingFret}-${startingFret + range}`;
    }

    const generateNewFretLimit = () => {
        let newFretLimit = generateFretLimit();
        let regenAttempts = 0;
    
        while(newFretLimit === currentFretLimit && regenAttempts < 5) {
            newFretLimit = generateFretLimit();
            regenAttempts++;
        }
    
        setFretLimit(newFretLimit);
        return newFretLimit;
    };

    useEffect(() => {
        setFretLimit(generateFretLimit());
    }, []);

    return {
        currentFretLimit,
        generateNewFretLimit
    }
}