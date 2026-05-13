'use client';
import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error';

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const show = (message: string, type: ToastType) => setToast({ message, type });
  const hide = () => setToast(null);
  return { toast, show, hide };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, hide } = useToast();
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hide, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hide]);
  return (
    <>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-up">
          <div className={`flex items-center gap-3 px-4 py-3 border-l-4 shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-900/20 border-green-500 text-green-500' 
              : 'bg-red-900/20 border-red-500 text-red-500'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="font-mono text-sm">{toast.message}</span>
            <button onClick={hide} className="ml-4"><X size={14} /></button>
          </div>
        </div>
      )}
    </>
  );
}