'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, message, type, duration = 5000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-green-50',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-pink-600',
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-50',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      icon: <Info className="w-5 h-5" />,
      color: 'text-blue-50',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-yellow-50',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 transform transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-96 opacity-0'}
      `}
    >
      <div className={`${style.bg} rounded-xl shadow-2xl px-6 py-4 flex items-center gap-4 max-w-md`}>
        <div className={`${style.color} flex-shrink-0`}>
          {style.icon}
        </div>
        <p className={`${style.color} font-medium text-sm flex-1`}>
          {message}
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className={`${style.color} hover:opacity-75 transition-opacity flex-shrink-0`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
