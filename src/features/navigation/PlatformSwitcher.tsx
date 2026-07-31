import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Cpu, LayoutDashboard, Layers, ShieldAlert, Building2, Check } from 'lucide-react';

interface PlatformOption {
  id: string;
  name: string;
  subtitle: string;
  path: string;
  icon: any;
  platform: 'iot' | 'ops' | 'gov';
}

const OPTIONS: PlatformOption[] = [
  {
    id: 'iot-devices',
    name: 'Device List',
    subtitle: 'Manage 14,248 sensors & nodes',
    path: '/iot/devices',
    icon: Cpu,
    platform: 'iot',
  },
  {
    id: 'iot-fleets',
    name: 'Fleet Overview',
    subtitle: 'Real-time telemetry & fleet health',
    path: '/iot/fleets',
    icon: LayoutDashboard,
    platform: 'iot',
  },
  {
    id: 'iot-compare',
    name: 'Fleet Comparison',
    subtitle: 'Cross-fleet benchmarks',
    path: '/iot/fleets/compare',
    icon: Layers,
    platform: 'iot',
  },
  {
    id: 'ops-center',
    name: 'Operations Center',
    subtitle: 'Ahmedabad City • Mission Control',
    path: '/operations',
    icon: ShieldAlert,
    platform: 'ops',
  },
  {
    id: 'gov-center',
    name: 'Government Center',
    subtitle: 'Ahmedabad City • Executive',
    path: '/government',
    icon: Building2,
    platform: 'gov',
  },
];

export function PlatformSwitcher({ isOps = false, isGov = false }: { isOps?: boolean; isGov?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const currentTitle = isGov ? 'Government Center' : isOps ? 'Operations Center' : 'IoT Fleet Operations';
  const currentSubtitle = isGov ? 'Ahmedabad City • Executive' : isOps ? 'Ahmedabad City • Mission Control' : 'North Campus • 14,248 Devices';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all border -mx-2 select-none ${
          isGov || isOps 
            ? 'hover:bg-[#1A2744]/70 border-[#1A2744] text-white' 
            : 'hover:bg-[#F1F5F9] border-transparent hover:border-[#E2E8F0]'
        }`}
      >
        <div className="flex flex-col w-full min-w-0">
          <div className="flex items-center justify-between w-full">
            <span className={`font-semibold text-sm tracking-tight truncate ${
              isGov || isOps ? 'text-white' : 'text-[var(--color-iot-text-primary)]'
            }`}>
              {currentTitle}
            </span>
            <ChevronDown className={`w-4 h-4 ml-1 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            } ${isGov || isOps ? 'text-slate-400' : 'text-[var(--color-iot-text-muted)]'}`} />
          </div>
          <span className={`text-[11px] font-medium leading-none mt-1 truncate ${
            isGov || isOps ? 'text-slate-400' : 'text-[var(--color-iot-text-secondary)]'
          }`}>
            {currentSubtitle}
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            Select View / Platform
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isCurrent = 
                (opt.platform === 'gov' && isGov) ||
                (opt.platform === 'ops' && isOps) ||
                (opt.platform === 'iot' && !isGov && !isOps && window.location.pathname.startsWith(opt.path));

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.path)}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition-colors group ${
                    isCurrent ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <div className={`p-1.5 rounded-md mt-0.5 shrink-0 ${
                    opt.platform === 'iot' ? 'bg-emerald-50 text-emerald-600' :
                    opt.platform === 'ops' ? 'bg-cyan-50 text-cyan-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {opt.name}
                      </span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {opt.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
