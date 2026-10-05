export interface Practice {
  id?: string;
  /** URL path segment, e.g. "strumming" → /practice/strumming */
  slug?: string;
  title: string;
  description: string;
  customDirections?: string;
  skillLevels: string[];
  practiceTips?: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
} 