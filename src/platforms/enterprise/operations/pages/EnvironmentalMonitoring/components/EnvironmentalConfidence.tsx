import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

export function EnvironmentalConfidence() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Prediction Confidence</h2>
        <Target className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Sensor Network Confidence</span>
            <span className="text-emerald-500">99.1%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-[#25262B] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.1%' }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Weather Forecast Reliability</span>
            <span className="text-emerald-500">92.4%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-[#25262B] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92.4%' }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Spatial Interpolation</span>
            <span className="text-amber-500">85.0%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-[#25262B] rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Predictive Model Accuracy (24h)</span>
            <span className="text-emerald-500">91.2%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-[#25262B] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '91.2%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
