import { FC } from 'react';
import { Practice } from '../../../types/practice'

interface SoloImprovisationProps {
    practice: Practice;
    skillLevel: string;
}

const SoloImprovisation: FC<SoloImprovisationProps> = ({ practice, skillLevel }) => {

    return (
        <div>
            <h3>{practice.title}</h3>
            <h3>{skillLevel}</h3>
        </div>
        
    )
}

export default SoloImprovisation;