'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchTasksPage } from '@/store/tasksSlice';
import { TaskList } from './task-list/TaskList';

export default function ActivityConsole() {
  const dispatch = useAppDispatch();

  // On mount, trigger the fetch for the first page of tasks
  useEffect(() => {
    dispatch(fetchTasksPage(1));
  }, [dispatch]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      <header className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
          Annotation Activity Console
        </h1>
        <p className="text-sm font-medium text-zinc-500">
          Supervise task queues and monitor annotator updates in real-time.
        </p>
      </header>
      
      <main className="flex-1">
        <TaskList />
      </main>
    </div>
  );
}
