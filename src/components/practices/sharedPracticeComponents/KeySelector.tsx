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
  
  const filterTriggerClass =
    'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border-2 shadow-sm h-10 rounded-lg px-4 w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-50/30 border-stone-50/25 bg-stone-50/5 text-stone-50 hover:bg-stone-50/10 hover:border-stone-50/40';

  const dropdownMenuClass =
    'absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-10 overflow-hidden bg-zinc-800/95 border border-stone-50/25 backdrop-blur-sm';

  const dropdownOptionClass = (isSelected: boolean, rounded: 't' | 'b' | 'none') =>
    [
      'w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer',
      rounded === 't' ? 'rounded-t-md' : '',
      rounded === 'b' ? 'rounded-b-md' : '',
      isSelected
        ? 'bg-stone-300 text-zinc-800 font-medium'
        : 'text-stone-300 hover:bg-stone-50/10 hover:text-stone-50',
    ].join(' ');

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="key-selector-title"
    >
      <div className="rounded-lg shadow-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 id="key-selector-title" className="text-xl font-bold text-stone-50">
            Select a Key
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close key selector"
            className="text-2xl text-stone-400 hover:text-stone-50 cursor-pointer leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <div className="relative min-w-[150px] flex-1" ref={qualityDropdownRef}>
            <button
              type="button"
              onClick={() => setIsQualityDropdownOpen(!isQualityDropdownOpen)}
              className={filterTriggerClass}
            >
              {qualityFilter}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ml-2 h-4 w-4 text-stone-300 transition-transform ${isQualityDropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isQualityDropdownOpen && (
              <div className={dropdownMenuClass}>
                <button
                  type="button"
                  onClick={() => {
                    setQualityFilter('Major');
                    setIsQualityDropdownOpen(false);
                  }}
                  className={dropdownOptionClass(qualityFilter === 'Major', 't')}
                >
                  Major
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQualityFilter('Minor');
                    setIsQualityDropdownOpen(false);
                  }}
                  className={dropdownOptionClass(qualityFilter === 'Minor', 'b')}
                >
                  Minor
                </button>
              </div>
            )}
          </div>

          <div className="relative min-w-[150px] flex-1" ref={sharpsDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSharpsDropdownOpen(!isSharpsDropdownOpen)}
              className={filterTriggerClass}
            >
              {onlyShowSharps ? 'Sharps' : 'No sharps'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ml-2 h-4 w-4 text-stone-300 transition-transform ${isSharpsDropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isSharpsDropdownOpen && (
              <div className={dropdownMenuClass}>
                <button
                  type="button"
                  onClick={() => {
                    setOnlyShowSharps(false);
                    setIsSharpsDropdownOpen(false);
                  }}
                  className={dropdownOptionClass(!onlyShowSharps, 't')}
                >
                  No sharps
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOnlyShowSharps(true);
                    setIsSharpsDropdownOpen(false);
                  }}
                  className={dropdownOptionClass(onlyShowSharps, 'b')}
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
              type="button"
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 h-9 rounded-lg px-3 text-sm border-2 border-amber-900 text-stone-50 bg-zinc-800/50 hover:bg-amber-900 cursor-pointer shadow-sm"
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
          <p className="text-center text-stone-400 italic my-5">
            No keys match your filter criteria.
          </p>
        )}

        <div className="mt-7">
          <p className="text-sm text-stone-300">
            * The keys you can choose from are limited by your selected practice level. 
            <br/>
            * To see more or less keys, change your practice level
            <br/>
            * Your currently selected practice level is {' '}
            <span className="text-amber-400 font-medium">
              {skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeySelector; 