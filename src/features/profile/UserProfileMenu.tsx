import { useState } from 'react';
import { LogOut, Settings, User, Moon, Sun } from 'lucide-react';

export function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-[#F1F5F9] transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-[var(--color-iot-brand-surface)] text-[var(--color-iot-brand)] flex items-center justify-center font-semibold text-[11px] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          JS
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] rounded-lg shadow-[0_4px_12px_rgba(15,23,42,0.06)] py-1 z-50">
          <div className="px-4 py-2 border-b border-[var(--color-iot-border)]">
            <p className="text-sm font-medium text-[var(--color-iot-text-primary)]">Jane Smith</p>
            <p className="text-xs text-[var(--color-iot-text-secondary)]">System Admin</p>
          </div>
          
          <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-iot-text-secondary)] hover:bg-[#F1F5F9] hover:text-[var(--color-iot-text-primary)] flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </button>
          
          <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-iot-text-secondary)] hover:bg-[#F1F5F9] hover:text-[var(--color-iot-text-primary)] flex items-center gap-2">
            <Settings className="w-4 h-4" /> Preferences
          </button>
          
          <button 
            onClick={toggleTheme}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-iot-text-secondary)] hover:bg-[#F1F5F9] hover:text-[var(--color-iot-text-primary)] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
            </div>
          </button>
          
          <div className="border-t border-[var(--color-iot-border)] my-1"></div>
          
          <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-iot-critical)] hover:bg-red-50 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
