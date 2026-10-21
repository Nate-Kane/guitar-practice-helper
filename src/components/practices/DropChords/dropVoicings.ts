/**
 * Drop-2 grips as chord-tone stacks, then placed on the tuning.
 *
 * A close 7th chord, low to high, is root, 3rd, 5th, 7th.
 * Drop 2 takes the second note from the top (the 5th) down an octave.
 * Doing that to each close inversion gives four stacks:
 *
 *   root in the bass:    root, 5th, 7th, 3rd
 *   3rd in the bass:     3rd, 7th, root, 5th
 *   5th in the bass:     5th, root, 3rd, 7th
 *   7th in the bass:     7th, 3rd, 5th, root
 *
 * The stacks are intervals above the root, not a diagram per key.
 * Changing the root transposes them. Major 7, minor 7, and dominant 7
 * only change the 3rd and the 7th.
 *
 * Drop 3 drops the third note from the top (the 3rd) an octave:
 *
 *   root in the bass:    root, 7th, 3rd, 5th
 *   3rd in the bass:     3rd, root, 5th, 7th
 *   5th in the bass:     5th, 3rd, 7th, root
 *   7th in the bass:     7th, 5th, root, 3rd
 *
 * String index matches the rest of the app: 0 = low E … 5 = high E.
 * Drop 2 uses four neighboring strings. Drop 3 skips one string in the
 * middle, because that octave gap does not fit on four neighbors.
 */

import { CHROMATIC_NOTES, GUITAR_STRINGS } from '../sharedPracticeComponents/fretboardConstants';

/** Standard tuning MIDI. Pitch class must stay locked to GUITAR_STRINGS. */
const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64] as const;

OPEN_STRING_MIDI.forEach((midi, index) => {
  const pitchClass = CHROMATIC_NOTES[midi % 12];
  if (pitchClass !== GUITAR_STRINGS[index].openNote) {
    throw new Error(`Drop chord tuning does not match string ${index}`);
  }
});

/** Both families stay inside a 5-fret reach once the drop 3 skip is in the right place. */
const DROP2_MAX_GRIP_SPAN = 5;
const DROP3_MAX_GRIP_SPAN = 5;

export const NATURAL_ROOTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export type NaturalRoot = (typeof NATURAL_ROOTS)[number];

export const DROP2_STRING_SETS = [
  {
    id: 'high',
    label: 'D G B E',
    fretLabel: 'D, G, B, and high E',
    skipLabel: null,
    strings: [2, 3, 4, 5],
  },
  {
    id: 'middle',
    label: 'A D G B',
    fretLabel: 'A, D, G, and B',
    skipLabel: null,
    strings: [1, 2, 3, 4],
  },
] as const;

/**
 * The muted string sits between the bass note and the upper three.
 * High: bass on A, mute D, then G B high E.
 * Low: bass on low E, mute A, then D G B.
 */
export const DROP3_STRING_SETS = [
  {
    id: 'high',
    label: 'A G B E',
    fretLabel: 'A, G, B, and high E',
    skipLabel: 'D',
    strings: [1, 3, 4, 5],
  },
  {
    id: 'low',
    label: 'E D G B',
    fretLabel: 'low E, D, G, and B',
    skipLabel: 'A',
    strings: [0, 2, 3, 4],
  },
] as const;

export type DropFamilyId = 'drop2' | 'drop3';

export const DROP_FAMILIES: { id: DropFamilyId; label: string }[] = [
  { id: 'drop2', label: 'Drop 2' },
  { id: 'drop3', label: 'Drop 3' },
];

export type ChordDegree = 'root' | 'third' | 'fifth' | 'seventh';
export type InversionId = 'root' | 'third' | 'fifth' | 'seventh';
export type ChordQualityId = 'maj7' | 'min7' | 'dom7';

export const CHORD_QUALITIES: {
  id: ChordQualityId;
  label: string;
  sentenceLabel: string;
}[] = [
  { id: 'maj7', label: 'Major 7', sentenceLabel: 'major 7' },
  { id: 'min7', label: 'Minor 7', sentenceLabel: 'minor 7' },
  { id: 'dom7', label: 'Dominant 7', sentenceLabel: 'dominant 7' },
];

type QualityIntervals = { third: number; fifth: number; seventh: number };

/** Semitones above the root. The 5th stays perfect for these three qualities. */
const QUALITY_INTERVALS: Record<ChordQualityId, QualityIntervals> = {
  maj7: { third: 4, fifth: 7, seventh: 11 },
  min7: { third: 3, fifth: 7, seventh: 10 },
  dom7: { third: 4, fifth: 7, seventh: 10 },
};

export const DROP2_INVERSIONS: {
  id: InversionId;
  label: string;
  bassLabel: string;
  /** Chord tones, lowest string to highest. */
  degrees: readonly ChordDegree[];
}[] = [
  {
    id: 'root',
    label: 'Root position',
    bassLabel: 'Root in the bass',
    degrees: ['root', 'fifth', 'seventh', 'third'],
  },
  {
    id: 'third',
    label: '1st inversion',
    bassLabel: '3rd in the bass',
    degrees: ['third', 'seventh', 'root', 'fifth'],
  },
  {
    id: 'fifth',
    label: '2nd inversion',
    bassLabel: '5th in the bass',
    degrees: ['fifth', 'root', 'third', 'seventh'],
  },
  {
    id: 'seventh',
    label: '3rd inversion',
    bassLabel: '7th in the bass',
    degrees: ['seventh', 'third', 'fifth', 'root'],
  },
];

