import { FC, ReactNode } from 'react';

const REGENERATE_BUTTON_CLASS =
  'inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors shadow h-9 px-4 py-2 text-stone-50 bg-amber-900 hover:bg-amber-800 cursor-pointer';

const RegenerateIcon = () => (
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
    className="h-5 w-5 mr-2 shrink-0"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

interface PracticeLimitCardProps {
  title: string;
  icon: ReactNode;
  onRegenerate: () => void;
  /** Simple single-line body (fret/string limits) */
  description?: ReactNode;
  /** Richer body (chord progression, etc.) */
  children?: ReactNode;
}

const PracticeLimitCard: FC<PracticeLimitCardProps> = ({
  title,
  description,
  children,
  icon,
  onRegenerate,
}) => (
  <div className="w-full rounded-lg shadow overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="bg-amber-900 p-3 rounded-lg text-stone-50 shrink-0">{icon}</div>
          <div className="min-w-0 space-y-1">
            <h3 className="text-lg md:text-xl font-bold text-stone-50">{title}</h3>
            {description && (
              <p className="text-stone-300 text-sm md:text-base">{description}</p>
            )}
            {children}
          </div>
        </div>
        <div className="w-full shrink-0 sm:w-auto sm:min-w-[11rem]">
          <button type="button" onClick={onRegenerate} className={REGENERATE_BUTTON_CLASS}>
            <RegenerateIcon />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default PracticeLimitCard;
