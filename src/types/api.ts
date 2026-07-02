export interface RawUser {
  id: string;
  name: string;
}

export interface RawTask {
  id: string;
  title: string;
  type: string;                  // e.g. "image", "audio", "text"
  status: string;                // e.g. "InProgress", "done", "QA", "BLOCKED"
  assignee: RawUser | null;
  annotationCount: number | string;
  updatedAt: string | number;
  meta?: {
    priority?: string;           // nested inside meta
    note?: string;               // nested inside meta
  };
  priority?: string;             // fallback at root
  note?: string;                 // fallback at root
}

export interface GetTasksResponse {
  items: RawTask[];              
  total: number;
  page: number;
  pageSize: number;
}
