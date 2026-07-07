import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, AlertCircle, Clock } from 'lucide-react';
import { Notice } from '../lib/types';
import clsx from 'clsx';
import { CldImage } from 'next-cloudinary';

interface NoticeCardProps {
  notice: Notice;
  onDelete: (id: string) => void;
}

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const isUrgent = notice.priority === 'Urgent';

  return (
    <div className={clsx(
      "group relative overflow-hidden rounded-2xl border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      isUrgent ? "border-red-200 dark:border-red-900/50" : "border-slate-200 dark:border-slate-700/50"
    )}>
      {isUrgent && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl z-10">
          <div className="absolute top-3 -right-6 w-24 rotate-45 bg-red-500 text-center text-[10px] font-bold text-white py-1 shadow-sm">
            URGENT
          </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Optional Image */}
        {notice.image && (
          <div className="relative w-full h-48 mb-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shrink-0">
            <CldImage
              src={notice.image}
              alt={notice.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <span className={clsx(
            "px-2.5 py-1 text-xs font-medium rounded-full",
            notice.category === 'Exam' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            notice.category === 'Event' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
            notice.category === 'General' && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          )}>
            {notice.category}
          </span>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {format(new Date(notice.publishDate), 'MMM d, yyyy')}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {notice.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-6 flex-1">
          {notice.body}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
          <Clock className="w-3.5 h-3.5 mr-1" />
          Posted {format(new Date(notice.createdAt), 'MMM d, yyyy')}
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            title="Edit notice"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(notice.id)}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete notice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
