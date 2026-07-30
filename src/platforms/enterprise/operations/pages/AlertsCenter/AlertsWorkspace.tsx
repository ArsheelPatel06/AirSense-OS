import { useState, useMemo } from 'react';
import { AlertQueue } from './components/AlertQueue';
import { AlertDetail } from './components/AlertDetail';
import type { AlertCategory, AlertSource } from './mockData';
import { Bell } from 'lucide-react';
import { useOpsStore } from '../../context/OpsContext';

export function AlertsWorkspace() {
  const { state } = useOpsStore();
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory>('Active');
  const [selectedSource, setSelectedSource] = useState<AlertSource | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAlerts = useMemo(() => {
    return state.alerts.filter(alert => {
      const matchesCategory = alert.category === selectedCategory;
      const matchesSource = selectedSource === 'All' || alert.source === selectedSource;
      const matchesSearch = 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesCategory && matchesSource && matchesSearch;
    });
  }, [state.alerts, selectedCategory, selectedSource, searchQuery]);

  // Try to default to the first alert in the list if none is selected
  const [selectedId, setSelectedId] = useState<string | null>(
    filteredAlerts.length > 0 ? filteredAlerts[0].id : null
  );

  // When filters change, auto-select the top result if current selection is filtered out
  useMemo(() => {
    if (filteredAlerts.length > 0 && !filteredAlerts.find(a => a.id === selectedId)) {
      setSelectedId(filteredAlerts[0].id);
    } else if (filteredAlerts.length === 0) {
      setSelectedId(null);
    }
  }, [filteredAlerts, selectedId]);

  const selectedAlert = useMemo(() => {
    return filteredAlerts.find(a => a.id === selectedId) || null;
  }, [filteredAlerts, selectedId]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden animate-in fade-in duration-500 bg-white dark:bg-black">
      
      {/* Header */}
      <div className="shrink-0 bg-slate-900 dark:bg-black border-b border-slate-800 dark:border-[#2C2E33] px-6 py-2.5 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[var(--color-ops-brand)]/20 flex items-center justify-center border border-[var(--color-ops-brand)]/30">
            <Bell className="w-4 h-4 text-[var(--color-ops-brand)]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-sm font-bold leading-none mb-0.5">System Alerts</h1>
            <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest">Notification Center</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col border-l border-slate-700 dark:border-[#38383A] pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              Unread
            </span>
            <span className="text-[var(--color-ops-brand)] text-sm font-bold leading-tight">12</span>
          </div>
          <div className="flex flex-col border-l border-slate-700 dark:border-[#38383A] pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              Critical
            </span>
            <span className="text-red-500 text-sm font-bold leading-tight">2</span>
          </div>
        </div>
      </div>

      {/* Main Two-Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        <AlertQueue 
          alerts={filteredAlerts}
          selectedId={selectedId}
          onSelect={setSelectedId}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <AlertDetail alert={selectedAlert} />

      </div>
    </div>
  );
}
