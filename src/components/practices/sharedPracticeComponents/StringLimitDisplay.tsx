import { FC } from "react";

interface StringLimit {
    currentStringLimit: string;
    onRegenerateStringLimit: () => void;
}

export const StringLimitDisplay: FC<StringLimit> = ({ currentStringLimit, onRegenerateStringLimit}) => {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow border-amber-200 dark:border-amber-800">
            <div className="flex flex-col space-y-1.5 p-6 bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 pb-3">
                <h3 className="tracking-tight text-lg font-bold flex items-center text-amber-900 dark:text-amber-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-guitar h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" aria-hidden="true">
                        <path d="M3 12h3"></path>
                        <path d="M3 6h3"></path>
                        <path d="M3 18h3"></path>
                        <path d="M12 12h3"></path>
                        <path d="M12 6h3"></path>
                        <path d="M12 18h3"></path>
                        <path d="M21 12h-3"></path>
                        <path d="M21 6h-3"></path>
                        <path d="M21 18h-3"></path>
                    </svg>
                    String Limit
                </h3>
            </div>
            <div className="p-6 pt-4 bg-amber-50 dark:bg-amber-950/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-amber-900 dark:text-amber-200">
                        Only use strings <span className="font-bold text-amber-700 dark:text-amber-300">{currentStringLimit}</span>
                    </p>
                    <button 
                        onClick={onRegenerateStringLimit}
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