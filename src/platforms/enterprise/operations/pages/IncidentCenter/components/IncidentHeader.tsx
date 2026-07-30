import React from 'react';
import { Download, Share2, FileText, Plus, AlertTriangle, ArrowDownToLine, ChevronDown } from 'lucide-react';

export function IncidentHeader() {
  return (
    <div className="h-16 shrink-0 bg-white dark:bg-[#1C1C1E] border-b border-slate-200 dark:border-[#38383A] px-6 flex items-center justify-between shadow-sm z-10 relative">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Incident Center</h1>
        <div className="h-5 w-px bg-slate-300 dark:bg-slate-700"></div>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Operational Response Workspace</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 mr-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-ops-brand)] text-white text-sm font-bold hover:bg-[var(--color-ops-brand-hover)] transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Incident
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#38383A] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2C2E33]/50 transition-colors">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Manual Report
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#38383A] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2C2E33]/50 transition-colors">
            <ArrowDownToLine className="w-4 h-4 text-blue-500" />
            Import External
          </button>
        </div>

        <div className="h-5 w-px bg-slate-300 dark:bg-slate-700"></div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
