import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPracticeBySlugOrId } from '../services/practiceService';
import { Practice } from '../types/practice';
import PracticeRenderer from '../components/practices/PracticeRenderer';
import DirectionsSection from '../components/practices/sharedPracticeComponents/DirectionsSection';
import PracticeTipsSection from '../components/practices/sharedPracticeComponents/PracticeTipsSection';
import { getPracticePath } from '../utils/slug';

const PracticePage: FC = () => {
  const { slugOrId: id } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPractice = async () => {
      if (!id) {
        setError('Practice ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const practiceData = await getPracticeBySlugOrId(id);
        if (!practiceData) {
          setError('Practice not found');
        } else {
          setPractice(practiceData);
          // Prefer pretty slug URLs when available
          const prettyPath = getPracticePath(practiceData);
          if (prettyPath !== `/practice/${id}`) {
            navigate(prettyPath, { replace: true });
          }
        }
      } catch (error) {
        console.error('Error fetching practice:', error);
        setError('Failed to load practice data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPractice();
  }, [id, navigate]);

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

  const isFretboardMap =
    practice.title === 'Fretboard Map' || practice.title === 'Fretboard Mapper';
  const directions = practice.customDirections;
  const practiceTips =
    practice.practiceTips && practice.practiceTips.length > 0
      ? practice.practiceTips
      : undefined;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-[1280px]">
      <div
        className={
          isFretboardMap
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
        </div>

        {directions && <DirectionsSection directions={directions} />}

        {practiceTips && practiceTips.length > 0 && (
          <PracticeTipsSection tips={practiceTips} />
        )}

        {/* Practice Content */}
        <PracticeRenderer practice={practice}/>
      </div>
    </main>
  );
};

export default PracticePage; 