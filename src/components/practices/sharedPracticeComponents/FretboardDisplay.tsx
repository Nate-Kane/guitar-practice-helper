import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './FretboardDisplay.css';
import {
  Accidental,
  ScaleViewId,
  SCALE_VIEW_OPTIONS,
  spellChromatic,
  spellScale,
} from '../../../assets/practiceAssets/keys';
import { useMapFretboard } from './hooks/useMapFretboard';
import {
  FretboardInstrument,
  GUITAR_INSTRUMENT,
  INTERVAL_MARKER_TEXT,
  MAJOR_SEVENTH_INTERVAL_COLOR,
  MINOR_SEVENTH_INTERVAL_COLOR,
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
  /** Spelled name to print in the marker. Falls back to the canonical note. */
  displayNote?: string;
  /**
   * Optional CAGED (and similar) emphasis:
   * - shape: full opacity + glow (notes in the active form)
   * - context: dimmed (related chord tones outside the form)
   * Omit for default full-opacity markers.
   */
  emphasis?: 'shape' | 'context';
}

/** Anchor — green reads clearly on rosewood */
const ROOT_COLOR = '#2E9B4A';

/** Default open-string marker when no interval/root highlight applies */
const OPEN_STRING_COLOR = '#5a4238';
const OPEN_STRING_BORDER = '#6b4a3a';
const OPEN_STRING_TEXT = '#e8dcc8';

/**
 * One light marker for every pitch. Scale colors stay reserved for
 * "show me the notes of" so the full neck reads as a map, not a scale.
 */
const ALL_NOTES_COLOR = '#f3ead7';

const INTERVAL_BY_SEMITONE: Record<number, { name: string; color: string }> = {
  0: { name: 'Root', color: ROOT_COLOR },
  2: { name: 'Major 2', color: '#FFD24A' },
  3: { name: 'Minor 3', color: '#6B7FD7' },
  4: { name: 'Major 3', color: '#FF9340' },
  5: { name: 'Perfect 4', color: '#6BA89F' },
  7: { name: 'Perfect 5', color: PERFECT_FIFTH_INTERVAL_COLOR },
  8: { name: 'Minor 6', color: '#4DA3E8' },
  9: { name: 'Major 6', color: '#E8A838' },
  10: { name: 'Minor 7', color: MINOR_SEVENTH_INTERVAL_COLOR },
  11: { name: 'Major 7', color: MAJOR_SEVENTH_INTERVAL_COLOR },
};

