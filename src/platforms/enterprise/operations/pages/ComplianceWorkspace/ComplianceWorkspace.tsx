import { useState } from 'react';
import { FileText, Building2, Globe, ShieldAlert, Download, Search } from 'lucide-react';
import { ViolationsOverview } from './components/ViolationsOverview';
import { GovernmentReporting } from './components/GovernmentReporting';

type ComplianceTab = 
  | 'government' 
  | 'cpcb' 
  | 'epa' 
  | 'violations' 
  | 'exports';

export function ComplianceWorkspace() {
  const [activeTab, setActiveTab] = useState<ComplianceTab>('violations');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'government', label: 'Government Reporting', icon: FileText },
    { id: 'cpcb', label: 'CPCB Compliance', icon: Building2 },
    { id: 'epa', label: 'EPA Standards', icon: Globe },
    { id: 'violations', label: 'Violations', icon: ShieldAlert },
    { id: 'exports', label: 'Historical Exports', icon: Download },
  ] as const;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden animate-in fade-in duration-500 bg-[#F8FAFC] dark:bg-[#121214]">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#1C1C1E] border-b border-slate-200 dark:border-[#38383A] pt-6 px-8 flex flex-col shrink-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Gov & Compliance</h1>
            <p className="text-sm text-slate-500 mt-1">Regulatory reporting, standardization tracking, and violation logs.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)] transition-colors"
              />
            </div>
            <button className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Batch
            </button>
          </div>
        </div>
        
        {/* Horizontal Navigation */}
        <div className="flex items-center gap-8 border-b border-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-bold flex items-center gap-2 relative transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--color-ops-brand)]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ops-brand)] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'violations' ? (
            <ViolationsOverview />
          ) : activeTab === 'government' ? (
            <GovernmentReporting />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-200 dark:border-[#38383A] rounded-2xl bg-white dark:bg-[#1C1C1E]">
              <FileText className="w-16 h-16 text-slate-200 dark:text-[#38383A] mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Regulatory Module Unlicensed</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md text-center leading-relaxed">
                This environment does not currently have the required compliance reporting modules enabled for {tabs.find(t => t.id === activeTab)?.label}.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
