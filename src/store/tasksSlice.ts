import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { NormalizedTask } from '@/types/domain';
import { fetchTasks } from '@/services/taskApi';
import { normalizeTask } from '@/domain/normalize';

export const tasksAdapter = createEntityAdapter<NormalizedTask>();

// Async thunk to fetch page data and normalize raw models
export const fetchTasksPage = createAsyncThunk(
  'tasks/fetchPage',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await fetchTasks(page);
      
      const normalizedTasks = response.items.map(normalizeTask);

      return {
        tasks: normalizedTasks,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to retrieve fresh tasks.');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksPage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasksPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        tasksAdapter.setAll(state, action.payload.tasks);
        state.pagination.page = action.payload.page;
        state.pagination.pageSize = action.payload.pageSize;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchTasksPage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
