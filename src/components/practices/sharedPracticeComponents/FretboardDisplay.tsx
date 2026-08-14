import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import './FretboardDisplay.css';
import { useMapFretboard } from './hooks/useMapFretboard';
import {
  INTERVAL_MARKER_TEXT,
  NEUTRAL_MARKER_BORDER,
  NEUTRAL_MARKER_TEXT,
  PERFECT_FIFTH_INTERVAL_COLOR,
} from './fretboardConstants';
import { measureTriadGroupingShapes, TriadGroupingShape } from './triadGroupingShape';
import { TriadGrouping } from './triadVoicings';
export interface HighlightedNoteInfo {
  note: string;
  color: string;
  label?: string;
  /** When set, highlight only applies at this string (0 = low E, 5 = high e) */
  string?: number;
  /** When set, highlight only applies at this fret */
  fret?: number;
  /** Rosewood-style markers (string / triad tools) vs interval colors */
  variant?: 'neutral' | 'interval';
  /**
   * Optional CAGED (and similar) emphasis:
   * - shape: full opacity + glow (notes in the active form)
   * - context: dimmed (related chord tones outside the form)
   * Omit for default full-opacity markers.
   */
  emphasis?: 'shape' | 'context';
}

// Define intervals and their colors
interface IntervalInfo {
  name: string;
  semitones: number;
  color: string;
  selected?: boolean;
}

/** Anchor — green reads clearly on rosewood */
const ROOT_COLOR = '#2E9B4A';

/** Default open-string marker when no interval/root highlight applies */
const OPEN_STRING_COLOR = '#5a4238';
const OPEN_STRING_BORDER = '#6b4a3a';
const OPEN_STRING_TEXT = '#e8dcc8';

/**
 * Interval colors (rosewood fretboard):
 * - Major: warm / bright (happy)
 * - Minor: cool blues & violets (sad)
 * - Perfect: muted teal & silver (neutral)
 */
const intervalOptions: IntervalInfo[] = [
  { name: 'Major 2', semitones: 2, color: '#FFD24A', selected: false },
  { name: 'Minor 3', semitones: 3, color: '#6B7FD7', selected: false },
  { name: 'Major 3', semitones: 4, color: '#FF9340', selected: false },
  { name: 'Perfect 4', semitones: 5, color: '#6BA89F', selected: false },
  { name: 'Perfect 5', semitones: 7, color: PERFECT_FIFTH_INTERVAL_COLOR, selected: false },
  { name: 'Minor 6', semitones: 8, color: '#4DA3E8', selected: false },
  { name: 'Major 6', semitones: 9, color: '#E8A838', selected: false },
  { name: 'Minor 7', semitones: 10, color: '#9B7ED9', selected: false },
  { name: 'Major 7', semitones: 11, color: '#E454A0', selected: false },
];

type ScaleMode = 'major' | 'minor' | 'chromatic';

const MAJOR_SCALE_SEMITONES = new Set([2, 4, 5, 7, 9, 11]);
const MINOR_SCALE_SEMITONES = new Set([2, 3, 5, 7, 8, 10]);

const getDefaultScaleMode = (quality?: string): ScaleMode => {
  if (quality === 'minor') return 'minor';
  if (quality === 'major') return 'major';
  return 'chromatic';
};

const isIntervalInScale = (semitones: number, mode: ScaleMode): boolean => {
  if (mode === 'chromatic') return true;
  if (mode === 'major') return MAJOR_SCALE_SEMITONES.has(semitones);
  return MINOR_SCALE_SEMITONES.has(semitones);
};

const createResetIntervals = (): IntervalInfo[] =>
  intervalOptions.map((interval) => ({
    ...interval,
    selected: false,
  }));

const shapeSignature = (shape: TriadGroupingShape) =>
  shape.kind === 'circle'
    ? `c:${shape.key}:${shape.cx}:${shape.cy}:${shape.r}`
    : `e:${shape.key}:${shape.cx}:${shape.cy}:${shape.rx}:${shape.ry}:${shape.rotation}`;

const shapesEqual = (a: TriadGroupingShape[], b: TriadGroupingShape[]) =>
  a.length === b.length &&
  a.every((shape, index) => shapeSignature(shape) === shapeSignature(b[index]));

