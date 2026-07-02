import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedTask } from '@/store/selectors';
import { selectTaskId } from '@/store/taskViewSlice';
import { TaskMetadata } from './TaskMetadata';

export function TaskDetailsPanel() {
  const dispatch = useAppDispatch();
  const task = useAppSelector(selectSelectedTask);

  const handleClose = () => {
    dispatch(selectTaskId(null));
  };

  if (!task) {
    return (
      <div className="flex h-full items-center justify-center p-6 border border-zinc-150 rounded-2xl bg-white text-center">
        <span className="text-xs text-zinc-400 italic">No task selected.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
      {/* Panel Header */}
      <header className="flex items-start justify-between border-b border-zinc-150 p-5 bg-zinc-50/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest bg-zinc-150 px-1.5 py-0.5 rounded">
              ID: {task.id}
            </span>
          </div>
          <h2 className="text-base font-bold text-zinc-950 leading-snug line-clamp-2">
            {task.title}
          </h2>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close details"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-150/70 hover:text-zinc-600 active:bg-zinc-200/80 transition focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6x12" />
            <path d="M18 18L6 6" />
          </svg>
        </button>
      </header>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <TaskMetadata task={task} />

        {/* Placeholder for AI Summary Stream */}
        <div className="border-t border-zinc-100 pt-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 select-none">
            AI task Summary
          </h3>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 border-dashed text-center">
            <span className="text-xs text-zinc-400 italic font-medium">
              AI Summary stream will be connected here in a later milestone.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
