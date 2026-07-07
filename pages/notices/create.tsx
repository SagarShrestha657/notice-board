import React from 'react';
import Head from 'next/head';
import NoticeForm from '../../components/NoticeForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateNotice() {
  return (
    <>
      <Head>
        <title>Create Notice | NoticeBoard</title>
      </Head>

      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Notice</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Fill in the details to publish a new notice to the board.</p>
          </div>
        </div>

        <NoticeForm />
      </div>
    </>
  );
}