interface FretboardDisplayProps {
  highlightedNote?: string; // Kept for backward compatibility
  highlightedNotes?: HighlightedNoteInfo[]; // For manually specifying highlighted notes
  keyQuality?: string; // "major" | "minor" — sets default scale filter
  maxFret?: number;
  showIntervalSelector?: boolean; // Control whether to show interval selector
  /** Skip root / interval highlights (e.g. string notes or triad tools) */
  disableKeyHighlights?: boolean;
  /** Show open-string labels on every string (off when using custom highlights only) */
  showOpenStringLabels?: boolean;
  /** Grey nut + grey text (string explorer on zinc card only) */
  mutedFretLabels?: boolean;
  /** Fret number + open-string letter color only — does not change the nut */
  fretLabelTextColor?: string;
  /** Amber h2 above the fretboard (KeyDisplay-style section label) */
  sectionHeading?: string;
  /** Filled, non-interactive legend only (no scale-mode radios or toggles) */
  staticIntervalLegend?: { name: string; color: string }[];
  /** Oval outlines connecting root, 3rd, and 5th on a string set */
  triadGroupings?: TriadGrouping[];
}

const FretboardDisplay: React.FC<FretboardDisplayProps> = ({
  highlightedNote,
  highlightedNotes = [],
  keyQuality,
  maxFret = 12,
  showIntervalSelector = false,
  disableKeyHighlights = false,
  showOpenStringLabels = true,
  mutedFretLabels = false,
  fretLabelTextColor,
  sectionHeading,
  staticIntervalLegend,
  triadGroupings,
}) => {
  const { getNoteAt } = useMapFretboard(maxFret);
  const fretboardRef = useRef<HTMLDivElement>(null);
  const hazeFilterId = useId().replace(/:/g, '');
  const [groupingShapes, setGroupingShapes] = useState<TriadGroupingShape[]>([]);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const [intervals, setIntervals] = useState<IntervalInfo[]>(intervalOptions);
  const [rootSelected, setRootSelected] = useState(true);
  const [scaleMode, setScaleMode] = useState<ScaleMode>(() => getDefaultScaleMode(keyQuality));

  useEffect(() => {
    if (disableKeyHighlights) return;
    const mode = getDefaultScaleMode(keyQuality);
    setScaleMode(mode);
    setIntervals(createResetIntervals());
    setRootSelected(true);
  }, [highlightedNote, keyQuality, disableKeyHighlights]);

  useLayoutEffect(() => {
    const board = fretboardRef.current;
    if (!board || !triadGroupings?.length) {
      setGroupingShapes((prev) => (prev.length === 0 ? prev : []));
      setOverlaySize((prev) =>
        prev.width === 0 && prev.height === 0 ? prev : { width: 0, height: 0 }
      );
      return;
    }

    const measureGroupings = () => {
      const boardRect = board.getBoundingClientRect();
      if (boardRect.width === 0 || boardRect.height === 0) return;

      const nextSize = { width: boardRect.width, height: boardRect.height };
      setOverlaySize((prev) =>
        prev.width === nextSize.width && prev.height === nextSize.height ? prev : nextSize
      );

      const nextShapes = measureTriadGroupingShapes(board, triadGroupings);
      setGroupingShapes((prev) =>
        shapesEqual(prev, nextShapes) ? prev : nextShapes
      );
    };

    measureGroupings();
    const rafId = requestAnimationFrame(measureGroupings);

    const resizeObserver = new ResizeObserver(measureGroupings);
    resizeObserver.observe(board);
    window.addEventListener('resize', measureGroupings);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureGroupings);
    };
  }, [triadGroupings, maxFret]);
  
  const stringNames = ['E', 'A', 'D', 'G', 'B', 'E']; // standard tuning!
  
  const getNoteAtPosition = (stringIndex: number, fret: number): string => {
    return getNoteAt(stringIndex, fret)?.note || '';
  };

  // Calculate interval notes based on root note
  const getIntervalNotes = (): HighlightedNoteInfo[] => {
    if (!highlightedNote) return [];

    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = allNotes.indexOf(highlightedNote);
    if (rootIndex === -1) return [];
    
    return intervals
      .filter(
        (interval) =>
          interval.selected && isIntervalInScale(interval.semitones, scaleMode)
      )
      .map(interval => {
        const noteIndex = (rootIndex + interval.semitones) % 12;
        return {
          note: allNotes[noteIndex],
          color: interval.color,
          label: interval.name
        };
      });
  };

  // Toggle interval selection
  const toggleInterval = (index: number) => {
    const newIntervals = [...intervals];
    newIntervals[index].selected = !newIntervals[index].selected;
    setIntervals(newIntervals);
  };
  
  const matchesPositionHighlight = (
    noteInfo: HighlightedNoteInfo,
    stringIndex: number,
    fret: number,
    noteAtPosition: string
  ) => {
    if (noteAtPosition !== noteInfo.note) return false;
    if (noteInfo.string !== undefined && noteInfo.string !== stringIndex) return false;
    if (noteInfo.fret !== undefined && noteInfo.fret !== fret) return false;
    return true;
  };

  // Find if a position should be highlighted and with what info
  const getHighlightInfo = (stringIndex: number, fret: number): HighlightedNoteInfo | null => {
    const noteAtPosition = getNoteAtPosition(stringIndex, fret);

    for (const noteInfo of highlightedNotes) {
      if (matchesPositionHighlight(noteInfo, stringIndex, fret, noteAtPosition)) {
        return noteInfo;
      }
    }

    if (disableKeyHighlights) return null;

    if (highlightedNote && rootSelected && noteAtPosition === highlightedNote) {
      return { note: noteAtPosition, color: ROOT_COLOR, label: 'Root' };
    }

    const intervalBasedNotes = getIntervalNotes();
    for (const noteInfo of intervalBasedNotes) {
      if (noteAtPosition === noteInfo.note) {
        return noteInfo;
      }
    }

    return null;
  };
  
  const hasFretMarker = (stringIndex: number, fret: number): boolean => {
    // Only place markers between D and G strings (index 2 and 3)
    if (stringIndex !== 2) return false;
    
    const singleDotFrets = [3, 5, 7, 9];
    const doubleDotFrets = [12];
    
    return singleDotFrets.includes(fret) || doubleDotFrets.includes(fret);
  };
  
  const isDoubleDotMarker = (fret: number): boolean => {
    return fret === 12;
  };
  
  const getStringNameDisplay = (index: number) => {
    if (index === 5) return 'e';
    return stringNames[index];
  };

  const renderStaticLegendItem = (name: string, color: string, key: string) => (
    <div key={key} className="interval-item interval-item--static">
      <span
        className="interval-color"
        style={{
          backgroundColor: color,
          border: `2px solid ${color}`,
        }}
      />
      <span>{name}</span>
    </div>
  );

  const renderIntervalToggle = (
    name: string,
    color: string,
    isSelected: boolean,
    onToggle: () => void,
    key: string
  ) => (
    <button
      type="button"
      key={key}
      className="interval-item"
      onClick={onToggle}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Hide' : 'Show'} ${name}`}
    >
      <span
        className="interval-color"
        style={{
          backgroundColor: isSelected ? color : 'transparent',
          border: `2px solid ${color}`,
        }}
      />
      <span>{name}</span>
    </button>
  );
  
  const fretboard = (
    <div
        className={`fretboard-container${mutedFretLabels ? ' fretboard-container--muted-labels' : ''}`}
        style={
          fretLabelTextColor
            ? ({ '--fret-label-text-color': fretLabelTextColor } as React.CSSProperties)
            : undefined
        }
      >
        {staticIntervalLegend && staticIntervalLegend.length > 0 && (
          <div className="interval-legend" aria-label="Triad intervals">
            {staticIntervalLegend.map((item) =>
              renderStaticLegendItem(item.name, item.color, item.name)
            )}
          </div>
        )}
        {showIntervalSelector && !staticIntervalLegend && (
          <>
            <div
              className="scale-mode-selector"
              role="radiogroup"
              aria-label="Interval scale filter"
            >
              {(
                [
                  { value: 'major' as const, label: 'Major Scale Intervals' },
                  { value: 'minor' as const, label: 'Minor Scale Intervals' },
                  { value: 'chromatic' as const, label: 'Chromatic Intervals' },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={scaleMode === value}
                  className={`scale-mode-option${scaleMode === value ? ' scale-mode-option--active' : ''}`}
                  onClick={() => setScaleMode(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="interval-legend">
              {renderIntervalToggle('Root', ROOT_COLOR, rootSelected, () => setRootSelected((v) => !v), 'root')}
              {intervals.map((interval, index) => {
                if (!isIntervalInScale(interval.semitones, scaleMode)) return null;
                return renderIntervalToggle(
                  interval.name,
                  interval.color,
                  !!interval.selected,
                  () => toggleInterval(index),
                  interval.name
                );
              })}
            </div>
          </>
        )}
        
        <div className="fretboard-with-names">
          <div className="fretboard" ref={fretboardRef}>
            {groupingShapes.length > 0 && overlaySize.width > 0 && (
              <svg
                className="triad-grouping-overlay"
                width={overlaySize.width}
                height={overlaySize.height}
                viewBox={`0 0 ${overlaySize.width} ${overlaySize.height}`}
                aria-hidden="true"
              >
                <defs>
                  <filter
                    id={hazeFilterId}
                    x="-60%"
                    y="-60%"
                    width="220%"
                    height="220%"
                    colorInterpolationFilters="sRGB"
                  >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {groupingShapes.map((shape) =>
                  shape.kind === 'ellipse' ? (
                    <ellipse
                      key={shape.key}
                      cx={shape.cx}
                      cy={shape.cy}
                      rx={shape.rx}
                      ry={shape.ry}
                      transform={`rotate(${shape.rotation} ${shape.cx} ${shape.cy})`}
                      className="triad-grouping-haze"
                      filter={`url(#${hazeFilterId})`}
                    />
                  ) : (
                    <circle
                      key={shape.key}
                      cx={shape.cx}
                      cy={shape.cy}
                      r={shape.r}
                      className="triad-grouping-haze"
                      filter={`url(#${hazeFilterId})`}
                    />
                  )
                )}
              </svg>
            )}
            {/* Render strings from high to low (reverse the order) */}
            {[...Array(6)].map((_, i) => {
              // Map from high E (index 5) down to low E (index 0)
              const stringIndex = 5 - i;
              return (
                <div key={`string-${stringIndex}`} className="string">
                  {Array.from({ length: maxFret + 1 }).map((_, fretIndex) => {
                    const highlightInfo = getHighlightInfo(stringIndex, fretIndex);
                    const isOpenString = fretIndex === 0;
                    const showMarker =
                      highlightInfo || (showOpenStringLabels && isOpenString && !disableKeyHighlights);

                    const isNeutral = highlightInfo?.variant === 'neutral';
                    const emphasis = highlightInfo?.emphasis;
                    const markerStyle = highlightInfo
                      ? {
                          backgroundColor: highlightInfo.color,
                          color: isNeutral ? NEUTRAL_MARKER_TEXT : INTERVAL_MARKER_TEXT,
                          border: isNeutral ? `2px solid ${NEUTRAL_MARKER_BORDER}` : 'none',
                          boxShadow:
                            emphasis === 'shape'
                              ? '0 0 10px 4px rgba(255, 245, 220, 0.8), 0 0 22px 8px rgba(255, 235, 200, 0.55), 0 0 36px 12px rgba(255, 250, 235, 0.4)'
                              : isNeutral
                                ? 'none'
                                : '0 0 4px rgba(0, 0, 0, 0.3)',
                          opacity: emphasis === 'context' ? 0.32 : 1,
                        }
                      : isOpenString
                        ? {
                            backgroundColor: OPEN_STRING_COLOR,
                            color: fretLabelTextColor ?? OPEN_STRING_TEXT,
                            border: `2px solid ${OPEN_STRING_BORDER}`,
                            boxShadow: 'none',
                          }
                        : {
                            backgroundColor: 'transparent',
                            color: 'inherit',
                            border: 'none',
                            boxShadow: 'none',
                          };

                    const markerLabel = showMarker
                      ? highlightInfo
                        ? getNoteAtPosition(stringIndex, fretIndex)
                        : getStringNameDisplay(stringIndex)
                      : null;

                    const markerClassName = [
                      'note-marker',
                      isOpenString && !highlightInfo ? 'note-marker--open-string' : '',
                      emphasis === 'shape' ? 'note-marker--shape' : '',
                      emphasis === 'context' ? 'note-marker--context' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <div 
                        key={`fret-${fretIndex}`} 
                        className={`fret ${showMarker ? 'highlighted' : ''}`}
                        data-string={stringIndex}
                        data-fret={fretIndex}
                      >
                        <div 
                          className={markerClassName}
                          style={{
                            ...markerStyle,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {markerLabel && (
                            <div className="note-name">{markerLabel}</div>
                          )}
                        </div>
                        
                        {/* Add fret markers directly on the fretboard */}
                        {hasFretMarker(stringIndex, fretIndex) && (
                          <div className="inlay-marker">
                            {isDoubleDotMarker(fretIndex) ? (
                              <>
                                <div className="inlay-dot"></div>
                                <div className="inlay-dot"></div>
                              </>
                            ) : (
                              <div className="inlay-dot"></div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="fret-numbers">
          {Array.from({ length: maxFret + 1 }).map((_, fretIndex) => (
            <div key={`fret-num-${fretIndex}`} className="fret-number">
              {fretIndex === 0 ? 'Nut' : fretIndex}
            </div>
          ))}
        </div>
      </div>
  );

  if (!sectionHeading) {
    return fretboard;
  }

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-bold text-amber-900">{sectionHeading}</h2>
      {fretboard}
    </div>
  );
};

export default FretboardDisplay; 