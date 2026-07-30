import React from 'react';
import { ShieldCheck, ServerCrash, Activity, AlertTriangle } from 'lucide-react';

export function EnvironmentalDataQuality() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Data Quality</h2>
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col p-3 bg-slate-50 dark:bg-[#25262B] rounded-lg border border-slate-100 dark:border-[#38383A]">
           <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
             <Activity className="w-3.5 h-3.5" />
             <span className="text-xs font-bold uppercase">City Coverage</span>
           </div>
           <span className="text-xl font-bold text-slate-900 dark:text-white">98.2%</span>
        </div>
        <div className="flex flex-col p-3 bg-slate-50 dark:bg-[#25262B] rounded-lg border border-slate-100 dark:border-[#38383A]">
           <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
             <ServerCrash className="w-3.5 h-3.5" />
             <span className="text-xs font-bold uppercase">Missing Regions</span>
           </div>
           <span className="text-xl font-bold text-slate-900 dark:text-white">0</span>
        </div>
        <div className="flex flex-col p-3 bg-slate-50 dark:bg-[#25262B] rounded-lg border border-slate-100 dark:border-[#38383A]">
           <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
             <ShieldCheck className="w-3.5 h-3.5" />
             <span className="text-xs font-bold uppercase">Calibration</span>
           </div>
           <span className="text-xl font-bold text-slate-900 dark:text-white text-emerald-500">High</span>
        </div>
        <div className="flex flex-col p-3 bg-slate-50 dark:bg-[#25262B] rounded-lg border border-slate-100 dark:border-[#38383A]">
           <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
             <AlertTriangle className="w-3.5 h-3.5" />
             <span className="text-xs font-bold uppercase">Interpolation</span>
           </div>
           <span className="text-xl font-bold text-slate-900 dark:text-white text-amber-500">1.8%</span>
        </div>
      </div>
    </div>
  );
}
