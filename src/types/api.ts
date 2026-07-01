export interface RawUser {
  id: string;
  name: string;
}

export interface RawTask {
  id: string;
  title: string;
  type: string;                  // e.g. "image", "audio", "text", "video"
  status: string;                // e.g. "in_progress", "todo", "done", "qa", "blocked"
  assignee: RawUser | null;
  annotationCount: number | string; // Messy payloads might contain strings or numbers
  updatedAt: string | number;      // Dates could be ISO strings or Unix millisecond timestamps
  priority?: string;               // e.g. "low", "medium", "high"
  note?: string;                   // optional reviewer comments
}

export interface GetTasksResponse {
  tasks: RawTask[];
  total: number;
  page: number;
  pageSize: number;
}
