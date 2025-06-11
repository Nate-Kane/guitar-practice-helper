import { FC } from 'react';
import { ChordExtension } from '../../../assets/practiceAssets/extensions';

interface ExtensionDisplayProps {
  extension: ChordExtension | null;
  onRegenerateExtension: () => void;
}

const ExtensionDisplay: FC<ExtensionDisplayProps> = ({ 
  extension, 
  onRegenerateExtension 
}) => {
  if (!extension) return null;
  
  return (
    <>
      <div className="rounded-xl border bg-card text-card-foreground shadow border-amber-200 border-amber-800">
        <div className="p-4 bg-amber-50 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-amber-900 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-5 w-5 mr-2 text-amber-600" aria-hidden="true">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                  <path d="M20 3v4"></path>
                  <path d="M22 5h-4"></path>
                  <path d="M4 17v2"></path>
                  <path d="M5 18H3"></path>
                </svg>
                Chord Extensions
              </h3>
              <h4 className="text-lg font-medium text-amber-900 mb-1">
                Try using {extension.name}'s
              </h4>
              <p className="text-amber-800">
                {extension.description}
              </p>
            </div>
            <button 
              onClick={onRegenerateExtension}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-white shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs border-amber-700 hover:bg-amber-100 self-end sm:self-auto cursor-pointer text-amber-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw h-4 w-4 mr-2" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              Regenerate
            </button>
          </div>
        </div>
      </div>
      <br/>
    </>
  );
};

export default ExtensionDisplay;
