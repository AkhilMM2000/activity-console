import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { tasksAdapter } from './tasksSlice';

// ==========================================
// 1. Base Tasks Selectors
// ==========================================
export const selectTasksState = (state: RootState) => state.tasks;

const adapterSelectors = tasksAdapter.getSelectors(selectTasksState);
export const selectAllTasks = adapterSelectors.selectAll;
export const selectTaskEntities = adapterSelectors.selectEntities;
export const selectTaskIds = adapterSelectors.selectIds;

export const selectTasksStatus = createSelector(
  selectTasksState,
  (tasks) => tasks.status
);

export const selectTasksError = createSelector(
  selectTasksState,
  (tasks) => tasks.error
);

export const selectPagination = createSelector(
  selectTasksState,
  (tasks) => tasks.pagination
);

// ==========================================
// 2. Toolbar State Selectors
// ==========================================
export const selectToolbarState = (state: RootState) => state.toolbar;
export const selectSearch = (state: RootState) => state.toolbar.search;
export const selectFilters = (state: RootState) => state.toolbar.filters;
export const selectSort = (state: RootState) => state.toolbar.sort;

/**
 * Returns true if the user has applied search query or filtered by type/status.
 */
export const selectHasActiveFilters = createSelector(
  selectSearch,
  selectFilters,
  (search, filters) => {
    return search.trim() !== '' || filters.type !== 'all' || filters.status !== 'all';
  }
);

/**
 * Performs client-side filtering and sorting on tasks stored in state.
 * Returns a cloned and sorted result array.
 */
export const selectFilteredAndSortedTasks = createSelector(
  selectAllTasks,
  selectSearch,
  selectFilters,
  selectSort,
  (tasks, search, filters, sort) => {
    const query = search.trim().toLowerCase();

    // A. Filter tasks first
    const filtered = tasks.filter((task) => {
      // 1. Search filter matches title or task ID
      const matchesSearch =
        query === '' ||
        task.title.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query);

      // 2. Type filter
      const matchesType = filters.type === 'all' || task.type === filters.type;

      // 3. Status filter
      const matchesStatus = filters.status === 'all' || task.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });

    // B. Sort a cloned array of the filtered results
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sort.by === 'updatedAt') {
        // Standard ISO 8601 lexicographical sorting
        comparison = a.updatedAt.localeCompare(b.updatedAt);
      } else if (sort.by === 'annotationCount') {
        comparison = a.annotationCount - b.annotationCount;
      }
      
      return sort.order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
);

/**
 * Returns the number of visible tasks after filtering.
 */
export const selectVisibleTaskCount = createSelector(
  selectFilteredAndSortedTasks,
  (filteredTasks) => filteredTasks.length
);

// ==========================================
// 3. Task Selection Selectors
// ==========================================
export const selectSelectedTaskId = (state: RootState) => state.taskView.selectedTaskId;

export const selectSelectedTask = createSelector(
  selectTaskEntities,
  selectSelectedTaskId,
  (entities, id) => (id ? entities[id] || null : null)
);

export const selectSelectedTaskExists = createSelector(
  selectSelectedTask,
  (task) => task !== null
);
