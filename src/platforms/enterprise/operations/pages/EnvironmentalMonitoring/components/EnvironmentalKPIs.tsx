import React from 'react';
import { Activity, Wind, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

export function EnvironmentalKPIs() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Highest AQI</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">145</div>
            <div className="text-xs text-red-500 font-medium mt-1">Industrial Zone</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lowest AQI</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">42</div>
            <div className="text-xs text-emerald-500 font-medium mt-1">Residential Zone</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">City Average</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">78</div>
            <div className="text-xs text-blue-500 font-medium mt-1">Moderate</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
            <Wind className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Worst Pollutant</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">PM10</div>
            <div className="text-xs text-amber-500 font-medium mt-1">128% over limit</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cleanest Zone</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">North</div>
            <div className="text-xs text-indigo-500 font-medium mt-1">AQI 45</div>
          </div>
        </div>
      </div>

    </div>
  );
}
