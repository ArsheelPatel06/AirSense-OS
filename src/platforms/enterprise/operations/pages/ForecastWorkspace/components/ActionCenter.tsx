import React from 'react';
import { riskZones } from '../mockData';
import { Map, AlertTriangle, Shield, CheckCircle, Navigation, RadioReceiver } from 'lucide-react';

export function ActionCenter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Zone Forecast */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <Map className="w-5 h-5 text-slate-500" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Risk Zone Forecast</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Predicted district impact</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {riskZones.map((zone, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center text-center bg-slate-50 dark:bg-[#2C2E33]/30">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{zone.name}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">AQI {zone.aqi}</span>
                <span className="text-xs font-bold flex items-center" style={{ color: zone.color }}>
                  {zone.trend === 'up' ? '↑' : '↓'} {zone.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col bg-gradient-to-br from-white to-blue-50/50 dark:from-[#1C1C1E] dark:to-[var(--color-ops-brand-surface)] border-[var(--color-ops-brand)]/20">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-[var(--color-ops-brand)]" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Recommended Actions</h3>
            <p className="text-sm text-[var(--color-ops-brand)] font-medium">Proactive response based on forecast</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <button className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-[#1C1C1E] border border-[var(--color-ops-brand)]/30 hover:border-[var(--color-ops-brand)] hover:shadow-md transition-all text-left group">
            <div className="w-8 h-8 rounded-full bg-[var(--color-ops-brand)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-ops-brand)]/20 transition-colors">
              <AlertTriangle className="w-4 h-4 text-[var(--color-ops-critical)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-[var(--color-ops-critical)] mb-0.5">HIGH</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Issue Public Advisory</span>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-[#1C1C1E] border border-[var(--color-ops-brand)]/30 hover:border-[var(--color-ops-brand)] hover:shadow-md transition-all text-left group">
            <div className="w-8 h-8 rounded-full bg-[var(--color-ops-brand)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-ops-brand)]/20 transition-colors">
              <RadioReceiver className="w-4 h-4 text-[var(--color-ops-warning)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-[var(--color-ops-warning)] mb-0.5">MEDIUM</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Deploy Mobile Sensor</span>
            </div>
          </button>

          <button className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-[#1C1C1E] border border-[var(--color-ops-brand)]/30 hover:border-[var(--color-ops-brand)] hover:shadow-md transition-all text-left group">
            <div className="w-8 h-8 rounded-full bg-[var(--color-ops-brand)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-ops-brand)]/20 transition-colors">
              <Navigation className="w-4 h-4 text-[var(--color-ops-warning)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-[var(--color-ops-warning)] mb-0.5">MEDIUM</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Reroute Heavy Traffic</span>
            </div>
          </button>

          <button className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-[#1C1C1E] border border-[var(--color-ops-brand)]/30 hover:border-[var(--color-ops-brand)] hover:shadow-md transition-all text-left group">
            <div className="w-8 h-8 rounded-full bg-[var(--color-ops-brand)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-ops-brand)]/20 transition-colors">
              <CheckCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">LOW</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Inspect Industrial Zone</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
