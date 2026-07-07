import React from 'react';

export default function NoticeSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 p-6 shadow-sm">
      <div className="flex flex-col flex-1 animate-pulse">
        {/* Category & Date Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
        </div>
        
        {/* Title */}
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md mb-3" />
        <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-md mb-4" />
        
        {/* Body */}
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-md mb-6" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50 animate-pulse mt-auto">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
