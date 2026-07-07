import React from 'react';
import Head from 'next/head';
import NoticeForm from '../../../components/NoticeForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NoticeInput } from '../../../lib/types';
import prisma from '../../../lib/prisma';
import { GetServerSideProps } from 'next';

interface EditNoticeProps {
  initialData: NoticeInput & { id: string };
}

export default function EditNotice({ initialData }: EditNoticeProps) {
  return (
    <>
      <Head>
        <title>Edit Notice | NoticeBoard</title>
      </Head>

      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6 flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors hover:shadow-md hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Notice</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update the information for this notice.</p>
          </div>
        </div>

        <NoticeForm initialData={initialData} isEdit={true} />
      </div>
    </>
  );
}

// Fetch data on the server instantly before the page loads
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  
  if (!id) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({
    where: { id }
  });

  if (!notice) {
    return { notFound: true };
  }

  // Next.js requires dates to be serialized to strings for page props
  const serializedNotice = {
    ...notice,
    publishDate: notice.publishDate.toISOString(),
    createdAt: notice.createdAt.toISOString(),
    updatedAt: notice.updatedAt.toISOString(),
  };

  return {
    props: {
      initialData: serializedNotice
    }
  };
}
