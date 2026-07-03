import React, { useState, useEffect, useRef } from 'react';
import { NormalizedTask } from '@/types/domain';
import { TaskType, TaskStatus } from '@/domain/constants';

interface TaskRowProps {
  task: NormalizedTask;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function TaskRow({ task, isSelected, onSelect }: TaskRowProps) {
  const { id, title, type, status, assignee, annotationCount, updatedAt } = task;

  // 1. Flash effect states
  const [flashCount, setFlashCount] = useState(false);
  const [flashStatus, setFlashStatus] = useState(false);

  const prevCountRef = useRef(annotationCount);
  const prevStatusRef = useRef(status);

  // Trigger brief highlight on annotation count updates
  useEffect(() => {
    if (annotationCount !== prevCountRef.current) {
      setFlashCount(true);
      const timer = setTimeout(() => setFlashCount(false), 800);
      prevCountRef.current = annotationCount;
      return () => clearTimeout(timer);
    }
  }, [annotationCount]);

  // Trigger brief highlight on status changes
  useEffect(() => {
    if (status !== prevStatusRef.current) {
      setFlashStatus(true);
      const timer = setTimeout(() => setFlashStatus(false), 800);
      prevStatusRef.current = status;
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Status badge styles
  const statusStyles: Record<TaskStatus, { bg: string; text: string; dot: string; label: string }> = {
    [TaskStatus.Todo]: { bg: 'bg-zinc-100', text: 'text-zinc-700', dot: 'bg-zinc-400', label: 'Todo' },
    [TaskStatus.InProgress]: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'In Progress' },
    [TaskStatus.QA]: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'QA Pending' },
    [TaskStatus.Blocked]: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Blocked' },
    [TaskStatus.Done]: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
  };
  const statusStyle = statusStyles[status] || statusStyles[TaskStatus.Todo];

  // Type badge styles
  const typeStyles: Record<TaskType, { bg: string; text: string; icon: string }> = {
    [TaskType.Image]: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '🖼️' },
    [TaskType.Audio]: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🎵' },
    [TaskType.Text]: { bg: 'bg-violet-50', text: 'text-violet-700', icon: '📝' },
    [TaskType.Unknown]: { bg: 'bg-zinc-50', text: 'text-zinc-600', icon: '❓' },
  };
  const typeStyle = typeStyles[type] || typeStyles[TaskType.Unknown];

  const formattedDate = new Date(updatedAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <tr
      onClick={() => onSelect(id)}
      className={`group cursor-pointer select-none border-b border-zinc-100 transition hover:bg-zinc-50/70 active:bg-zinc-100/50 ${
        isSelected ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : ''
      }`}
    >
      {/* 1. ID */}
      <td className="px-6 py-4.5 text-xs font-mono font-bold text-zinc-400 group-hover:text-indigo-600 transition">
        {id}
      </td>

      {/* 2. Title */}
      <td className="px-6 py-4.5">
        <div className="text-sm font-semibold text-zinc-950 line-clamp-1">{title}</div>
      </td>

      {/* 3. Media Type */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
          <span className="text-[10px]">{typeStyle.icon}</span>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </td>

      {/* 4. Status */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 ${
          flashStatus ? 'ring-2 ring-indigo-500/30 scale-105 shadow-sm' : ''
        } ${statusStyle.bg} ${statusStyle.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
          {statusStyle.label}
        </span>
      </td>

      {/* 5. Assignee */}
      <td className="px-6 py-4.5 whitespace-nowrap text-sm text-zinc-600">
        {assignee ? (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600 uppercase">
              {assignee.name.charAt(0)}
            </div>
            <span className="font-medium text-zinc-800">{assignee.name}</span>
          </div>
        ) : (
          <span className="text-zinc-400 italic font-normal text-xs">Unassigned</span>
        )}
      </td>

      {/* 6. Annotation Count */}
      <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm font-mono font-semibold">
        <span className={`inline-block px-1.5 py-0.5 rounded transition-all duration-300 ${
          flashCount ? 'bg-indigo-100 text-indigo-700 font-bold scale-110 shadow-sm' : 'text-zinc-700'
        }`}>
          {annotationCount}
        </span>
      </td>

      {/* 7. Last Updated */}
      <td className="px-6 py-4.5 whitespace-nowrap text-right text-xs font-mono text-zinc-450">
        {formattedDate}
      </td>
    </tr>
  );
}
