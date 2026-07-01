import { GetTasksResponse } from '@/types/api';

const API_BASE = 'http://localhost:4000';

/**
 * Fetches a paginated page of tasks from the REST API.
 */
export async function fetchTasks(page: number, pageSize: number = 20): Promise<GetTasksResponse> {
  const url = `${API_BASE}/api/tasks?page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
  }
  
  return response.json();
}
