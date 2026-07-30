import React from 'react';
import { predictionTimeline } from '../mockData';
import { Car, TrendingUp, CloudRain, Wind, AlertCircle } from 'lucide-react';

export function PredictionTimeline() {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'traffic': return <Car className="w-5 h-5 text-slate-500" />;
      case 'aqi_up': return <TrendingUp className="w-5 h-5 text-[var(--color-ops-warning)]" />;
      case 'peak': return <AlertCircle className="w-5 h-5 text-[var(--color-ops-critical)]" />;
      case 'rain': return <CloudRain className="w-5 h-5 text-[var(--color-ops-brand)]" />;
      case 'recovery': return <Wind className="w-5 h-5 text-[var(--color-ops-success)]" />;
      default: return <div className="w-3 h-3 rounded-full bg-slate-400"></div>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Prediction Timeline</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Chronological sequence of predicted events</p>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-[#2C2E33] -translate-y-1/2 hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {predictionTimeline.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <span className="text-sm font-bold text-slate-900 dark:text-white mb-3">{item.time}</span>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] border-2 border-slate-200 dark:border-[#2C2E33] flex items-center justify-center mb-3 shadow-sm">
                {getIcon(item.icon)}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">{item.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
