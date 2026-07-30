import { useState } from 'react';
import { Settings, Bell, Network, Clock, LayoutDashboard, Calendar, Map, Check } from 'lucide-react';
import { AlertThresholds } from './components/AlertThresholds';

type SettingsSection = 
  | 'alert_thresholds' 
  | 'notification_routing' 
  | 'shift_preferences' 
  | 'dashboard_defaults' 
  | 'report_scheduling' 
  | 'layer_defaults';

export function SettingsWorkspace() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('alert_thresholds');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const navItems = [
    { id: 'alert_thresholds', label: 'Alert Thresholds', icon: Bell },
    { id: 'notification_routing', label: 'Notification Routing', icon: Network },
    { id: 'shift_preferences', label: 'Shift Preferences', icon: Clock },
    { id: 'dashboard_defaults', label: 'Dashboard Defaults', icon: LayoutDashboard },
    { id: 'report_scheduling', label: 'Report Scheduling', icon: Calendar },
    { id: 'layer_defaults', label: 'Layer Defaults', icon: Map },
  ] as const;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden animate-in fade-in duration-500 bg-white dark:bg-black">
      
      {/* Sidebar Navigation */}
      <div className="w-[280px] shrink-0 border-r border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-[#38383A]">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-ops-brand)]/20 flex items-center justify-center border border-[var(--color-ops-brand)]/30 mb-4">
            <Settings className="w-5 h-5 text-[var(--color-ops-brand)]" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Operations</h1>
          <p className="text-sm text-slate-500 mt-1">Platform Settings</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 dark:bg-[#25262B] text-[var(--color-ops-brand)]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1C1C1E] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1C1C1E]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-[#38383A] flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {navItems.find(n => n.id === activeSection)?.label}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure operational parameters and automated system behaviors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Reset to Default
            </button>
            <button 
              onClick={handleSave}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
                isSaved 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'bg-[var(--color-ops-brand)] text-white hover:bg-[var(--color-ops-brand-hover)]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
          <div className="max-w-4xl">
            {activeSection === 'alert_thresholds' ? (
              <AlertThresholds />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-[#38383A] rounded-2xl bg-slate-50 dark:bg-[#121214]">
                <Settings className="w-12 h-12 text-slate-300 dark:text-[#38383A] mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Section Under Construction</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">
                  This configuration panel is part of the placeholder scaffolding for the structural review.
                </p>
              </div>
            )}
          </div>
        </div>
        
      </div>

    </div>
  );
}