const choiceButtonClass = (isSelected: boolean) =>
  `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-4 cursor-pointer disabled:cursor-not-allowed ${
    isSelected
      ? 'bg-amber-900 text-stone-50 shadow'
      : 'bg-zinc-800 text-stone-50 border border-amber-800/40 hover:bg-zinc-700'
  }`;

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
  keyQuality?: string; // "major" | "minor" — default scale when scaleView is not controlled
  /** Which scale's notes to light up. Controlled by the key picker. */
  scaleView?: ScaleViewId;
  onScaleViewChange?: (scale: ScaleViewId) => void;
  /** Letter chosen in the key picker, used to spell sharps or flats. */
  rootLetter?: string;
  accidental?: Accidental;
  /** Ignore the key and print every note name. */
  showAllNotes?: boolean;
  maxFret?: number;
  showIntervalSelector?: boolean; // Control whether to show interval selector
  /** Skip root / interval highlights (e.g. string notes or triad tools) */
  disableKeyHighlights?: boolean;
  /**
   * Show the open-string letter at the nut on every string.
   * A highlighted note on that same fret still wins, so a selected string can
   * show its colored open note while the other strings keep their names.
   */
  showOpenStringLabels?: boolean;
  /** Tuning, string count, and inlay dots. Defaults to standard guitar. */
  instrument?: FretboardInstrument;
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
  scaleView,
  onScaleViewChange,
  rootLetter,
  accidental = 'natural',
  showAllNotes = false,
  maxFret = 12,
  showIntervalSelector = false,
  disableKeyHighlights = false,
  showOpenStringLabels = true,
  instrument = GUITAR_INSTRUMENT,
  mutedFretLabels = false,
  fretLabelTextColor,
  sectionHeading,
  staticIntervalLegend,
  triadGroupings,
}) => {
  const openStringNotes = instrument.strings.map((string) => string.openNote);
  const { getNoteAt } = useMapFretboard(maxFret, openStringNotes);
  const fretboardRef = useRef<HTMLDivElement>(null);
  const hazeFilterId = useId().replace(/:/g, '');
  const [groupingShapes, setGroupingShapes] = useState<TriadGroupingShape[]>([]);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const [hiddenSemitones, setHiddenSemitones] = useState<number[]>([]);
  const [internalScale, setInternalScale] = useState<ScaleViewId>(
    keyQuality === 'minor' ? 'minor' : 'major'
  );
  const activeScale = scaleView ?? internalScale;

  useEffect(() => {
    if (scaleView) return;
    setInternalScale(keyQuality === 'minor' ? 'minor' : 'major');
  }, [keyQuality, scaleView]);

  const scaleNotes = useMemo(() => {
    if (showAllNotes || !highlightedNote || !rootLetter) return [];
    return spellScale(rootLetter, accidental, activeScale);
  }, [showAllNotes, highlightedNote, rootLetter, accidental, activeScale]);

  const selectScale = (next: ScaleViewId) => {
    if (showAllNotes) return;
    onScaleViewChange?.(next);
    if (!scaleView) setInternalScale(next);
  };

  const toggleSemitone = (semitones: number) => {
    setHiddenSemitones((current) =>
      current.includes(semitones)
        ? current.filter((value) => value !== semitones)
        : [...current, semitones]
    );
  };

  useLayoutEffect(() => {
    const board = fretboardRef.current;
    if (!board || !triadGroupings?.length || showAllNotes) {
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
  }, [triadGroupings, maxFret, showAllNotes]);
  
  const getNoteAtPosition = (stringIndex: number, fret: number): string => {
    return getNoteAt(stringIndex, fret)?.note || '';
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
    if (!noteAtPosition) return null;

    if (showAllNotes) {
      return {
        note: noteAtPosition,
        color: ALL_NOTES_COLOR,
        displayNote: spellChromatic(noteAtPosition, accidental === 'flat'),
      };
    }

    for (const noteInfo of highlightedNotes) {
      if (matchesPositionHighlight(noteInfo, stringIndex, fret, noteAtPosition)) {
        return noteInfo;
      }
    }

    if (disableKeyHighlights) return null;

    const scaleNote = scaleNotes.find((note) => note.canonical === noteAtPosition);
    if (!scaleNote || hiddenSemitones.includes(scaleNote.semitones)) return null;

    const interval = INTERVAL_BY_SEMITONE[scaleNote.semitones];
    return {
      note: noteAtPosition,
      color: interval?.color ?? ROOT_COLOR,
      label: interval?.name,
      displayNote: scaleNote.spelled,
    };
  };
  
  const hasFretMarker = (stringIndex: number, fret: number): boolean => {
    if (stringIndex !== instrument.inlayStringIndex) return false;

    return (
      instrument.singleDotFrets.includes(fret) || instrument.doubleDotFrets.includes(fret)
    );
  };

  const isDoubleDotMarker = (fret: number): boolean => {
    return instrument.doubleDotFrets.includes(fret);
  };

  const getStringNameDisplay = (index: number) => {
    return instrument.strings[index]?.label ?? '';
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

  const fretboard = (
    <div
        className={`fretboard-container${mutedFretLabels ? ' fretboard-container--muted-labels' : ''}`}
        style={
          fretLabelTextColor
            ? ({ '--fret-label-text-color': fretLabelTextColor } as React.CSSProperties)
            : undefined
        }
      >
        {staticIntervalLegend && staticIntervalLegend.length > 0 && !showAllNotes && (
          <div className="interval-legend" aria-label="Triad intervals">
            {staticIntervalLegend.map((item) =>
              renderStaticLegendItem(item.name, item.color, item.name)
            )}
          </div>
        )}
        {showIntervalSelector && !staticIntervalLegend && (
          <div className="mb-4 space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-900">Show me the notes of</h3>
              <div
                className={`flex flex-wrap gap-2 ${showAllNotes ? 'opacity-40' : ''}`}
                role="radiogroup"
                aria-label="Show me the notes of"
              >
                {SCALE_VIEW_OPTIONS.map((option) => {
                  const isSelected = !showAllNotes && activeScale === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={showAllNotes}
                      onClick={() => selectScale(option.id)}
                      className={choiceButtonClass(isSelected)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {!showAllNotes && (
              <div className="interval-legend" aria-label="Scale degrees">
                {scaleNotes.map((note) => {
                  const interval = INTERVAL_BY_SEMITONE[note.semitones];
                  if (!interval) return null;
                  const isShown = !hiddenSemitones.includes(note.semitones);
                  return (
                    <button
                      key={note.semitones}
                      type="button"
                      className="interval-item"
                      aria-pressed={isShown}
                      aria-label={`${isShown ? 'Hide' : 'Show'} ${interval.name}`}
                      onClick={() => toggleSemitone(note.semitones)}
                    >
                      <span
                        className="interval-color"
                        style={{
                          backgroundColor: isShown ? interval.color : 'transparent',
                          border: `2px solid ${interval.color}`,
                        }}
                      />
                      <span>{interval.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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
            {[...Array(instrument.strings.length)].map((_, i) => {
              // High string on top, low string on the bottom
              const stringIndex = instrument.strings.length - 1 - i;
              return (
                <div key={`string-${stringIndex}`} className="string">
                  {Array.from({ length: maxFret + 1 }).map((_, fretIndex) => {
                    const highlightInfo = getHighlightInfo(stringIndex, fretIndex);
                    const isOpenString = fretIndex === 0;
                    const showMarker =
                      highlightInfo || (showOpenStringLabels && isOpenString);

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
                        ? highlightInfo.displayNote ?? getNoteAtPosition(stringIndex, fretIndex)
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