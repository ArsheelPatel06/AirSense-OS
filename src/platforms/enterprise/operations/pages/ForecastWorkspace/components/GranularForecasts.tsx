import React from 'react';
import { pollutantForecasts, weatherForecast } from '../mockData';
import { TrendingUp, TrendingDown, Minus, CloudRain, Wind, Thermometer, Droplets, Eye, Activity } from 'lucide-react';

export function GranularForecasts() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-[var(--color-ops-critical)]" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-[var(--color-ops-success)]" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-[var(--color-ops-critical)]';
      case 'down': return 'text-[var(--color-ops-success)]';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pollutant Forecast */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Predicted Pollutant Changes</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Expected changes over the next 24h</p>
        
        <div className="space-y-4 flex-1">
          {pollutantForecasts.map((pollutant) => (
            <div key={pollutant.id} className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{pollutant.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {pollutant.peak !== 'N/A' ? `Peak: ${pollutant.peak}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Current: {pollutant.current}</span>
                {getTrendIcon(pollutant.trend)}
                <span className={`font-bold ${getTrendColor(pollutant.trend)}`}>Forecast: {pollutant.forecast}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Forecast Weather Conditions</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Conditions impacting dispersion</p>
        
        <div className="grid grid-cols-2 gap-4 flex-1">
          {Object.entries(weatherForecast).map(([key, data]) => {
            let Icon = Thermometer;
            if (key === 'wind') Icon = Wind;
            if (key === 'humidity') Icon = Droplets;
            if (key === 'rain') Icon = CloudRain;

            return (
              <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/50 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                  <Icon className={`w-4 h-4 ${key === 'rain' ? 'text-[var(--color-ops-brand)]' : ''}`} />
                  <span className="text-xs font-medium uppercase tracking-wider">{data.name}</span>
                </div>
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-slate-500 line-through decoration-slate-400">{data.current}</span>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">{data.expected}</span>
                </div>
                <span className="text-xs font-medium text-[var(--color-ops-warning)] mt-auto pt-2 border-t border-slate-200 dark:border-slate-700">
                  Risk: {data.risk}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pollution Dispersion visual */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Pollution Dispersion</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Plume movement prediction</p>
        </div>
        
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
          {[
            { label: 'Current', classes: 'translate-x-0 translate-y-0 scale-100', color: 'bg-yellow-500' },
            { label: '2h', classes: 'translate-x-2 -translate-y-1 scale-110', color: 'bg-orange-500' },
            { label: '4h', classes: 'translate-x-4 -translate-y-3 scale-125', color: 'bg-red-500' },
            { label: '8h', classes: 'translate-x-8 -translate-y-4 scale-150', color: 'bg-red-600', opacity: 'opacity-40' }
          ].map((frame, i) => (
            <div key={i} className="rounded-lg bg-slate-100 dark:bg-[#0E0F12] border border-slate-200 dark:border-[#2C2E33] relative overflow-hidden flex items-center justify-center min-h-[100px]">
              <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              <div className={`absolute w-12 h-12 rounded-full mix-blend-multiply dark:mix-blend-screen blur-xl ${frame.color} ${frame.classes} ${frame.opacity || 'opacity-30'}`}></div>
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-white/80 dark:bg-black/60 text-[10px] font-bold rounded shadow-sm text-slate-700 dark:text-slate-300">
                {frame.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
