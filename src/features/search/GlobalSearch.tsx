import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Cpu, AlertTriangle, HardDrive, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getResults = () => {
    const q = query.toLowerCase();
    if (!q) return [];
    
    const results = [];
    
    if ('an-1004'.includes(q) || 'device'.includes(q)) {
      results.push({ category: 'Devices', title: 'AirNode-1004 (AN-1004)', icon: Cpu, desc: 'North Campus • Healthy', path: '/iot/devices/AN-1004' });
      results.push({ category: 'Actions', title: 'Restart AN-1004', icon: Activity, desc: 'Send reboot command', path: '/iot/devices/AN-1004/diagnostics' });
      results.push({ category: 'Actions', title: 'Update Firmware for AN-1004', icon: HardDrive, desc: 'Update to v2.4.1', path: '/iot/devices/AN-1004/firmware' });
    }
    
    if ('north campus'.includes(q) || 'fleet'.includes(q)) {
      results.push({ category: 'Fleets', title: 'North Campus', icon: MapPin, desc: '148 Devices • US-East', path: '/iot/fleets/FLT-NC-9021' });
      results.push({ category: 'Fleets', title: 'Downtown Hub', icon: MapPin, desc: '42 Devices • US-East', path: '/iot/fleets/FLT-DT-1022' });
    }
    
    if ('inc-9821'.includes(q) || 'offline'.includes(q) || 'incident'.includes(q) || 'critical'.includes(q)) {
      results.push({ category: 'Incidents', title: 'INC-9821: Multiple Nodes Offline', icon: AlertTriangle, desc: 'Critical • North Campus', path: '/iot/alerts/INC-9821' });
      results.push({ category: 'Filters', title: 'View Offline Devices', icon: Search, desc: 'Filter Device List', path: '/iot/devices?status=offline' });
    }
    
    if ('firmware'.includes(q)) {
      results.push({ category: 'Pages', title: 'Firmware Updates', icon: HardDrive, desc: 'Global Settings', path: '/iot/settings?tab=firmware' });
    }
    
    return results;
  };

  const results = getResults();

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-[var(--color-ops-card)] rounded-xl shadow-2xl border border-[var(--color-ops-border)] overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-top-4 fade-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--color-ops-border)] flex items-center gap-3 bg-[var(--color-ops-surface)]">
          <Search className="w-5 h-5 text-[var(--color-ops-text-muted)]" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, zones, alerts, resources..."
            className="flex-1 bg-transparent border-none text-[16px] text-[var(--color-ops-text-primary)] focus:outline-none placeholder:text-[var(--color-ops-text-muted)]"
          />
          <div className="flex gap-1">
            <kbd className="px-2 py-1 text-[10px] font-mono text-[var(--color-ops-text-secondary)] bg-[var(--color-ops-surface)] rounded border border-[var(--color-ops-border)]">esc</kbd>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin bg-[var(--color-ops-card)]">
          {query.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-ops-text-muted)]">
              <p className="text-[13px] font-medium">Type to start searching...</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-2 py-1 bg-[var(--color-ops-surface)] border border-[var(--color-ops-border)] rounded text-[11px] cursor-pointer hover:border-[var(--color-ops-brand)] hover:text-[var(--color-ops-brand)] text-[var(--color-ops-text-secondary)] transition-colors" onClick={() => setQuery('AN-1004')}>AN-1004</span>
                <span className="px-2 py-1 bg-[var(--color-ops-surface)] border border-[var(--color-ops-border)] rounded text-[11px] cursor-pointer hover:border-[var(--color-ops-brand)] hover:text-[var(--color-ops-brand)] text-[var(--color-ops-text-secondary)] transition-colors" onClick={() => setQuery('offline')}>offline</span>
                <span className="px-2 py-1 bg-[var(--color-ops-surface)] border border-[var(--color-ops-border)] rounded text-[11px] cursor-pointer hover:border-[var(--color-ops-brand)] hover:text-[var(--color-ops-brand)] text-[var(--color-ops-text-secondary)] transition-colors" onClick={() => setQuery('North Campus')}>North Campus</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-ops-text-secondary)]">
              <p className="text-[14px]">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1 pb-2">
              {results.map((result, i) => {
                const showCategory = i === 0 || results[i - 1].category !== result.category;
                return (
                  <div key={i}>
                    {showCategory && (
                      <div className="px-3 py-2 text-[10px] font-bold text-[var(--color-ops-text-disabled)] uppercase tracking-wider mt-2">
                        {result.category}
                      </div>
                    )}
                    <button 
                      onClick={() => handleSelect(result.path)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-ops-surface)] group transition-colors focus:bg-[var(--color-ops-surface)] focus:outline-none"
                    >
                      <div className="p-1.5 rounded bg-[var(--color-ops-surface)] border border-[var(--color-ops-border)] shadow-sm group-hover:border-[var(--color-ops-brand)] group-focus:border-[var(--color-ops-brand)] transition-colors">
                        <result.icon className="w-4 h-4 text-[var(--color-ops-text-secondary)] group-hover:text-[var(--color-ops-brand)] group-focus:text-[var(--color-ops-brand)] transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-[var(--color-ops-text-primary)]">{result.title}</p>
                        <p className="text-[11px] text-[var(--color-ops-text-secondary)]">{result.desc}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                        <span className="text-[11px] text-[var(--color-ops-brand)] font-medium bg-[var(--color-ops-brand)]/10 px-2 py-1 rounded">Jump</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
