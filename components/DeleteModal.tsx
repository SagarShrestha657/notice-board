import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, isDeleting }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Delete Notice
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Are you sure you want to delete this notice? This action cannot be undone.
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
