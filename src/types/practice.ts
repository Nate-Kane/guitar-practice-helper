export interface Practice {
  id?: string;
  title: string;
  description: string;
  customDirections?: string;
  skillLevels: string[];
  practiceTips?: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
} 