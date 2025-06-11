import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPracticeById } from '../services/practiceService';
import { Practice } from '../types/practice';
import PracticeRenderer from '../components/practices/PracticeRenderer';

interface PracticePageProps {
  skillLevel: string;
  onSkillSelect: (level: string) => void;
}

const PracticePage: FC<PracticePageProps> = ({skillLevel, onSkillSelect}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const fetchPractice = async () => {
      if (!id) {
        setError('Practice ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const practiceData = await getPracticeById(id);
        if (!practiceData) {
          setError('Practice not found');
        } else {
          setPractice(practiceData);
        }
      } catch (error) {
        console.error('Error fetching practice:', error);
        setError('Failed to load practice data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPractice();
  }, [id]);

  const handleSkillLevelClick = (level: string) => {
    const skillLevels = ['basics', 'intermediate', 'advanced'];
    let currentLevel = skillLevels.indexOf(level);
    const nextIndex = (currentLevel + 1) % skillLevels.length;
    onSkillSelect(skillLevels[nextIndex])
  }

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'basics':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30';
    }
  }

  if (isLoading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="min-h-[255px] flex items-center justify-center">
          <div className="text-center text-amber-700">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
            <div>Loading practice...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !practice) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="min-h-[255px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error || 'Practice not found'}</div>
            <button 
              onClick={() => navigate('/practices')}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-9 px-4 py-2 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              Back to Practices
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <a 
                href="javascript:void(0)"
                onClick={() => navigate('/practices')}
                className="text-amber-700 dark:text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left h-4 w-4 mr-1" aria-hidden="true">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                Back to practices
              </a>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30">
                {capitalize(skillLevel)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 dark:text-amber-100">
              {practice.title}
            </h1>
          </div>
          <button 
            onClick={() => handleSkillLevelClick(skillLevel)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-9 px-4 py-2 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 self-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw h-4 w-4 mr-2" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            Reset Tool
          </button>
        </div>

        {/* Directions Section */}
        {practice.customDirections && (
          <div className="rounded-xl border bg-card text-card-foreground shadow border-amber-200 dark:border-amber-800">
            <div className="flex flex-col space-y-1.5 p-6 bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 pb-3">
              <h3 className="tracking-tight text-lg font-bold flex items-center text-amber-900 dark:text-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                Directions
              </h3>
            </div>
            <div className="p-6 pt-4 bg-amber-50 dark:bg-amber-950/10">
              <p className="text-amber-900 dark:text-amber-200">
                {practice.customDirections}
              </p>
            </div>
          </div>
        )}

        {/* Practice Tips Section */}
        {practice.practiceTips && practice.practiceTips.length > 0 && (
          <div className="rounded-xl border bg-card text-card-foreground shadow border-amber-200 dark:border-amber-800">
            <div className="flex flex-col space-y-1.5 p-6 bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 pb-3">
              <h3 className="tracking-tight text-lg font-bold flex items-center text-amber-900 dark:text-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" aria-hidden="true">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                  <path d="M9 18h6"></path>
                  <path d="M10 22h4"></path>
                </svg>
                Practice Tips
              </h3>
            </div>
            <div className="p-6 pt-4 bg-amber-50 dark:bg-amber-950/10">
              <ul className="list-disc list-inside space-y-2">
                {practice.practiceTips.map((tip, index) => (
                  <li key={index} className="text-amber-900 dark:text-amber-200">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Practice Content */}
        <PracticeRenderer practice={practice} skillLevel={skillLevel}/>
      </div>
    </main>
  );
};

export default PracticePage; 