import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { NoticeInput, Category, Priority } from '../lib/types';
import { createNotice, updateNotice } from '../services/noticeService';
import { uploadImage } from '../services/uploadService';
import toast from 'react-hot-toast';
import { Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
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
    image: initialData?.image || '',
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

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

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notice Image (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl relative">
            <div className="space-y-1 text-center relative z-10">
              {formData.image ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full max-w-xs h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img 
                      src={formData.image} 
                      alt="Notice preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="text-sm text-red-600 hover:text-red-500 font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="image-upload" 
                        name="image-upload" 
                        type="file" 
                        accept="image/*"
                        className="sr-only" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>

            {isUploading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Uploading & Compressing...</p>
              </div>
            )}
          </div>
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
          disabled={isSubmitting || isUploading}
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
