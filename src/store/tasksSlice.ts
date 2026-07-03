import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { NormalizedTask } from '@/types/domain';
import { fetchTasks } from '@/services/taskApi';
import { normalizeTask, normalizeStatus, normalizeDate } from '@/domain/normalize';
import { getCachedTasksPage, setCachedTasksPage } from '@/services/cache';

export const tasksAdapter = createEntityAdapter<NormalizedTask>();

// Async thunk to fetch page data and normalize raw models
export const fetchTasksPage = createAsyncThunk(
  'tasks/fetchPage',
  async (page: number, { dispatch, rejectWithValue }) => {
    try {
      // 1. Try retrieving tasks from IndexedDB cache (TTL validated)
      const cached = await getCachedTasksPage(page);
      if (cached) {
        dispatch(tasksHydrated({ tasks: cached.tasks, total: cached.total, page }));
      }

      // 2. Fetch fresh tasks from API
      const response = await fetchTasks(page);
      const normalizedTasks = response.items.map(normalizeTask);

      // 3. Write fresh page data back to IndexedDB cache
      await setCachedTasksPage(page, { tasks: normalizedTasks, total: response.total });

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
  reducers: {
    tasksHydrated(
      state,
      action: PayloadAction<{ tasks: NormalizedTask[]; total: number; page: number }>
    ) {
      const { tasks, total, page } = action.payload;
      // Do not overwrite with stale cache if network response already resolved
      if (state.status === 'succeeded' && state.pagination.page === page) {
        return;
      }
      tasksAdapter.setAll(state, tasks);
      state.pagination.page = page;
      state.pagination.total = total;
    },
    taskUpdated(
      state,
      action: PayloadAction<{ id: string; status: string; updatedAt: number | string }>
    ) {
      const { id, status, updatedAt } = action.payload;
      const existing = state.entities[id];
      if (existing) {
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            status: normalizeStatus(status),
            updatedAt: normalizeDate(updatedAt),
          },
        });
      }
    },
    taskAssigned(
      state,
      action: PayloadAction<{ id: string; assignee: { id: string; name: string } | null }>
    ) {
      const { id, assignee } = action.payload;
      const existing = state.entities[id];
      if (existing) {
        tasksAdapter.updateOne(state, {
          id,
          changes: {
            assignee: assignee
              ? { id: assignee.id || 'unknown', name: assignee.name || 'Unknown Assignee' }
              : null,
          },
        });
      }
    },
    annotationCreated(state, action: PayloadAction<{ taskId: string }>) {
      const { taskId } = action.payload;
      const existing = state.entities[taskId];
      if (existing) {
        tasksAdapter.updateOne(state, {
          id: taskId,
          changes: {
            annotationCount: existing.annotationCount + 1,
          },
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksPage.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        // Clear list only when switching to a different page to prevent layout flashes
        if (state.pagination.page !== action.meta.arg) {
          tasksAdapter.removeAll(state);
        }
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

export const { tasksHydrated, taskUpdated, taskAssigned, annotationCreated } = tasksSlice.actions;
export default tasksSlice.reducer;
