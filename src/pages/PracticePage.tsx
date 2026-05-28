import { FC, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPracticeById } from '../services/practiceService';
import { Practice } from '../types/practice';
import PracticeRenderer from '../components/practices/PracticeRenderer';
import DirectionsSection from '../components/practices/sharedPracticeComponents/DirectionsSection';
import PracticeTipsSection from '../components/practices/sharedPracticeComponents/PracticeTipsSection';
import {
  FRETBOARD_MAPPER_DIRECTIONS,
  FRETBOARD_MAPPER_PRACTICE_TIPS,
} from '../components/practices/FretboardMapper/practiceContent';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  if (isLoading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-[1280px]">
        <div className="min-h-[255px] flex items-center justify-center">
          <div className="text-center text-amber-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
            <div>Loading practice...</div>
          </div>
        </div>
      </main>
    );
  }

  const isFretboardMapper = practice?.title === 'Fretboard Mapper';
  const directions =
    practice?.customDirections ||
    (isFretboardMapper ? FRETBOARD_MAPPER_DIRECTIONS : undefined);
  const practiceTips =
    practice?.practiceTips && practice.practiceTips.length > 0
      ? practice.practiceTips
      : isFretboardMapper
        ? FRETBOARD_MAPPER_PRACTICE_TIPS
        : undefined;

  if (error || !practice) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-[1280px]">
        <div className="min-h-[255px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error || 'Practice not found'}</div>
            <button 
              onClick={() => navigate('/practices')}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-9 px-4 py-2 border-amber-300 border-amber-800 hover:bg-amber-100 hover:bg-amber-900/50"
            >
              Back to Practices
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-[1280px]">
      <div
        className={
          isFretboardMapper
            ? 'mx-auto w-full max-w-[1000px] space-y-8'
            : 'space-y-8'
        }
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <a 
                href="javascript:void(0)"
                onClick={() => navigate('/practices')}
                className="text-amber-900 px-0 hover:bg-amber-900 hover:text-stone-50 hover:px-2 p-1 flex items-center rounded-lg transition-all duration-100 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left h-4 w-4 mr-1" aria-hidden="true">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                Back to practices
              </a>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 text-amber-100">
              {practice.title}
            </h1>
          </div>
          <div className="relative inline-flex" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors shadow h-10 px-4 text-stone-50 bg-amber-900 hover:bg-amber-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-500"
            >
              Difficulty:&nbsp; {capitalize(skillLevel)}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 md:right-0 md:left-auto mt-1 bg-white border border-amber-900/30 rounded-lg shadow-lg z-10 w-full overflow-hidden">
                {(['basics', 'intermediate', 'advanced'] as const).map((level, index, levels) => (
                  <button
                    key={level}
                    onClick={() => {
                      onSkillSelect(level);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                      index === 0 ? 'rounded-t-lg' : ''
                    } ${index === levels.length - 1 ? 'rounded-b-lg' : ''} ${
                      skillLevel === level
                        ? 'bg-amber-900 text-stone-50'
                        : 'text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    {capitalize(level)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {directions && <DirectionsSection directions={directions} />}

        {practiceTips && practiceTips.length > 0 && (
          <PracticeTipsSection tips={practiceTips} />
        )}

        {/* Practice Content */}
        <PracticeRenderer practice={practice} skillLevel={skillLevel}/>
      </div>
    </main>
  );
};

export default PracticePage; 