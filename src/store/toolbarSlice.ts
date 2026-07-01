import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskType, TaskStatus } from '@/domain/constants';

interface ToolbarState {
  search: string;
  filters: {
    type: TaskType | 'all';
    status: TaskStatus | 'all';
  };
  sort: {
    by: 'updatedAt' | 'annotationCount';
    order: 'asc' | 'desc';
  };
}

const initialState: ToolbarState = {
  search: '',
  filters: {
    type: 'all',
    status: 'all',
  },
  sort: {
    by: 'updatedAt',
    order: 'desc',
  },
};

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setTypeFilter(state, action: PayloadAction<TaskType | 'all'>) {
      state.filters.type = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<TaskStatus | 'all'>) {
      state.filters.status = action.payload;
    },
    setSortField(state, action: PayloadAction<'updatedAt' | 'annotationCount'>) {
      state.sort.by = action.payload;
    },
    toggleSortOrder(state) {
      state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
    },
    resetFilters(state) {
      state.search = '';
      state.filters.type = 'all';
      state.filters.status = 'all';
      state.sort.by = 'updatedAt';
      state.sort.order = 'desc';
    },
  },
});

export const {
  setSearch,
  setTypeFilter,
  setStatusFilter,
  setSortField,
  toggleSortOrder,
  resetFilters,
} = toolbarSlice.actions;

export default toolbarSlice.reducer;
