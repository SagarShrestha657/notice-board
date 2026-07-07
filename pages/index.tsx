import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { Notice, Category } from '../lib/types';
import { getNotices, deleteNotice } from '../services/noticeService';
import NoticeCard from '../components/NoticeCard';
import NoticeSkeleton from '../components/NoticeSkeleton';
import DeleteModal from '../components/DeleteModal';
import { Search, Filter, InboxIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch initial notices on mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const result = await getNotices(1, 10);
        setNotices(result.notices);
        setHasMore(result.hasMore);
      } catch (error) {
        toast.error('Failed to load notices');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getNotices(nextPage, 10);
      setNotices(prev => [...prev, ...result.notices]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      toast.error('Failed to load more notices');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setNoticeToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteNotice(noticeToDelete);
      toast.success('Notice deleted successfully');
      setNotices(prev => prev.filter(n => n.id !== noticeToDelete));
    } catch (error) {
      toast.error('Failed to delete notice');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setNoticeToDelete(null);
    }
  };

  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.body.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notices, searchQuery, selectedCategory]);

  return (
    <>
      <Head>
        <title>NoticeBoard | Home</title>
      </Head>

      <div className="flex flex-col gap-8">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">

          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            {['All', 'General', 'Event', 'Exam'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NoticeSkeleton />
            <NoticeSkeleton />
            <NoticeSkeleton />
            <NoticeSkeleton />
          </div>
        ) : filteredNotices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotices.map((notice, index) => (
                <div
                  key={notice.id}
                  className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
                  style={{ animationDelay: `${(index % 10) * 100}ms` }}
                >
                  <NoticeCard
                    notice={notice}
                    onDelete={handleDeleteClick}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 font-medium rounded-full transition-all flex items-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {isLoadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <InboxIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notices found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              {searchQuery || selectedCategory !== 'All'
                ? "We couldn't find any notices matching your current filters."
                : "There are no notices published yet. Click 'New Notice' to create one."}
            </p>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
