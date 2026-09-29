import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { id, type, message, title, duration };

      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast(message, 'success', title);
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast(message, 'error', title);
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast(message, 'info', title);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      {/* Toast viewport */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4 sm:p-0"
        aria-live="polite"
        role="region"
      >
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const borderColor = isSuccess
            ? 'border-[#0F766E]/40 bg-[#FFFFFF]'
            : isError
            ? 'border-[#DC2626]/40 bg-[#FFFFFF]'
            : 'border-[#E2E8E6] bg-[#FFFFFF]';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg text-[#172121] transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${borderColor}`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />}
                {isError && <AlertCircle className="w-5 h-5 text-[#DC2626]" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-[#2563EB]" />}
              </div>
              <div className="flex-1 min-w-0 text-sm">
                {toast.title && <p className="font-semibold text-xs uppercase tracking-wider mb-0.5 text-[#172121]">{toast.title}</p>}
                <p className="text-[#172121] leading-snug whitespace-pre-line">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-[#647070] hover:text-[#172121] transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