/** Same bass labels as drop 2. The stack above that bass note is different. */
export const DROP3_INVERSIONS: {
  id: InversionId;
  label: string;
  bassLabel: string;
  degrees: readonly ChordDegree[];
}[] = [
  {
    id: 'root',
    label: 'Root position',
    bassLabel: 'Root in the bass',
    degrees: ['root', 'seventh', 'third', 'fifth'],
  },
  {
    id: 'third',
    label: '1st inversion',
    bassLabel: '3rd in the bass',
    degrees: ['third', 'root', 'fifth', 'seventh'],
  },
  {
    id: 'fifth',
    label: '2nd inversion',
    bassLabel: '5th in the bass',
    degrees: ['fifth', 'third', 'seventh', 'root'],
  },
  {
    id: 'seventh',
    label: '3rd inversion',
    bassLabel: '7th in the bass',
    degrees: ['seventh', 'fifth', 'root', 'third'],
  },
];

export type DropVoicingNote = {
  string: number;
  fret: number;
  degree: ChordDegree;
  note: string;
};

export type DropVoicing = {
  inversion: InversionId;
  notes: DropVoicingNote[];
};

const degreeSemitones = (quality: ChordQualityId, degree: ChordDegree): number => {
  if (degree === 'root') return 0;
  return QUALITY_INTERVALS[quality][degree];
};

const noteAtInterval = (root: string, semitones: number): string => {
  const rootIndex = CHROMATIC_NOTES.indexOf(
    root as (typeof CHROMATIC_NOTES)[number]
  );
  if (rootIndex === -1) return root;
  return CHROMATIC_NOTES[(rootIndex + semitones) % 12];
};

/**
 * Place one stack on a string set.
 * The lowest string walks every fret of its chord tone. Each string above
 * takes the next higher pitch of its chord tone, so the octave of the
 * dropped note is fixed by the stack instead of by a stored shape.
 */
const placeDropVoicings = (
  root: string,
  quality: ChordQualityId,
  inversion: InversionId,
  degrees: readonly ChordDegree[],
  strings: readonly number[],
  maxFret: number,
  maxGripSpan: number
): DropVoicing[] => {
  const rootIndex = CHROMATIC_NOTES.indexOf(
    root as (typeof CHROMATIC_NOTES)[number]
  );
  if (rootIndex === -1 || degrees.length !== strings.length) return [];

  const semitones = degrees.map((degree) => degreeSemitones(quality, degree));
  const lowString = strings[0];
  const lowPitchClass = (rootIndex + semitones[0]) % 12;
  const voicings: DropVoicing[] = [];

  for (let fret = 0; fret <= maxFret; fret++) {
    const lowMidi = OPEN_STRING_MIDI[lowString] + fret;
    if (lowMidi % 12 !== lowPitchClass) continue;

    const notes: DropVoicingNote[] = [
      {
        string: lowString,
        fret,
        degree: degrees[0],
        note: noteAtInterval(root, semitones[0]),
      },
    ];
    let previousMidi = lowMidi;
    let fits = true;

    for (let index = 1; index < strings.length; index++) {
      const stringIndex = strings[index];
      const targetPitchClass = (rootIndex + semitones[index]) % 12;
      const stepsUp = (targetPitchClass - (previousMidi % 12) + 12) % 12 || 12;
      const midi = previousMidi + stepsUp;
      const nextFret = midi - OPEN_STRING_MIDI[stringIndex];

      if (nextFret < 0 || nextFret > maxFret) {
        fits = false;
        break;
      }

      notes.push({
        string: stringIndex,
        fret: nextFret,
        degree: degrees[index],
        note: noteAtInterval(root, semitones[index]),
      });
      previousMidi = midi;
    }

    if (!fits) continue;

    const frets = notes.map((voicingNote) => voicingNote.fret);
    const span = Math.max(...frets) - Math.min(...frets);
    if (span > maxGripSpan) continue;

    voicings.push({ inversion, notes });
  }

  return voicings;
};

/** Every drop-2 grip on one string set that fits inside maxFret, nut to body. */
export const getDrop2Voicings = (
  root: string,
  quality: ChordQualityId,
  strings: readonly number[],
  maxFret: number
): DropVoicing[] => {
  const voicings = DROP2_INVERSIONS.flatMap((inversion) =>
    placeDropVoicings(
      root,
      quality,
      inversion.id,
      inversion.degrees,
      strings,
      maxFret,
      DROP2_MAX_GRIP_SPAN
    )
  );

  return voicings.sort((a, b) => a.notes[0].fret - b.notes[0].fret);
};

/** Every drop-3 grip on one string set that fits inside maxFret, nut to body. */
export const getDrop3Voicings = (
  root: string,
  quality: ChordQualityId,
  strings: readonly number[],
  maxFret: number
): DropVoicing[] => {
  const voicings = DROP3_INVERSIONS.flatMap((inversion) =>
    placeDropVoicings(
      root,
      quality,
      inversion.id,
      inversion.degrees,
      strings,
      maxFret,
      DROP3_MAX_GRIP_SPAN
    )
  );

  return voicings.sort((a, b) => a.notes[0].fret - b.notes[0].fret);
};
