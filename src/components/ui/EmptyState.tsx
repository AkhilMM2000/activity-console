import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export function EmptyState({
  title = 'No tasks found',
  message = 'Try modifying your search keywords or filter criteria.',
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-zinc-150 border-dashed rounded-2xl text-center my-6 select-none bg-zinc-50/50">
      <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-200 font-bold text-sm">
        ∅
      </div>
      <h3 className="text-sm font-bold text-zinc-800">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">{message}</p>
      
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          type="button"
          className="mt-5 inline-flex items-center justify-center rounded-xl border border-zinc-250 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
