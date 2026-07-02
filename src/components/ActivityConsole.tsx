'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasksPage } from '@/store/tasksSlice';
import { selectSelectedTaskExists } from '@/store/selectors';
import { TaskList } from './task-list/TaskList';
import { TaskDetailsPanel } from './task-details/TaskDetailsPanel';

export default function ActivityConsole() {
  const dispatch = useAppDispatch();
  const selectedTaskExists = useAppSelector(selectSelectedTaskExists);

  // On mount, trigger the fetch for the first page of tasks
  useEffect(() => {
    dispatch(fetchTasksPage(1));
  }, [dispatch]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      <header className="mb-6 flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
          Annotation Activity Console
        </h1>
        <p className="text-sm font-medium text-zinc-500">
          Supervise task queues and monitor annotator updates in real-time.
        </p>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: Task List */}
        <div className="flex-1 w-full">
          <TaskList />
        </div>
        
        {/* Right Side: Detail Panel */}
        {selectedTaskExists && (
          <aside className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-6 self-stretch lg:self-start max-h-[calc(100vh-8rem)]">
            <TaskDetailsPanel />
          </aside>
        )}
      </main>
    </div>
  );
}
