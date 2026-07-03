'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TaskType, TaskStatus } from '@/domain/constants';
import {
  selectSearch,
  selectFilters,
  selectSort,
  selectHasActiveFilters,
} from '@/store/selectors';
import {
  setSearch,
  setTypeFilter,
  setStatusFilter,
  setSortField,
  toggleSortOrder,
  resetFilters,
} from '@/store/toolbarSlice';

export function Toolbar() {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const filters = useAppSelector(selectFilters);
  const sort = useAppSelector(selectSort);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearch(''));
  };

  return (
    <div className="w-full bg-white border border-zinc-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between select-none">
      {/* Search Input block */}
      <div className="relative w-full md:max-w-xs group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by Title or ID..."
          className="w-full pl-9.5 pr-8 py-2 text-xs font-semibold rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-800 placeholder-zinc-400 transition hover:bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
        {search && (
          <button
            onClick={handleClearSearch}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters & Sorting controls */}
      <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <div className="flex flex-col gap-1">
          <select
            value={filters.type}
            onChange={(e) => dispatch(setTypeFilter(e.target.value as TaskType | 'all'))}
            className="appearance-none pr-8 pl-3.5 py-2 text-xs font-bold rounded-xl border border-zinc-200 bg-zinc-50/40 text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="all">All Media Types</option>
            <option value={TaskType.Image}>🖼️ Image</option>
            <option value={TaskType.Audio}>🎵 Audio</option>
            <option value={TaskType.Text}>📝 Text</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <select
            value={filters.status}
            onChange={(e) => dispatch(setStatusFilter(e.target.value as TaskStatus | 'all'))}
            className="appearance-none pr-8 pl-3.5 py-2 text-xs font-bold rounded-xl border border-zinc-200 bg-zinc-50/40 text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value={TaskStatus.Todo}>📋 Todo</option>
            <option value={TaskStatus.InProgress}>🔵 In Progress</option>
            <option value={TaskStatus.QA}>🟡 QA Pending</option>
            <option value={TaskStatus.Blocked}>🔴 Blocked</option>
            <option value={TaskStatus.Done}>🟢 Completed</option>
          </select>
        </div>

        {/* Sort Field */}
        <div className="flex items-center gap-1.5 border border-zinc-200 rounded-xl px-2 bg-zinc-50/40">
          <span className="text-[10px] font-bold text-zinc-400 uppercase pl-1.5">Sort</span>
          <select
            value={sort.by}
            onChange={(e) => dispatch(setSortField(e.target.value as 'updatedAt' | 'annotationCount'))}
            className="appearance-none pr-6 pl-1 py-2 text-xs font-bold text-zinc-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="annotationCount">Annotations</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => dispatch(toggleSortOrder())}
            type="button"
            className="p-1 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 rounded-lg transition"
            title={`Sort ${sort.order === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {sort.order === 'asc' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m1.5-1.5l3.75 3.75m0 0L21 12m-3.75 3.75V3" />
              </svg>
            )}
          </button>
        </div>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(resetFilters())}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition animate-[fadeIn_0.15s_ease-out]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
