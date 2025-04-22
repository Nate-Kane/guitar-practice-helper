import { FC } from 'react';
import { useKeyGenerator } from '../shared/hooks/useKeyGenerator';
import KeyDisplay from '../shared/KeyDisplay';

interface FretboardFreedomProps {
    skillLevel: string;
}

const FretboardFreedom: FC<FretboardFreedomProps> = ({ skillLevel }) => {
    const { currentKey, generateNewKey } = useKeyGenerator(skillLevel);

    return (
        <div>
            <KeyDisplay 
                currentKey={currentKey} 
                onRegenerateKey={generateNewKey} 
            />
    
            {/* add fret limitations */}

            {/* add tempo & time signature */}
        </div>
    );
};

export default FretboardFreedom;