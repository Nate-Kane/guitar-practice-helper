import { FC } from 'react';
import { Key } from '../../../assets/practiceAssets/keys';
import KeySelector from './KeySelector';

interface KeyDisplayProps {
  currentKey: Key | null;
  onRegenerateKey: () => void;
  skillLevel: string;
  isKeySelectorOpen: boolean;
  openKeySelector: () => void;
  closeKeySelector: () => void;
  onSelectKey: (key: Key) => void;
}

const KeyDisplay: FC<KeyDisplayProps> = ({ 
  currentKey, 
  onRegenerateKey, 
  skillLevel,
  isKeySelectorOpen,
  openKeySelector,
  closeKeySelector,
  onSelectKey
}) => {
  if (!currentKey) return null;
  
  return (
    <div className="space-y-4">
      {/* Select a Key Section */}
      <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
        Select a Key
      </h2>
      
      {/* Key Selector Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <button 
            type="button" 
            role="combobox" 
            aria-expanded={isKeySelectorOpen}
            onClick={openKeySelector}
            className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 cursor-pointer"
          >
            <span style={{ pointerEvents: 'none' }}>
              {currentKey.name} ({currentKey.relativeKey})
            </span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" aria-hidden="true">
              <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <button 
          onClick={onRegenerateKey}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-9 px-4 py-2 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw h-4 w-4 mr-2" aria-hidden="true">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 16H3v5"></path>
          </svg>
          Random Key
        </button>
      </div>
      
      {/* Key Information Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow border-amber-200 dark:border-amber-800">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                Key of {currentKey.name} ({currentKey.relativeKey})
              </h3>
              <p className="text-amber-800 dark:text-amber-200">
                The notes of {currentKey.name.split(' ')[0]} are {currentKey.notes.join(', ')}
              </p>
            </div>
            <button 
              onClick={onRegenerateKey}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 self-end sm:self-auto cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw h-4 w-4 mr-2" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              Change Key
            </button>
          </div>
        </div>
      </div>
      
      <KeySelector
        isOpen={isKeySelectorOpen}
        onClose={closeKeySelector}
        skillLevel={skillLevel}
        onSelectKey={onSelectKey}
      />
    </div>
  );
};

export default KeyDisplay;
