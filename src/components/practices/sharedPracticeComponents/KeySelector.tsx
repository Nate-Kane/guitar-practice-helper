import { FC, useState, useRef, useEffect } from 'react';
import { ALL_KEYS, basics_KEYS, INTERMEDIATE_KEYS, Key } from '../../../assets/practiceAssets/keys';

interface KeySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  skillLevel: string;
  onSelectKey: (key: Key) => void;
}

const KeySelector: FC<KeySelectorProps> = ({ isOpen, onClose, skillLevel, onSelectKey }) => {
  if (!isOpen) return null;
  
  const [qualityFilter, setQualityFilter] = useState<string>("Major");
  const [onlyShowSharps, setOnlyShowSharps] = useState<boolean>(false);
  const [isQualityDropdownOpen, setIsQualityDropdownOpen] = useState(false);
  const [isSharpsDropdownOpen, setIsSharpsDropdownOpen] = useState(false);
  
  const qualityDropdownRef = useRef<HTMLDivElement>(null);
  const sharpsDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (qualityDropdownRef.current && !qualityDropdownRef.current.contains(event.target as Node)) {
        setIsQualityDropdownOpen(false);
      }
      if (sharpsDropdownRef.current && !sharpsDropdownRef.current.contains(event.target as Node)) {
        setIsSharpsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  let availableKeys: Key[] = [];
  switch(skillLevel) {
    case "basics":
      availableKeys = basics_KEYS;
      break;
    case "intermediate":
      availableKeys = [...basics_KEYS, ...INTERMEDIATE_KEYS];
      break;
    case "advanced":
      availableKeys = ALL_KEYS;
      break;
    default:
      availableKeys = basics_KEYS;
  }
  
  const filteredKeys = availableKeys.filter(key => {
    if (key.quality !== qualityFilter.toLowerCase()) {
      return false;
    }
    
    if (onlyShowSharps !== key.root.includes('#')) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex justify-center items-center z-[1000]">
      <div className="bg-white rounded-xl p-6 w-4/5 max-w-2xl max-h-[80vh] overflow-y-auto border border-amber-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-amber-900">Select a Key</h3>
          <button 
            onClick={onClose}
            className="text-2xl text-amber-900 cursor-pointer leading-none mb-2"
          >
            &times;
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          {/* Quality Filter Dropdown */}
          <div className="relative min-w-[150px]" ref={qualityDropdownRef}>
            <button
              onClick={() => setIsQualityDropdownOpen(!isQualityDropdownOpen)}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border shadow-sm h-10 rounded-md px-4 border-amber-700 text-amber-700 bg-amber-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
            >
              Quality: {qualityFilter}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 h-4 w-4 text-amber-700 transition-transform ${isQualityDropdownOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
            
            {isQualityDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-amber-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setQualityFilter("Major");
                    setIsQualityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-100 transition-colors rounded-t-md ${qualityFilter === "Major" ? 'bg-amber-50 text-amber-800' : 'text-amber-700'}`}
                >
                  Major
                </button>
                <button
                  onClick={() => {
                    setQualityFilter("Minor");
                    setIsQualityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-100 transition-colors rounded-b-md ${qualityFilter === "Minor" ? 'bg-amber-50 text-amber-800' : 'text-amber-700'}`}
                >
                  Minor
                </button>
              </div>
            )}
          </div>
          
          {/* Sharps Filter Dropdown */}
          <div className="relative min-w-[150px]" ref={sharpsDropdownRef}>
            <button
              onClick={() => setIsSharpsDropdownOpen(!isSharpsDropdownOpen)}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border shadow-sm h-10 rounded-md px-4 border-amber-700 text-amber-700 bg-amber-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
            >
              Keys: {onlyShowSharps ? "Sharps" : "No sharps"}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 h-4 w-4 text-amber-700 transition-transform ${isSharpsDropdownOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
            
            {isSharpsDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-amber-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setOnlyShowSharps(false);
                    setIsSharpsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-100 transition-colors rounded-t-md ${!onlyShowSharps ? 'bg-amber-50 text-amber-800' : 'text-amber-700'}`}
                >
                  No sharps
                </button>
                <button
                  onClick={() => {
                    setOnlyShowSharps(true);
                    setIsSharpsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-100 transition-colors rounded-b-md ${onlyShowSharps ? 'bg-amber-50 text-amber-800' : 'text-amber-700'}`}
                >
                  Sharps
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 mt-4">
          {filteredKeys.map((key) => (
            <button
              key={key.name}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-white shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs border-amber-700 hover:bg-amber-100 cursor-pointer text-amber-700"
              onClick={() => {
                onSelectKey(key);
                onClose();
              }}
            >
              {key.name}
            </button>
          ))}
        </div>
        
        {filteredKeys.length === 0 && (
          <p className="text-center text-amber-900 italic my-5">No keys match your filter criteria.</p>
        )}
        
        <div className="mt-7">
          <p className="text-sm text-amber-900/60">*The available keys are dependent on your selected practice level!</p>
        </div>
      </div>
    </div>
  );
};

export default KeySelector; 