export interface Practice {
  id?: string;
  /** URL path segment, e.g. "strumming" → /practice/strumming */
  slug?: string;
  title: string;
  description: string;
  customDirections?: string;
  /** When true, the practice stays out of the public practices list. */
  hidden?: boolean;
  practiceTips?: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
} 