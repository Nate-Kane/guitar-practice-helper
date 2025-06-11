import { FC } from "react";

interface StringLimit {
    currentStringLimit: string;
    onRegenerateStringLimit: () => void;
}

export const StringLimitDisplay: FC<StringLimit> = ({ currentStringLimit, onRegenerateStringLimit}) => {
    return (
        <>
            <div className="rounded-xl border bg-card text-card-foreground shadow border-amber-200 border-amber-800">
                <div className="p-4 bg-amber-50 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-amber-900 flex items-center mb-1">
                                String Limit
                            </h3>
                            <p className="text-amber-800">
                                Only use strings <span className="font-bold text-amber-700">{currentStringLimit}</span>
                            </p>
                        </div>
                        <button 
                            onClick={onRegenerateStringLimit}
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
    )
}