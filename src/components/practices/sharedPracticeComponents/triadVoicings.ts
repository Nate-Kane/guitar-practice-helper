import { TriadStringSetId } from './fretboardConstants';
import {
  TRIAD_SHAPE_OCTAVE,
  TRIAD_SHAPE_TEMPLATES,
  TriadInversion,
  TriadQuality,
  TriadShapeTemplate,
} from './triadShapeTemplates';

export type { TriadInversion };

export interface TriadPosition {
  string: number;
  fret: number;
}

export interface TriadGrouping {
  id: string;
  positions: TriadPosition[];
  inversion: TriadInversion;
}

const positionKey = (string: number, fret: number) => `${string}:${fret}`;

const noteForDegree = (
  triadNotes: [string, string, string],
  degree: TriadInversion
): string => {
  const [root, third, fifth] = triadNotes;
  if (degree === 1) return root;
  if (degree === 3) return third;
  return fifth;
};

const openStringCount = (positions: TriadPosition[]) =>
  positions.filter((p) => p.fret === 0).length;

interface ShapeMatch {
  template: TriadShapeTemplate;
  anchor: number;
  positions: TriadPosition[];
}

const findShapeMatches = (
  template: TriadShapeTemplate,
  triadNotes: [string, string, string],
  strings: number[],
  getNoteAt: (string: number, fret: number) => string | undefined,
  maxFret: number
): ShapeMatch[] => {
  const matches: ShapeMatch[] = [];

  for (let anchor = 0; anchor <= maxFret; anchor++) {
    const positions = strings.map((string, index) => ({
      string,
      fret: anchor + template.fretOffsets[index],
    }));

    if (positions.some((position) => position.fret < 0 || position.fret > maxFret)) {
      continue;
    }

    const notesMatch = template.degrees.every(
      (degree, index) =>
        getNoteAt(positions[index].string, positions[index].fret) ===
        noteForDegree(triadNotes, degree)
    );

    if (!notesMatch) continue;

    matches.push({ template, anchor, positions });
  }

  return matches;
};

/** One placement per shape template in each 12-fret block, preferring fretted voicings */
const selectShapeMatches = (matches: ShapeMatch[]): ShapeMatch[] => {
  const byRegion = new Map<number, ShapeMatch>();

  const sorted = [...matches].sort(
    (a, b) =>
      openStringCount(a.positions) - openStringCount(b.positions) ||
      a.anchor - b.anchor
  );

  for (const match of sorted) {
    const region = Math.floor(match.anchor / TRIAD_SHAPE_OCTAVE);
    if (!byRegion.has(region)) {
      byRegion.set(region, match);
    }
  }

  return [...byRegion.values()].sort((a, b) => a.anchor - b.anchor);
};

/**
 * Place the nine fixed triad shapes (per quality) on the fretboard for a chord.
 * Returns every shape that fits in range — typically three per 12 frets, fewer when
 * an inversion has no playable close voicing (e.g. F major on Low E, A, D).
 */
export const findTriadVoicings = (
  triadNotes: [string, string, string],
  stringSetId: Exclude<TriadStringSetId, 'all'>,
  quality: TriadQuality,
  strings: number[],
  getNoteAt: (string: number, fret: number) => string | undefined,
  maxFret: number
): TriadGrouping[] => {
  if (strings.length !== 3) return [];

  const templates = TRIAD_SHAPE_TEMPLATES[quality][stringSetId];
  const groupings: TriadGrouping[] = [];

  for (const template of templates) {
    const matches = findShapeMatches(
      template,
      triadNotes,
      strings,
      getNoteAt,
      maxFret
    );
    const selected = selectShapeMatches(matches);

    for (const match of selected) {
      const id = match.positions
        .map((p) => positionKey(p.string, p.fret))
        .sort()
        .join('|');

      groupings.push({
        id,
        inversion: template.inversion,
        positions: match.positions,
      });
    }
  }

  return groupings.sort(
    (a, b) =>
      Math.min(...a.positions.map((p) => p.fret)) -
      Math.min(...b.positions.map((p) => p.fret))
  );
};
