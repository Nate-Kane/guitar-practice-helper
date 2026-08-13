import { FC } from 'react';

interface PracticeTipsSectionProps {
  tips: string[];
}

const PracticeTipsSection: FC<PracticeTipsSectionProps> = ({ tips }) => (
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
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
      </svg>
      Practice Tips
    </h3>
    <ul className="list-disc list-inside space-y-2 text-stone-50 leading-relaxed marker:text-stone-50">
      {tips.map((tip, index) => (
        <li key={index}>{tip}</li>
      ))}
    </ul>
  </div>
);

export default PracticeTipsSection;
