import React, { useState } from 'react';
import { X, Search, ShieldAlert, Clock, CheckCircle2, ChevronRight, Navigation } from 'lucide-react';
import type { OperationsResource } from '../mockData';
import { INCIDENT_SUMMARIES } from '../mockData';

interface DispatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: OperationsResource;
}

export function DispatchDrawer({ isOpen, onClose, resource }: DispatchDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10';
      case 'High': return 'text-orange-500 bg-orange-500/10';
      case 'Medium': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  const filteredIncidents = INCIDENT_SUMMARIES.filter(inc => {
    if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-[450px] h-full bg-white dark:bg-[#1C1C1E] shadow-2xl flex flex-col border-l border-slate-200 dark:border-[#38383A] transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-[#38383A] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-ops-brand)]/10 flex items-center justify-center border border-[var(--color-ops-brand)]/20">
              <Navigation className="w-5 h-5 text-[var(--color-ops-brand)]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Dispatch Resource</h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{resource.name} • {resource.type}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2C2E33] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Target Incident</h3>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search open incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0E0F12] border border-slate-200 dark:border-[#38383A] rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-ops-brand)] focus:ring-1 focus:ring-[var(--color-ops-brand)] transition-all"
            />
          </div>

          {/* Incident List */}
          <div className="flex flex-col gap-3">
            {filteredIncidents.map(inc => (
              <div 
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${
                  selectedIncidentId === inc.id
                    ? 'border-[var(--color-ops-brand)] bg-[var(--color-ops-brand)]/5 ring-1 ring-[var(--color-ops-brand)]'
                    : 'border-slate-200 dark:border-[#38383A] hover:border-slate-300 dark:hover:border-[#505055] bg-white dark:bg-[#121214]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{inc.title}</span>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span className="font-mono text-slate-500">{inc.id}</span>
                      <span>•</span>
                      <span>{inc.location}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(inc.priority)}`}>
                    {inc.priority}
                  </span>
                </div>
                
                {selectedIncidentId === inc.id && (
                  <div className="pt-3 mt-1 border-t border-slate-200 dark:border-[#2C2E33] flex justify-between items-center animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-[var(--color-ops-brand)]" />
                      Estimated ETA: <span className="text-slate-900 dark:text-white">12 mins</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] shrink-0 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedIncidentId}
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
              selectedIncidentId 
                ? 'bg-[var(--color-ops-brand)] hover:bg-[var(--color-ops-brand-hover)] text-white'
                : 'bg-slate-200 dark:bg-[#38383A] text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Confirm Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}
