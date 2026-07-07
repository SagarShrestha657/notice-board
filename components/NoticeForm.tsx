import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { NoticeInput, Category, Priority } from '../lib/types';
import { createNotice, updateNotice } from '../services/noticeService';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';
import Link from 'next/link';

interface NoticeFormProps {
  initialData?: NoticeInput & { id?: string };
  isEdit?: boolean;
}

export default function NoticeForm({ initialData, isEdit = false }: NoticeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<NoticeInput>({
    title: initialData?.title || '',
    body: initialData?.body || '',
    category: initialData?.category || 'General',
    priority: initialData?.priority || 'Normal',
    publishDate: initialData?.publishDate 
      ? new Date(initialData.publishDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEdit && initialData?.id) {
        await updateNotice(initialData.id, formData);
      } else {
        await createNotice(formData);
      }

      toast.success(isEdit ? 'Notice updated successfully!' : 'Notice created successfully!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save notice';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-white"
            placeholder="Enter notice title"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            required
            rows={5}
            value={formData.body}
            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-y dark:text-white"
            placeholder="Enter notice details"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none dark:text-white"
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none dark:text-white"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="publishDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Publish Date <span className="text-red-500">*</span>
          </label>
          <input
            id="publishDate"
            type="date"
            required
            value={formData.publishDate}
            onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
            className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-white"
          />
        </div>

      </div>

      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
        <Link
          href="/"
          className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 transition-all disabled:opacity-70 flex items-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? 'Update Notice' : 'Publish Notice'}
        </button>
      </div>
    </form>
  );
}
