import { createSlice } from '@reduxjs/toolkit';
import { NormalizedTask } from '@/types/domain';

interface TasksState {
  ids: string[];
  entities: Record<string, NormalizedTask>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

const initialState: TasksState = {
  ids: [],
  entities: {},
  status: 'idle',
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
});

export default tasksSlice.reducer;
