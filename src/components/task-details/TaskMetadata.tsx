import React from 'react';
import { NormalizedTask } from '@/types/domain';
import { TaskType, TaskStatus } from '@/domain/constants';

interface TaskMetadataProps {
  task: NormalizedTask;
}

export function TaskMetadata({ task }: TaskMetadataProps) {
  const { id, type, status, assignee, annotationCount, updatedAt, priority, note } = task;

  // Status mapping matching TaskRow styling
  const statusStyles: Record<TaskStatus, { bg: string; text: string; dot: string; label: string }> = {
    [TaskStatus.Todo]: { bg: 'bg-zinc-100', text: 'text-zinc-700', dot: 'bg-zinc-400', label: 'Todo' },
    [TaskStatus.InProgress]: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'In Progress' },
    [TaskStatus.QA]: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'QA Pending' },
    [TaskStatus.Blocked]: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Blocked' },
    [TaskStatus.Done]: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
  };
  const statusStyle = statusStyles[status] || statusStyles[TaskStatus.Todo];

  // Type mapping matching TaskRow styling
  const typeStyles: Record<TaskType, { bg: string; text: string; icon: string }> = {
    [TaskType.Image]: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '🖼️' },
    [TaskType.Audio]: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🎵' },
    [TaskType.Text]: { bg: 'bg-violet-50', text: 'text-violet-700', icon: '📝' },
    [TaskType.Unknown]: { bg: 'bg-zinc-50', text: 'text-zinc-600', icon: '❓' },
  };
  const typeStyle = typeStyles[type] || typeStyles[TaskType.Unknown];

  // Priority styling
  const priorityStyles = {
    low: 'bg-zinc-50 border-zinc-200 text-zinc-600',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    high: 'bg-rose-50 border-rose-200 text-rose-700 font-bold',
  };

  const formattedDate = new Date(updatedAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider select-none">
        Task Attributes
      </h3>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-150 p-4 bg-zinc-50/50">
        {/* 1. Status */}
        <div>
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</span>
          <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {statusStyle.label}
          </span>
        </div>

        {/* 2. Type */}
        <div>
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Type</span>
          <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
            <span className="text-[10px]">{typeStyle.icon}</span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>

        {/* 3. Priority */}
        <div>
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Priority</span>
          <span className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${priorityStyles[priority]}`}>
            {priority.toUpperCase()}
          </span>
        </div>

        {/* 4. Annotations */}
        <div>
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Annotations</span>
          <span className="mt-1 block text-sm font-mono font-bold text-zinc-800">
            {annotationCount}
          </span>
        </div>

        {/* 5. Assignee */}
        <div className="col-span-2 border-t border-zinc-150/65 pt-3">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Assignee</span>
          {assignee ? (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600 uppercase">
                {assignee.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-zinc-800">{assignee.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono">({assignee.id})</span>
            </div>
          ) : (
            <span className="mt-1 block text-xs text-zinc-400 italic">Unassigned</span>
          )}
        </div>

        {/* 6. Last Updated */}
        <div className="col-span-2 border-t border-zinc-150/65 pt-3">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Last Modified</span>
          <span className="mt-1 block text-xs font-mono text-zinc-600">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Note segment */}
      {note && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-4">
          <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            Reviewer Note
          </span>
          <p className="mt-1.5 text-xs text-zinc-700 leading-relaxed font-medium">
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
