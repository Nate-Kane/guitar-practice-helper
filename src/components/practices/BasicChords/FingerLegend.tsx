import { FC } from 'react';
import { FINGER_COLORS, FINGER_LABELS, Finger } from './chordData';

const FINGERS: Finger[] = [1, 2, 3, 4];

const FingerLegend: FC = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-amber-900/15 bg-[#fdfaf0] px-4 py-5 h-full min-h-[180px]">
    <p className="text-sm font-semibold text-amber-900 mb-4">Finger guide</p>
    <div className="flex flex-col gap-3 w-full max-w-[160px]">
      {FINGERS.map((finger) => (
        <div key={finger} className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#fffaf0] shadow-sm"
            style={{ backgroundColor: FINGER_COLORS[finger] }}
          >
            {finger}
          </span>
          <span className="text-sm font-medium text-amber-900">{FINGER_LABELS[finger]}</span>
        </div>
      ))}
    </div>
  </div>
);

export default FingerLegend;
