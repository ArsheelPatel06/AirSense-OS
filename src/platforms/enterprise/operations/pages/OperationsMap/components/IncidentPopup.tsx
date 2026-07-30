import React from 'react';
import type { Incident } from '../types';
import { X, MapPin, Clock, Users, Activity, CheckCircle, Search, ChevronRight } from 'lucide-react';

interface IncidentPopupProps {
  incident: Incident | null;
  isDrawerOpen: boolean;
  onClose: () => void;
  onActionClick: (actionId: string) => void;
}

export function IncidentPopup({ incident, isDrawerOpen, onClose, onActionClick }: IncidentPopupProps) {
  if (!incident) return null;

  return (
    <div className={`absolute top-0 bottom-16 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-10 flex flex-col pointer-events-auto transition-all duration-300 ease-in-out ${isDrawerOpen ? 'right-[400px]' : 'right-0'} animate-in slide-in-from-right-8 duration-200`}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-[14px] text-slate-900 dark:text-white">Incident Details</h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 space-y-6">
        <div>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border mb-2 inline-block ${
            incident.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
            incident.severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
            'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800'
          }`}>{incident.severity}</span>
          <h4 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">{incident.title}</h4>
          <p className="text-[12px] text-slate-500 font-mono mt-1">{incident.id}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-[12px]">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Zone</span>
            <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{incident.location}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Elapsed</span>
            <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />{incident.duration}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Assigned</span>
            <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" />{incident.assigned}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Status</span>
            <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-slate-400" />{incident.status}</span>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="text-[12px] font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Search className="w-3.5 h-3.5 text-indigo-500" /> Root Cause Analysis</h4>
          <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            {incident.rootCause || 'Investigation pending. Initial telemetry indicates abnormal readings.'}
          </p>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="text-[12px] font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Suggested Actions</h4>
          <div className="space-y-2">
            {incident.actions?.map((action, idx) => (
              <button key={idx} onClick={() => onActionClick('action')} className="w-full text-left px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded hover:border-indigo-500 hover:shadow-sm text-[12px] font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between group">
                {action}
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </button>
            )) || <span className="text-[12px] text-slate-500 italic">No automated actions available.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
