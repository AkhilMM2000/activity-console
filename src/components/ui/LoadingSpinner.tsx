import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message = 'Loading tasks...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6" role="status" aria-live="polite">
      <div
        className={`animate-spin rounded-full border-t-indigo-600 border-zinc-200 ${sizeClasses[size]}`}
      />
      {message && <span className="text-xs font-semibold text-zinc-500">{message}</span>}
    </div>
  );
}
