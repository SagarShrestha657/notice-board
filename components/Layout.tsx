import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Bell, Plus, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                NoticeBoard
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/notices/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-full shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                New Notice
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} NoticeBoard. Built with Next.js & Prisma.</p>
        </div>
      </footer>
    </div>
  );
}
