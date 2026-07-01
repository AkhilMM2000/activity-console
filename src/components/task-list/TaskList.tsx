import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAllTasks, selectTasksStatus, selectTasksError, selectPagination } from '@/store/selectors';
import { selectTaskId } from '@/store/taskViewSlice';
import { fetchTasksPage } from '@/store/tasksSlice';
import { TaskRow } from './TaskRow';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';

export function TaskList() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
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
    return (
      <div className="py-12">
        <EmptyState message="No tasks are currently available in the queue." />
      </div>
    );
  }

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

      {/* Mini loading status indicator overlay if fetching in background */}
      {status === 'loading' && tasks.length > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-100 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-[shimmer_1.5s_infinite_linear]" style={{ width: '40%' }} />
        </div>
      )}
    </div>
  );
}
