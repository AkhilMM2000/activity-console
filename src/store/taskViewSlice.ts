import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TaskSummary {
  content: string;
  status: 'idle' | 'streaming' | 'complete' | 'error';
  error?: string;
}

interface TaskViewState {
  selectedTaskId: string | null;
  summaryByTaskId: Record<string, TaskSummary>;
}

const initialState: TaskViewState = {
  selectedTaskId: null,
  summaryByTaskId: {},
};

const taskViewSlice = createSlice({
  name: 'taskView',
  initialState,
  reducers: {
    selectTaskId(state, action: PayloadAction<string | null>) {
      state.selectedTaskId = action.payload;
    },
  },
});

export const { selectTaskId } = taskViewSlice.actions;
export default taskViewSlice.reducer;
