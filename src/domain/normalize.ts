import { RawTask } from '@/types/api';
import { NormalizedTask } from '@/types/domain';
import { TaskType, TaskStatus } from '@/domain/constants';

/**
 * Standardizes raw status strings (e.g., "In Progress", "in-progress", "qa_pending") 
 * into normalized TaskStatus enum keys.
 */
export function normalizeStatus(rawStatus: string): TaskStatus {
  if (!rawStatus) return TaskStatus.Todo;

  // lowercase and replace hyphens/spaces with underscores
  const cleaned = rawStatus.toLowerCase().trim().replace(/[-\s]/g, '_');

  switch (cleaned) {
    case 'todo':
      return TaskStatus.Todo;
    case 'in_progress':
    case 'inprogress':
    case 'progress':
      return TaskStatus.InProgress;
    case 'qa':
    case 'qa_pending':
    case 'qapending':
      return TaskStatus.QA;
    case 'blocked':
      return TaskStatus.Blocked;
    case 'done':
    case 'completed':
    case 'complete':
      return TaskStatus.Done;
    default:
      return TaskStatus.Todo;
  }
}

/**
 * Standardizes raw type strings into TaskType enum keys.
 */
export function normalizeType(rawType: string): TaskType {
  if (!rawType) return TaskType.Unknown;

  const cleaned = rawType.toLowerCase().trim();
  switch (cleaned) {
    case 'image':
    case 'photo':
      return TaskType.Image;
    case 'audio':
    case 'sound':
    case 'voice':
      return TaskType.Audio;
    case 'text':
    case 'document':
      return TaskType.Text;
    default:
      return TaskType.Unknown;
  }
}

/**
 * Standardizes annotation count inputs (numbers or stringified numbers) to a integer.
 */
export function normalizeAnnotationCount(rawCount: any): number {
  if (rawCount === undefined || rawCount === null) return 0;
  
  const parsed = parseInt(rawCount, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normalizes date representations (timestamps, ISO strings, etc.) to ISO 8601 strings.
 */
export function normalizeDate(rawDate: any): string {
  if (!rawDate) return new Date().toISOString();

  // If it's a pure number or string containing only digits, parse as timestamp
  if (typeof rawDate === 'number' || /^\d+$/.test(rawDate)) {
    const timestamp = parseInt(rawDate as any, 10);
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }

  // Otherwise, parse as standard date string
  const date = new Date(rawDate);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

/**
 * Converts a raw untrusted task payload into a normalized, strictly typed NormalizedTask model.
 */
export function normalizeTask(raw: RawTask): NormalizedTask {
  // Normalize priority to low, medium, or high (check meta object first)
  let priority: 'low' | 'medium' | 'high' = 'medium';
  const rawPriority = raw.meta?.priority || raw.priority;
  if (rawPriority) {
    const p = rawPriority.toLowerCase().trim();
    if (p === 'low' || p === 'medium' || p === 'high') {
      priority = p;
    }
  }

  const note = raw.meta?.note || raw.note;

  return {
    id: raw.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
    title: raw.title || 'Untitled Task',
    type: normalizeType(raw.type),
    rawType: raw.type || '',
    status: normalizeStatus(raw.status),
    rawStatus: raw.status || '',
    assignee: raw.assignee
      ? {
          id: raw.assignee.id || 'unknown',
          name: raw.assignee.name || 'Unknown Assignee',
        }
      : null,
    annotationCount: normalizeAnnotationCount(raw.annotationCount),
    updatedAt: normalizeDate(raw.updatedAt),
    priority,
    note: note || undefined,
  };
}
