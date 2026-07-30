import { Modal } from '../Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmationDialogProps) {
  
  const getConfirmStyle = () => {
    switch (type) {
      case 'danger': return 'bg-[var(--color-gov-critical)] hover:bg-[var(--color-gov-critical-hover)] text-white';
      case 'warning': return 'bg-[var(--color-gov-warning)] hover:bg-amber-600 text-white';
      case 'info': return 'bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white';
      default: return 'bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger': return 'text-[var(--color-gov-critical)] bg-[var(--color-gov-critical)]/10';
      case 'warning': return 'text-[var(--color-gov-warning)] bg-[var(--color-gov-warning)]/10';
      case 'info': return 'text-[var(--color-gov-brand)] bg-[var(--color-gov-brand)]/10';
      default: return 'text-[var(--color-gov-brand)] bg-[var(--color-gov-brand)]/10';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 p-3 rounded-full ${getIconColor()}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-[14px] text-[var(--color-gov-text-secondary)] leading-relaxed mt-1">
            {message}
          </p>
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[var(--color-gov-border)]">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-bold text-[var(--color-gov-text-secondary)] hover:bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-colors ${getConfirmStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
