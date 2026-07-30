import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className={`relative w-full ${maxWidth} bg-[var(--color-gov-bg)] border border-[var(--color-gov-border)] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]">
          <h2 className="text-[15px] font-bold text-[var(--color-gov-text-primary)]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--color-gov-border)] rounded-md text-[var(--color-gov-text-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
