import React from 'react';
import { History } from 'lucide-react';

export function HistoricalComparison() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
        <History className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider">Historical Comparison</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-500">Today vs Yesterday</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-red-500">+12%</span>
            <span className="text-xs text-slate-400">AQI</span>
          </div>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-[#25262B] h-1.5 rounded-full overflow-hidden">
          <div className="bg-red-500 h-full w-[60%]"></div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-semibold text-slate-500">Today vs Last Week</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-500">-5%</span>
            <span className="text-xs text-slate-400">AQI</span>
          </div>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-[#25262B] h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[45%]"></div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-semibold text-slate-500">Same Day Last Month</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-500">0%</span>
            <span className="text-xs text-slate-400">AQI</span>
          </div>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-[#25262B] h-1.5 rounded-full overflow-hidden">
          <div className="bg-slate-400 h-full w-[50%]"></div>
        </div>
      </div>
    </div>
  );
}
