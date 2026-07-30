import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../../../widgets/header/AppHeader';
import { AppSidebar } from '../../../widgets/sidebar/AppSidebar';

// ─── Theme Context ────────────────────────────────────────────────────────────
type OpsTheme = 'light' | 'dark';
interface OpsThemeCtx { theme: OpsTheme; toggle: () => void }
export const OpsThemeContext = createContext<OpsThemeCtx>({ theme: 'light', toggle: () => {} });
export function useOpsTheme() { return useContext(OpsThemeContext); }

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [opsTheme, setOpsTheme] = useState<OpsTheme>(() => {
    const saved = localStorage.getItem('ops-theme') as OpsTheme;
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const location = useLocation();

  const isOps = location.pathname.startsWith('/operations');
  const isGov = location.pathname.startsWith('/government');

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleOpsTheme = () => {
    setOpsTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('ops-theme', next);
      return next;
    });
  };

  const themeClass = isOps
    ? (opsTheme === 'dark' ? 'theme-ops-dark dark' : 'theme-ops-light')
    : isGov
    ? (opsTheme === 'dark' ? 'theme-gov-dark dark' : 'theme-gov-light')
    : '';

  const bgColor = isOps
    ? 'bg-[var(--color-ops-bg)]'
    : isGov
    ? 'bg-[var(--color-gov-bg)]'
    : 'bg-[var(--color-iot-bg)]';

  // Sync with document element so portal components or external body styles also get the dark class
  useEffect(() => {
    if (opsTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [opsTheme]);

  return (
    <OpsThemeContext.Provider value={{ theme: opsTheme, toggle: toggleOpsTheme }}>
      <div className={`flex h-screen overflow-hidden ${bgColor} ${themeClass} font-sans selection:bg-[var(--color-iot-brand-surface)] selection:text-[var(--color-iot-brand)]`}>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar — shared, config-driven */}
        <AppSidebar isOpen={sidebarOpen} isOps={isOps} isGov={isGov} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col w-full h-full min-w-0 z-10 relative overflow-hidden">
          <AppHeader onMenuClick={() => setSidebarOpen(true)} isOps={isOps} isGov={isGov} />
          
          <main className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin ${isOps || isGov ? 'ops-main' : ''}`}>
            {isOps || isGov ? (
              // Operations & Government: full-bleed, no max-width constraint
              <div className="h-full flex flex-col">
                <Outlet />
              </div>
            ) : (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-h-full flex flex-col">
                <Outlet />
              </div>
            )}
          </main>
        </div>
      </div>
    </OpsThemeContext.Provider>
  );
}

