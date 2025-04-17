export interface PracticeElements {
  keys: boolean;
  chordProgressions: boolean;
  tempos: boolean;
  timeSignatures: boolean;
  chordExtensions: boolean;
  fretLimitations: boolean;
}

export interface Practice {
  id?: string;
  title: string;
  description: string;
  elements: PracticeElements;
  customDirections?: string;
  skillLevels: string[]; // Which skill levels this practice is for
  createdAt?: Date | null;
  updatedAt?: Date | null;
} 