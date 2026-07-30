import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial system/saved preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
