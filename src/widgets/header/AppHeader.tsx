import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Settings, Menu, Wind, Thermometer, Cloud, Users, ShieldAlert } from 'lucide-react';
import { GlobalSearch } from '../../features/search/GlobalSearch';
import { NotificationCenter } from '../../features/notifications/NotificationCenter';
import { useGovStore } from '../../platforms/enterprise/government/context/GovContext';

interface AppHeaderProps {
  onMenuClick: () => void;
  isOps?: boolean;
  isGov?: boolean;
}

function GovHeaderProfile() {
  const { state } = useGovStore();
  const name = state.profile.name;
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <>
      <span className="text-[13px] font-medium hidden sm:block text-[var(--color-gov-text-primary)]">{name}</span>
      <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-gov-brand)] to-[#22C55E] rounded-full flex items-center justify-center text-white shadow-sm border border-white">
        <span className="text-[11px] font-bold">{initials}</span>
      </div>
    </>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────

export function AppHeader({ onMenuClick, isOps = false, isGov = false }: AppHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const headerBg = isGov ? 'bg-[var(--color-gov-header)]' : isOps ? 'bg-[var(--color-ops-header)]' : 'bg-white';
  const borderColor = isGov ? 'border-[var(--color-gov-border)]' : isOps ? 'border-[var(--color-ops-border)]' : 'border-[var(--color-iot-border)]';
  const platformLabel = isGov ? 'Government' : isOps ? 'Operations' : 'IoT Platform';
  const platformLabelColor = isGov ? 'text-[var(--color-gov-brand)]' : isOps ? 'text-[var(--color-ops-brand)]' : 'text-[var(--color-iot-text-secondary)]';
  
  const searchBg = isGov 
    ? 'bg-[var(--color-gov-surface)] border-[var(--color-gov-border)] hover:border-[var(--color-gov-brand)]/40 hover:bg-[var(--color-gov-card)]'
    : isOps 
    ? 'bg-[var(--color-ops-surface)] border-[var(--color-ops-border)] hover:border-[var(--color-ops-brand)]/40 hover:bg-[var(--color-ops-card)]' 
    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[var(--color-iot-border)] hover:bg-white';
  
  const searchText = isGov ? 'text-[var(--color-gov-text-muted)]' : isOps ? 'text-[var(--color-ops-text-muted)]' : 'text-[var(--color-iot-text-muted)]';
  const searchIcon = isGov ? 'text-[var(--color-gov-text-muted)] group-hover:text-[var(--color-gov-brand)]' : isOps ? 'text-[var(--color-ops-text-muted)] group-hover:text-[var(--color-ops-brand)]' : 'text-[var(--color-iot-text-muted)] group-hover:text-[var(--color-iot-brand)]';
  
  const iconBtn = isGov
    ? 'text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)] hover:bg-[var(--color-gov-surface)]'
    : isOps
    ? 'text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)]'
    : 'text-[var(--color-iot-text-secondary)] hover:text-[var(--color-iot-text-primary)] hover:bg-[var(--color-iot-sidebar)]';

  const searchPlaceholder = isGov 
    ? 'Search advisories, policies, campaigns...' 
    : isOps 
    ? 'Search incidents, zones, alerts...' 
    : 'Search devices, fleets, incidents...';

  const searchKbd = isGov
    ? 'text-[var(--color-gov-text-secondary)] bg-[var(--color-gov-surface)] border-[var(--color-gov-border)]'
    : isOps
    ? 'text-[var(--color-ops-text-secondary)] bg-[var(--color-ops-surface)] border-[var(--color-ops-border)]'
    : 'text-[var(--color-iot-text-secondary)] bg-white border-[#E2E8F0]';

  const profileBorder = isGov
    ? 'border-[var(--color-gov-border)] bg-[var(--color-gov-card)]'
    : isOps
    ? 'border-[var(--color-ops-border)] bg-[var(--color-ops-card)]'
    : 'border-[#E2E8F0] bg-white';

  const profileText = isGov
    ? 'text-[var(--color-gov-text-primary)] hover:bg-[var(--color-gov-surface)]'
    : isOps
    ? 'text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)]'
    : 'text-[var(--color-iot-text-primary)] hover:bg-[#F1F5F9]';

  return (
    <>
      <header className={`flex-shrink-0 h-14 flex items-center justify-between px-6 ${headerBg} border-b ${borderColor} sticky top-0 z-40 shadow-sm transition-colors`}>
        {/* Left: Mobile menu + platform label */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className={`p-1.5 -ml-1 rounded-md ${iconBtn} lg:hidden transition-colors`}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link 
            to={isGov ? '/government' : isOps ? '/operations' : '/iot/devices'} 
            className={`hidden sm:inline text-[13px] font-semibold hover:underline ${platformLabelColor}`}
          >
            {platformLabel}
          </Link>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-2xl px-6 flex justify-center">
          <div
            className="w-full relative group cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchIcon}`} />
            <div className={`w-full border rounded-lg py-2 pl-10 pr-4 flex items-center justify-between text-[13px] transition-all shadow-sm ${searchBg} ${searchText}`}>
              <span>{searchPlaceholder}</span>
              <kbd className={`hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono border rounded shadow-sm ${searchKbd}`}>⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Tools & Profile */}
        <div className="flex items-center gap-3">
          <Link
            to={isGov ? '/government/settings' : isOps ? '/operations/settings' : '/iot/settings'}
            className={`p-2 rounded-full transition-colors focus:outline-none hidden sm:block ${iconBtn}`}
          >
            <Settings className="w-5 h-5" />
          </Link>

          <NotificationCenter />

          <div className={`w-px h-6 mx-1 ${isGov ? 'bg-[var(--color-gov-border)]' : isOps ? 'bg-[var(--color-ops-border)]' : 'bg-[var(--color-iot-border)]'}`}></div>

          <div className="relative group">
            <button className={`flex items-center gap-2 p-1 pl-2 rounded-full transition-colors focus:outline-none ${isGov ? 'hover:bg-[var(--color-gov-surface)]' : isOps ? 'hover:bg-[var(--color-ops-surface)]' : 'hover:bg-[#F1F5F9]'}`}>
              {isGov ? (
                <GovHeaderProfile />
              ) : (
                <>
                  <span className={`text-[13px] font-medium hidden sm:block ${isOps ? 'text-[var(--color-ops-text-primary)]' : 'text-[var(--color-iot-text-primary)]'}`}>Jane Doe</span>
                  <div className={`w-8 h-8 bg-gradient-to-br from-[var(--color-iot-brand)] to-[#22C55E] rounded-full flex items-center justify-center text-white shadow-sm border border-white`}>
                    <span className="text-[11px] font-bold">JD</span>
                  </div>
                </>
              )}
            </button>

            <div className={`absolute right-0 top-full mt-1 w-48 border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50 ${profileBorder}`}>
              <Link to={isGov ? '/government/settings' : isOps ? '/operations/settings' : '/iot/settings?tab=access'} className={`block px-4 py-2 text-[13px] transition-colors ${profileText}`}>
                Profile
              </Link>
              <Link to="/login" className={`block px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors border-t mt-1 pt-2 ${isGov ? 'border-[var(--color-gov-border)]' : isOps ? 'border-[var(--color-ops-border)]' : 'border-[#E2E8F0]'}`}>
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
