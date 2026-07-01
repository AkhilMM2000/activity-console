import { TaskType, TaskStatus } from '@/domain/constants';

export interface User {
  id: string;
  name: string;
}

export interface NormalizedTask {
  id: string;
  title: string;
  type: TaskType;
  rawType: string;               // Preserve original raw string for debug/UI transparency
  status: TaskStatus;
  rawStatus: string;             // Preserve original status string
  assignee: User | null;
  annotationCount: number;       // Normalized to numeric integer
  updatedAt: string;             // Normalized to standard ISO 8601 string
  priority: 'low' | 'medium' | 'high'; // Normalized to strict literals
  note?: string;                 // Sanitized reviewer notes
}
