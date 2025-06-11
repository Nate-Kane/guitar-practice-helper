import { FC } from "react";

interface FretLimit {
    currentFretLimit: string;
    onRegenerateFretLimit: () => void;
}

const FretLimitDisplay: FC<FretLimit> = ({ currentFretLimit, onRegenerateFretLimit }) => {

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow border-amber-200 dark:border-amber-800">
            <div className="flex flex-col space-y-1.5 p-6 bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 pb-3">
                <h3 className="tracking-tight text-lg font-bold flex items-center text-amber-900 dark:text-amber-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" aria-hidden="true">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Fret Limit
                </h3>
            </div>
            <div className="p-6 pt-4 bg-amber-50 dark:bg-amber-950/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-amber-900 dark:text-amber-200">
                        Only use frets <span className="font-bold text-amber-700 dark:text-amber-300">{currentFretLimit}</span>
                    </p>
                    <button 
                        onClick={onRegenerateFretLimit}
                        className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 self-end sm:self-auto cursor-pointer"
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
    )
}

export default FretLimitDisplay;