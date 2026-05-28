import { FC } from 'react';
import { Key } from '../../../assets/practiceAssets/keys';
import KeySelector from './KeySelector';

const DEFAULT_HEADING = 'Choose a key to practice';

interface KeyDisplayProps {
  currentKey: Key | null;
  onRegenerateKey: () => void;
  skillLevel: string;
  isKeySelectorOpen: boolean;
  openKeySelector: () => void;
  closeKeySelector: () => void;
  onSelectKey: (key: Key) => void;
  heading?: string;
}

const KeyDisplay: FC<KeyDisplayProps> = ({
  currentKey,
  onRegenerateKey,
  skillLevel,
  isKeySelectorOpen,
  openKeySelector,
  closeKeySelector,
  onSelectKey,
  heading = DEFAULT_HEADING,
}) => {
  if (!currentKey) return null;

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-bold text-amber-900">{heading}</h2>

      <div className="rounded-lg shadow overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-900 p-3 rounded-lg text-stone-50 shrink-0">
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
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-stone-50 mb-1">
                  Key of {currentKey.name} ({currentKey.relativeKey})
                </h3>
                <p className="text-stone-300 text-sm md:text-base">
                  The notes of {currentKey.name} are {currentKey.notes.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[11.5rem] shrink-0">
              <button
                type="button"
                aria-expanded={isKeySelectorOpen}
                onClick={openKeySelector}
                className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors shadow h-9 px-4 py-2 text-stone-50 bg-amber-900 hover:bg-amber-800 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 ml-[-1px] mr-[5px] mr-2 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L7.29289 8.29289C6.90237 8.68342 6.90237 9.31658 7.29289 9.70711C7.68342 10.0976 8.31658 10.0976 8.70711 9.70711L12 6.41421L15.2929 9.70711C15.6834 10.0976 16.3166 10.0976 16.7071 9.70711C17.0976 9.31658 17.0976 8.68342 16.7071 8.29289L12.7071 4.29289ZM7.29289 15.7071L11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071L16.7071 15.7071C17.0976 15.3166 17.0976 14.6834 16.7071 14.2929C16.3166 13.9024 15.6834 13.9024 15.2929 14.2929L12 17.5858L8.70711 14.2929C8.31658 13.9024 7.68342 13.9024 7.29289 14.2929C6.90237 14.6834 6.90237 15.3166 7.29289 15.7071Z"
                    fill="currentColor"
                  />
                </svg>
                Choose the Key
              </button>
              <button
                onClick={onRegenerateKey}
                className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors shadow h-9 px-4 py-2 text-stone-50 bg-amber-900 hover:bg-amber-800 cursor-pointer"
              >
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
                  className="h-4 w-4 mr-2 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Randomize Key
              </button>
            </div>
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
