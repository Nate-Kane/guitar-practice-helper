import { useEffect, useState } from "react";

export const useStringLimitGenerator = () => {
    const [currentStringLimit, setStringLimit] = useState<string>("");

    const strings = ["Low E", "A", "D", "G", "B", "High E"];

    const generateStringGroups = () => {
        const groups = [];
        
        // Generate groups of 3 strings
        for (let i = 0; i <= strings.length - 3; i++) {
            groups.push(strings.slice(i, i + 3).join(", "));
        }
        
        // Generate groups of 2 strings
        for (let i = 0; i <= strings.length - 2; i++) {
            groups.push(strings.slice(i, i + 2).join(", "));
        }
        
        return groups;
    }

    const generateStringLimit = () => {
        const groups = generateStringGroups();
        const randomIndex = Math.floor(Math.random() * groups.length);
        return groups[randomIndex];
    }

    const generateNewStringLimit = () => {
        let newStringLimit = generateStringLimit();
        let regenAttempts = 0;
    
        while(newStringLimit === currentStringLimit && regenAttempts < 5) {
            newStringLimit = generateStringLimit();
            regenAttempts++;
        }
    
        setStringLimit(newStringLimit);
        return newStringLimit;
    };

    useEffect(() => {
        setStringLimit(generateStringLimit());
    }, []);

    return {
        currentStringLimit,
        generateNewStringLimit
    }
}