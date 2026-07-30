import React from 'react';
import { forecastSummaryData } from '../mockData';
import { ShieldAlert, Clock, BarChart3, AlertTriangle, Target } from 'lucide-react';

export function PredictionSummary() {
  const { predictedAqi, aqiDelta, status, confidence, forecastWindow, highestRiskZone, peakTime, timeToPeak } = forecastSummaryData;

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Good': return 'text-[var(--color-ops-success)] bg-[var(--color-ops-success)]/10';
      case 'Moderate': return 'text-[var(--color-ops-warning)] bg-[var(--color-ops-warning)]/10';
      case 'Poor': return 'text-[var(--color-ops-critical)] bg-[var(--color-ops-critical)]/10';
      default: return 'text-slate-500 bg-slate-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Predicted AQI */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Predicted Peak AQI</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{predictedAqi}</span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getStatusColor(status)} mb-1`}>{status}</span>
          </div>
          <span className="text-xs font-medium text-[var(--color-ops-critical)] mt-2">{aqiDelta}</span>
        </div>
      </div>

      {/* Confidence */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <Target className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">AI Confidence</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{confidence}%</span>
          <span className="text-sm font-medium text-[var(--color-ops-success)] mb-1">High</span>
        </div>
      </div>

      {/* Forecast Window */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Forecast Window</span>
        </div>
        <div>
          <span className="text-xl font-semibold text-slate-900 dark:text-white">{forecastWindow}</span>
        </div>
      </div>

      {/* Highest Risk */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <ShieldAlert className="w-4 h-4 text-[var(--color-ops-critical)]" />
          <span className="text-xs font-semibold uppercase tracking-wider">Highest Risk</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-slate-900 dark:text-white">{highestRiskZone}</span>
          <button className="text-xs font-medium text-[var(--color-ops-brand)] hover:text-[var(--color-ops-brand-hover)] text-left mt-2 flex items-center transition-colors">
            Open on Map &rarr;
          </button>
        </div>
      </div>

      {/* Peak Time */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <AlertTriangle className="w-4 h-4 text-[var(--color-ops-warning)]" />
          <span className="text-xs font-semibold uppercase tracking-wider">Expected Peak</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-slate-900 dark:text-white">{peakTime}</span>
          <span className="text-xs font-medium text-[var(--color-ops-warning)] mt-2">{timeToPeak}</span>
        </div>
      </div>
    </div>
  );
}
