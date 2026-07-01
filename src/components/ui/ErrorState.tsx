import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load task information from the server.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50/50 border border-rose-100 rounded-2xl text-center max-w-md mx-auto my-6 shadow-sm">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 text-rose-600 mb-4 border border-rose-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 active:bg-rose-700 transition focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
