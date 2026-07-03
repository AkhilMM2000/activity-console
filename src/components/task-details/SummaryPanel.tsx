'use client';

import React, { useState, useEffect, useRef } from 'react';
import { streamTaskSummary } from '@/services/summaryApi';
import { renderMarkdown } from '@/utils/markdown';

interface SummaryPanelProps {
  taskId: string;
}

export function SummaryPanel({ taskId }: SummaryPanelProps) {
  const [summary, setSummary] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'streaming' | 'completed' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // A helper ref to keep track of the active task ID in effect
  const activeTaskIdRef = useRef<string>(taskId);

  // Synchronize ref on prop changes
  useEffect(() => {
    activeTaskIdRef.current = taskId;
  }, [taskId]);

  const startStream = (targetId: string) => {
    setStatus('loading');
    setSummary('');
    setError(null);

    const cleanup = streamTaskSummary(
      targetId,
      (chunk) => {
        // Prevent race condition: verify current taskId matches the stream's taskId
        if (activeTaskIdRef.current === targetId) {
          setStatus('streaming');
          setSummary((prev) => prev + chunk);
        }
      },
      () => {
        if (activeTaskIdRef.current === targetId) {
          setStatus('completed');
        }
      },
      (err) => {
        if (activeTaskIdRef.current === targetId) {
          setStatus('error');
          setError(err.message || 'An error occurred while generating the summary.');
        }
      }
    );

    return cleanup;
  };

  // Manage streaming lifecycle
  useEffect(() => {
    const cleanup = startStream(taskId);
    return () => {
      cleanup();
    };
  }, [taskId]);

  // Keep summary scrolled to the bottom during active streaming
  useEffect(() => {
    if (status === 'streaming' && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [summary, status]);

  const handleRetry = () => {
    startStream(taskId);
  };

  // 1. Loading / Generating State
  if (status === 'loading') {
    return (
      <div className="rounded-xl border border-zinc-150 p-5 bg-zinc-50/50 space-y-3.5 select-none">
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
          <svg
            className="animate-spin h-3.5 w-3.5 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>🤖 Generating AI Summary...</span>
        </div>
        <div className="space-y-2.5">
          <div className="h-3 bg-zinc-200/70 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-zinc-200/70 rounded-full w-[85%] animate-pulse" />
          <div className="h-3 bg-zinc-200/70 rounded-full w-[60%] animate-pulse" />
        </div>
      </div>
    );
  }

  // 2. Error State
  if (status === 'error') {
    return (
      <div className="rounded-xl border border-rose-150 bg-rose-50/20 p-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <span className="text-sm select-none">⚠️</span>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-800">Summary Generation Failed</h4>
            <p className="text-xs text-rose-600 leading-normal font-medium">{error}</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-50 active:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          Retry Generation
        </button>
      </div>
    );
  }

  // 3. Streaming and Completed States
  return (
    <div
      ref={containerRef}
      className="max-h-[350px] overflow-y-auto rounded-xl border border-zinc-150 p-4.5 bg-zinc-50/20 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-zinc-150/70 pb-2.5 select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🤖</span>
          <h4 className="text-xs font-bold text-zinc-800">AI Task Summary</h4>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
          status === 'streaming' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
          {status === 'streaming' && (
            <span className="h-1 w-1 rounded-full bg-indigo-500 animate-ping" />
          )}
          {status}
        </span>
      </div>

      {/* Render Markdown securely with custom inline-element selectors */}
      <div className="relative">
        <div
          className="prose prose-sm max-w-none text-zinc-700 leading-relaxed space-y-4 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-zinc-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:text-xs [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-xs [&_code]:bg-zinc-150 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11px] [&_code]:text-indigo-600 [&_pre]:bg-zinc-900 [&_pre]:text-zinc-100 [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre]:font-mono [&_pre_code]:bg-transparent [&_pre_code]:text-zinc-100 [&_pre_code]:p-0 [&_pre_code]:text-[11px]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
        />
        {status === 'streaming' && (
          <span className="inline-block w-1.5 h-4 bg-indigo-600 ml-1 align-middle animate-[pulse_1s_infinite]" />
        )}
      </div>
    </div>
  );
}
