import { FC } from 'react';
import { Barre, ChordShape, FINGER_COLORS, Finger } from './chordData';

const FRETS_SHOWN = 4;
const STRING_COUNT = 6;

/** Cream fretboard + branded brown lines */
const BOARD_FILL = '#fdfaf0';
const INK = '#78350f'; // amber-900

interface ChordChartProps {
  chord: ChordShape;
  /** Larger diagram for the enlarge modal */
  size?: 'default' | 'large';
}

const stringX = (stringIndex: number, left: number, stringGap: number) =>
  left + stringIndex * stringGap;

const fretY = (fretIndex: number, top: number, fretGap: number) =>
  top + fretIndex * fretGap;

const ChordChart: FC<ChordChartProps> = ({ chord, size = 'default' }) => {
  const baseFret = chord.baseFret ?? 1;
  const showNut = baseFret === 1;
  const isLarge = size === 'large';

  // SVG layout (viewBox units)
  const width = 120;
  const height = 168;
  const left = 22;
  const right = 98;
  const top = 36;
  const stringGap = (right - left) / (STRING_COUNT - 1);
  const fretGap = 28;
  const boardBottom = top + FRETS_SHOWN * fretGap;
  const markerY = top - 14;
  const dotR = 8.5;

  const noteOnString = (stringIndex: number) =>
    chord.notes.find((note) => note.string === stringIndex);

  const relativeFret = (absoluteFret: number) => absoluteFret - baseFret + 1;

  const barrePath = (barre: Barre) => {
    const rel = relativeFret(barre.fret);
    if (rel < 1 || rel > FRETS_SHOWN) return null;
    const y = top + (rel - 0.5) * fretGap;
    const x1 = stringX(Math.min(barre.fromString, barre.toString), left, stringGap);
    const x2 = stringX(Math.max(barre.fromString, barre.toString), left, stringGap);
    const midY = y - 7;
    return { x1, x2, y, midY, finger: barre.finger };
  };

  const barre = chord.barre ? barrePath(chord.barre) : null;

  // Don't draw individual dots that are covered by the barre finger on barre fret
  // (still draw if different finger on that fret)
  const shouldDrawDot = (stringIndex: number, fret: number, finger?: Finger) => {
    if (!chord.barre || finger !== chord.barre.finger) return true;
    if (fret !== chord.barre.fret) return true;
    const lo = Math.min(chord.barre.fromString, chord.barre.toString);
    const hi = Math.max(chord.barre.fromString, chord.barre.toString);
    // Draw endpoint dots for the barre so numbers still show
    return stringIndex === lo || stringIndex === hi;
  };

  return (
    <div className="flex flex-col items-center">
      <h3
        className={`font-bold text-amber-900 mb-1 tracking-tight ${
          isLarge ? 'text-3xl sm:text-4xl mb-3' : 'text-xl'
        }`}
      >
        {chord.name}
      </h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`w-full h-auto ${isLarge ? 'max-w-[280px] sm:max-w-[320px]' : 'max-w-[140px]'}`}
        role="img"
        aria-label={`${chord.name} chord diagram`}
      >
        {/* Cream board */}
        <rect
          x={left - 1}
          y={top}
          width={right - left + 2}
          height={boardBottom - top}
          fill={BOARD_FILL}
        />

        {/* Frets */}
        {Array.from({ length: FRETS_SHOWN + 1 }).map((_, i) => {
          const y = fretY(i, top, fretGap);
          const isNut = i === 0 && showNut;
          return (
            <line
              key={`fret-${i}`}
              x1={left}
              y1={y}
              x2={right}
              y2={y}
              stroke={INK}
              strokeWidth={isNut ? 5 : 1.4}
              strokeLinecap="square"
            />
          );
        })}

        {/* Base-fret label when diagram doesn't start at the nut */}
        {!showNut && (
          <text
            x={left - 10}
            y={top + fretGap * 0.55}
            textAnchor="middle"
            fill={INK}
            fontSize="9"
            fontWeight="700"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {baseFret}fr
          </text>
        )}

        {/* Strings */}
        {Array.from({ length: STRING_COUNT }).map((_, stringIndex) => {
          const x = stringX(stringIndex, left, stringGap);
          return (
            <line
              key={`string-${stringIndex}`}
              x1={x}
              y1={top}
              x2={x}
              y2={boardBottom}
              stroke={INK}
              strokeWidth={1.2 + (STRING_COUNT - 1 - stringIndex) * 0.15}
            />
          );
        })}

        {/* Open / mute markers */}
        {Array.from({ length: STRING_COUNT }).map((_, stringIndex) => {
          const note = noteOnString(stringIndex);
          const x = stringX(stringIndex, left, stringGap);
          if (!note || note.fret > 0) return null;
          if (note.fret === -1) {
            return (
              <text
                key={`mute-${stringIndex}`}
                x={x}
                y={markerY + 4}
                textAnchor="middle"
                fill={INK}
                fontSize="13"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                ×
              </text>
            );
          }
          return (
            <circle
              key={`open-${stringIndex}`}
              cx={x}
              cy={markerY}
              r={5}
              fill="none"
              stroke={INK}
              strokeWidth="1.6"
            />
          );
        })}

        {/* Barre arc / capsule */}
        {barre && (
          <g>
            <line
              x1={barre.x1}
              y1={barre.y}
              x2={barre.x2}
              y2={barre.y}
              stroke={FINGER_COLORS[barre.finger]}
              strokeWidth={dotR * 2}
              strokeLinecap="round"
              opacity={0.95}
            />
          </g>
        )}

        {/* Finger dots */}
        {chord.notes.map((note) => {
          if (note.fret <= 0 || !note.finger) return null;
          const rel = relativeFret(note.fret);
          if (rel < 1 || rel > FRETS_SHOWN) return null;
          if (!shouldDrawDot(note.string, note.fret, note.finger)) return null;

          const cx = stringX(note.string, left, stringGap);
          const cy = top + (rel - 0.5) * fretGap;
          const color = FINGER_COLORS[note.finger];

          return (
            <g key={`dot-${note.string}-${note.fret}-${note.finger}`}>
              <circle cx={cx} cy={cy} r={dotR} fill={color} />
              <text
                x={cx}
                y={cy + 3.5}
                textAnchor="middle"
                fill="#fffaf0"
                fontSize="11"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {note.finger}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordChart;
