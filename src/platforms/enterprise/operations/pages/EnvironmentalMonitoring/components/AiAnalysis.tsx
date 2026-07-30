import React from 'react';
import { Sparkles, ArrowRight, Download, Calendar } from 'lucide-react';

export function AiAnalysis() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-[#1A1E2E] dark:to-[#171923] rounded-xl p-5 border border-indigo-100 dark:border-[#2C3142] shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
        <Sparkles className="w-5 h-5" />
        <h2 className="text-sm font-bold uppercase tracking-wider">AI Environmental Analysis</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          Morning traffic emissions increased PM2.5 concentrations by <span className="text-red-500 font-bold">14%</span>. Low wind speed reduced pollutant dispersion.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          Industrial emissions remain above baseline. Rain is expected within <span className="text-blue-500 font-bold">3 hours</span>. AQI is expected to improve after 18:00.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#1C1C1E] rounded-lg border border-slate-200 dark:border-[#2C2E33] text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#25262B] transition-colors">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span>View Forecast</span>
          </div>
        </button>
        <button className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#1C1C1E] rounded-lg border border-slate-200 dark:border-[#2C2E33] text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#25262B] transition-colors">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Compare Yesterday</span>
          </div>
        </button>
        <button className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#1C1C1E] rounded-lg border border-slate-200 dark:border-[#2C2E33] text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#25262B] transition-colors">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Report</span>
          </div>
        </button>
      </div>
    </div>
  );
}
