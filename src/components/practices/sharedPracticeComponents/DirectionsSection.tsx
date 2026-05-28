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
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <path d="M12 17h.01"></path>
      </svg>
      Directions
    </h3>
    <p className="text-stone-50 leading-relaxed">{directions}</p>
  </div>
);

export default DirectionsSection;
