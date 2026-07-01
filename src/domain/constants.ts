export enum TaskType {
  Image = 'image',
  Audio = 'audio',
  Text = 'text',
  Unknown = 'unknown',
}

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  QA = 'qa',
  Blocked = 'blocked',
  Done = 'done',
}

export const SORT_FIELDS = {
  UPDATED_AT: 'updatedAt',
  ANNOTATION_COUNT: 'annotationCount',
} as const;
