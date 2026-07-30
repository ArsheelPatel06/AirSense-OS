import React from 'react';
import type { IncidentTimelineEvent } from '../mockData';
import { Radio, ShieldAlert, Navigation, Truck, Users, Activity, CheckCircle, Search, Clock } from 'lucide-react';

export function IncidentTimeline({ timeline }: { timeline: IncidentTimelineEvent[] }) {
  
  const getIconForAction = (status: string, action: string) => {
    const s = status.toLowerCase();
    const a = action.toLowerCase();
    
    if (s === 'detected' || a.includes('sensor')) return <Radio className="w-4 h-4 text-orange-500" />;
    if (s === 'verified' || a.includes('complaint')) return <ShieldAlert className="w-4 h-4 text-[var(--color-ops-brand)]" />;
    if (s === 'assigned' || a.includes('dispatcher')) return <Navigation className="w-4 h-4 text-blue-500" />;
    if (s === 'dispatched' || a.includes('departed')) return <Truck className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    if (s === 'on site' || a.includes('team')) return <Users className="w-4 h-4 text-indigo-500" />;
    if (s === 'mitigation') return <Activity className="w-4 h-4 text-green-500" />;
    if (s === 'monitoring' || a.includes('inspection')) return <Search className="w-4 h-4 text-teal-500" />;
    if (s === 'resolved') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    
    return <Radio className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C1C1E]">
      <div className="px-6 py-3 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Response Activity Feed</h3>
      </div>
      
      <div className="flex-1 overflow-x-auto bg-white dark:bg-[#1C1C1E] flex items-center px-6 min-h-[140px] scrollbar-thin">
        <div className="flex items-center">
          {timeline.map((event, idx) => (
            <div key={idx} className="flex items-center">
              {/* Event Node */}
              <div className="flex flex-col items-center gap-2 min-w-[120px] group">
                <span className="text-[10px] font-mono font-bold text-slate-500">{event.time}</span>
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#2C2E33] flex items-center justify-center shadow-sm group-hover:border-[var(--color-ops-brand)] transition-colors">
                  {getIconForAction(event.status, event.action)}
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-[var(--color-ops-brand)] uppercase tracking-wider mb-0.5">{event.status}</span>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] truncate" title={event.action}>{event.action}</span>
                </div>
              </div>

              {/* Connecting Line */}
              {idx < timeline.length - 1 && (
                <div className="w-12 h-px bg-slate-200 dark:bg-[#38383A] mx-2 shrink-0 self-center mb-6"></div>
              )}
            </div>
          ))}
          
          {/* Active pulse indicating ongoing */}
          {timeline.length > 0 && timeline[timeline.length - 1].status !== 'Resolved' && timeline[timeline.length - 1].status !== 'Closed' && (
            <React.Fragment>
              <div className="mx-6 text-slate-300 dark:text-slate-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              <div className="flex flex-col gap-2 min-w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-ops-brand)] animate-pulse"></div>
                  <span className="text-xs font-semibold text-slate-400">In Progress</span>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
