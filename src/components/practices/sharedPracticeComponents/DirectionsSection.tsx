import { FC } from 'react';

interface DirectionsSectionProps {
  directions: string;
}

const DirectionsSection: FC<DirectionsSectionProps> = ({ directions }) => (
  <div className="rounded-lg bg-amber-900 text-stone-50 p-8 space-y-4">
    <h3 className="text-xl font-bold flex items-center">
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
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
      Directions
    </h3>
    <p className="text-stone-50 leading-relaxed">{directions}</p>
  </div>
);

export default DirectionsSection;
