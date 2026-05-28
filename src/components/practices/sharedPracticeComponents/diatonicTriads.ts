import { Key } from '../../../assets/practiceAssets/keys';
import { CHROMATIC_NOTES } from './fretboardConstants';

export interface DiatonicTriad {
  root: string;
  name: string;
  notes: [string, string, string];
}

const MAJOR_KEY_TRIAD_QUALITIES = [
  'major',
  'minor',
  'minor',
  'major',
  'major',
  'minor',
  'diminished',
] as const;

const MINOR_KEY_TRIAD_QUALITIES = [
  'minor',
  'diminished',
  'major',
  'minor',
  'minor',
  'major',
  'major',
] as const;

const MAJOR_TRIAD_SEMITONES = [0, 4, 7];
const MINOR_TRIAD_SEMITONES = [0, 3, 7];

const noteAtInterval = (root: string, semitones: number): string => {
  const rootIndex = CHROMATIC_NOTES.indexOf(root as (typeof CHROMATIC_NOTES)[number]);
  if (rootIndex === -1) return root;
  return CHROMATIC_NOTES[(rootIndex + semitones) % 12];
};

/**
 * Diatonic triads matching the key quality (major triads in major keys, minor in minor keys).
 * e.g. G major → G, C, D major triads; A minor → Am, Dm, Em
 */
export const getDiatonicTriadsForKey = (key: Key): DiatonicTriad[] => {
  const pattern =
    key.quality === 'major' ? MAJOR_KEY_TRIAD_QUALITIES : MINOR_KEY_TRIAD_QUALITIES;
  const targetQuality = key.quality === 'major' ? 'major' : 'minor';
  const semitones = key.quality === 'major' ? MAJOR_TRIAD_SEMITONES : MINOR_TRIAD_SEMITONES;

  return key.notes.flatMap((root, degree) => {
    if (pattern[degree] !== targetQuality) return [];

    const triadNotes = semitones.map((interval) =>
      noteAtInterval(root, interval)
    ) as [string, string, string];

    const qualityLabel = key.quality === 'major' ? 'major' : 'minor';

    return [
      {
        root,
        name: `${root} ${qualityLabel}`,
        notes: triadNotes,
      },
    ];
  });
};
