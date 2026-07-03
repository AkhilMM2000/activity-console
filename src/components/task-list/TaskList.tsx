import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectFilteredAndSortedTasks,
  selectTasksStatus,
  selectTasksError,
  selectPagination,
  selectHasActiveFilters,
} from '@/store/selectors';
import { selectTaskId } from '@/store/taskViewSlice';
import { fetchTasksPage } from '@/store/tasksSlice';
import { resetFilters } from '@/store/toolbarSlice';
import { TaskRow } from './TaskRow';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';

export function TaskList() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredAndSortedTasks);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  const status = useAppSelector(selectTasksStatus);
  const error = useAppSelector(selectTasksError);
  const pagination = useAppSelector(selectPagination);
  const selectedTaskId = useAppSelector((state) => state.taskView.selectedTaskId);

  const handleSelect = (id: string) => {
    // Toggle selection: if already selected, deselect; otherwise, select
    dispatch(selectTaskId(selectedTaskId === id ? null : id));
  };

  const handleRetry = () => {
    dispatch(fetchTasksPage(pagination.page));
  };

  const handlePageChange = (newPage: number) => {
    // 1. Explicitly clear selection on page change
    dispatch(selectTaskId(null));
    // 2. Fetch the requested page
    dispatch(fetchTasksPage(newPage));
    // 3. Scroll view to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Loading state
  if (status === 'loading' && tasks.length === 0) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Fetching annotation tasks..." size="lg" />
      </div>
    );
  }

  // 2. Error state
  if (status === 'failed' && tasks.length === 0) {
    return (
      <div className="py-12">
        <ErrorState message={error || undefined} onRetry={handleRetry} />
      </div>
    );
  }

  // 3. Empty state
  if (status === 'succeeded' && tasks.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="py-12">
          <EmptyState
            title="No matching tasks"
            message="No tasks match the active search query or filter selections."
            onClearFilters={() => dispatch(resetFilters())}
          />
        </div>
      );
    }
    return (
      <div className="py-12">
        <EmptyState message="No tasks are currently available in the queue." />
      </div>
    );
  }

  const { page, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  const startRange = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRange = Math.min(page * pageSize, total);

  return (
    <div className="relative overflow-hidden bg-white border border-zinc-150 rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left table-fixed min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-150 bg-zinc-50/75 select-none">
              <th className="w-[120px] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                Task ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                Task Title
              </th>
              <th className="w-[130px] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                Type
              </th>
              <th className="w-[140px] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="w-[180px] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                Assignee
              </th>
              <th className="w-[110px] px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
                Count
              </th>
              <th className="w-[150px] px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isSelected={selectedTaskId === task.id}
                onSelect={handleSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-150 bg-zinc-50/30 select-none">
          {/* Label stats */}
          <div className="text-xs text-zinc-500 font-medium">
            Showing <span className="font-bold text-zinc-800">{startRange}</span> to{' '}
            <span className="font-bold text-zinc-800">{endRange}</span> of{' '}
            <span className="font-bold text-zinc-800">{total}</span> tasks
          </div>

          {/* Loading details overlay */}
          {status === 'loading' && (
            <div className="text-xs font-semibold text-indigo-600 animate-pulse">
              Loading Page {page}...
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || status === 'loading'}
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || status === 'loading'}
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Mini loading status indicator overlay if fetching in background */}
      {status === 'loading' && tasks.length > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-100 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-[shimmer_1.5s_infinite_linear]" style={{ width: '40%' }} />
        </div>
      )}
    </div>
  );
}
