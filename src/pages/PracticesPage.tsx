import { FC, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPracticesBySkillLevel } from '../services/practiceService';
import { Practice } from '../types/practice';
import fretboardImg from '../assets/fretboard_img.png';

interface PracticesPageProps {
    skillLevel: string;
    onSkillSelect: (level: string) => void;
}

const PracticesPage: FC<PracticesPageProps> = ({ skillLevel, onSkillSelect }) => {
    const navigate = useNavigate();
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const [practices, setPractices] = useState<Practice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPractices = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const practices = await getPracticesBySkillLevel(skillLevel);
                setPractices(practices.filter(p => p.title !== 'Fretboard Mapper' && p.id !== 'fretboard-mapper'));
            } catch (error) {
                console.error('Error fetching practices:', error);
                setError('Failed to load practices. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPractices();
    }, [skillLevel]);

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

    const handleSwitchClick = (practiceId: string) => {
        setTimeout(() => {
            navigate(`/practice/${practiceId}`);
        }, 650);
    };

    const filteredPractices = practices.filter(practice => 
        practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        practice.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderPractices = () => {
        if (isLoading) {
            return (
                <div className="min-h-[255px] flex items-center justify-center">
                    <div className="text-center text-amber-700">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
                        Loading practices...
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="min-h-[255px] flex items-center justify-center">
                    <div className="text-center text-red-600">{error}</div>
                </div>
            );
        }

        if (practices.length === 0) {
            return (
                <div className="min-h-[255px] flex items-center justify-center">
                    <div className="text-center text-amber-700">No practices available for this skill level.</div>
                </div>
            );
        }

        if (filteredPractices.length === 0 && searchQuery) {
            return (
                <div className="min-h-[255px] flex items-center justify-center">
                    <div className="text-center text-amber-700">
                        <div className="mb-2">No practices found matching "{searchQuery}"</div>
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="text-sm text-amber-600 hover:text-amber-800 underline cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPractices.map((practice, index) => {
                    // Define different icons for each practice
                    const icons = [
                        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/>,
                        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>,
                        <path d="M9 18V5l12-2v13"/>,
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>,
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
                    ];
                    
                    const iconPaths = icons[index % icons.length];
                    
                    return (
                        <div 
                            className="rounded-xl border shadow overflow-hidden transition-all duration-300 bg-gradient-to-br from-zinc-900 to-zinc-800 border-amber-800/30 hover:border-amber-600"
                            key={practice.id}
                        >
                            <div className="p-6">
                                <div className="flex items-start">
                                    <div className="bg-amber-800 p-3 rounded-md mr-4 text-amber-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                                            {iconPaths}
                                            {/* Additional paths for specific icons */}
                                            {index === 0 && (
                                                <>
                                                    <path d="M15 5.764v15"></path>
                                                    <path d="M9 3.236v15"></path>
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                                                    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <circle cx="6" cy="18" r="3"></circle>
                                                    <circle cx="18" cy="16" r="3"></circle>
                                                </>
                                            )}
                                            {index >= 3 && (
                                                <circle cx="12" cy="12" r="10"></circle>
                                            )}
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-amber-100 mb-1">{practice.title}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3 ${
                                            skillLevel === 'basics' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                            skillLevel === 'intermediate' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                            'bg-rose-100 text-rose-800 border-rose-200'
                                        }`}>
                                            {capitalize(skillLevel)}
                                        </span>
                                        <p className="text-amber-200/80 line-clamp-3">{practice.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="items-center bg-black/20 p-4 flex justify-end">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSwitchClick(practice.id || '');
                                    }}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white flex items-center cursor-pointer"
                                >
                                    Practice 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            <div className="space-y-10">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-amber-700 p-4 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-amber-100">
                                <path d="m11.9 12.1 4.514-4.514"></path>
                                <path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z"></path>
                                <path d="m6 16 2 2"></path>
                                <path d="M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-amber-900">Guitar Practice Tools</h1>
                    <p className="text-xl text-amber-800 max-w-2xl mx-auto">
                        Improve your guitar skills with our collection of interactive practice tools and exercises designed for players of all levels.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={() => navigate('/practice/xsFrdqxeyLbFM2puHGMs')}
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors shadow h-10 rounded-md px-8 bg-amber-700 hover:bg-amber-600 text-white cursor-pointer"
                        >
                            Fretboard Mapper
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border shadow-sm h-10 rounded-md px-4 border-amber-700 text-amber-700 hover:bg-amber-100 cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                Difficulty: {capitalize(skillLevel)}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 h-4 w-4 text-amber-700 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-amber-700 rounded-md shadow-lg z-10">
                                    <button
                                        onClick={() => {
                                            onSkillSelect('basics');
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-100 transition-colors ${skillLevel === 'basics' ? 'bg-amber-50 text-amber-800' : 'text-amber-700'}`}
                                    >
                                        Basics
                                    </button>
                                    <button
                                        onClick={() => {
                                            onSkillSelect('intermediate');
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-100 transition-colors ${skillLevel === 'intermediate' ? 'bg-amber-50 text-amber-800' : 'text-amber-700'}`}
                                    >
                                        Intermediate
                                    </button>
                                    <button
                                        onClick={() => {
                                            onSkillSelect('advanced');
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-100 transition-colors ${skillLevel === 'advanced' ? 'bg-amber-50 text-amber-800' : 'text-amber-700'}`}
                                    >
                                        Advanced
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Practice Methods Section */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-3xl font-bold text-amber-900">Practice Methods</h2>
                        <div className="relative w-full md:w-64">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4">
                                <path d="m21 21-4.34-4.34"></path>
                                <circle cx="11" cy="11" r="8"></circle>
                            </svg>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors pl-10 border-amber-300 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
                                placeholder="Search practices..."
                            />
                        </div>
                    </div>
                    
                    {renderPractices()}
                </section>

                {/* Featured Fretboard Mapper Section */}
                <section className="bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 rounded-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">Fretboard Mapper</h2>
                            <p className="text-amber-100">
                                Our interactive fretboard tool helps you visualize notes, scales, and patterns across the guitar neck. Perfect for beginners learning the fretboard or advanced players exploring new musical concepts.
                            </p>
                            <button 
                                onClick={() => navigate('/practice/xsFrdqxeyLbFM2puHGMs')}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 bg-amber-100 hover:bg-white text-amber-900 cursor-pointer"
                            >
                                Check it out
                            </button>
                        </div>
                        <div className="bg-black/10 rounded-lg p-2">
                            <div 
                                className="cursor-pointer hover:scale-101 transition-transform"
                                onClick={() => navigate('/practice/xsFrdqxeyLbFM2puHGMs')}
                            >
                                <img 
                                    src={fretboardImg} 
                                    alt="Interactive Fretboard Visualization" 
                                    className="w-full rounded border-2 border-amber-600 shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default PracticesPage; 