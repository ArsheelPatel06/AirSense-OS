import React from 'react';
import { MOCK_POLLUTANTS } from '../mockData';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export function PollutantOverview() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pollutant Overview</h2>
        <span className="text-xs text-slate-500 font-medium">Real-time Telemetry</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_POLLUTANTS.map(pollutant => (
          <div key={pollutant.id} className="p-4 rounded-lg bg-slate-50 dark:bg-[#25262B] border border-slate-200 dark:border-[#38383A] group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{pollutant.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                pollutant.status === 'Good' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                pollutant.status === 'Moderate' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
              }`}>
                {pollutant.status}
              </span>
            </div>
            
            <div className="flex items-end gap-2 mb-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{pollutant.value}</span>
              <span className="text-xs font-medium text-slate-500 mb-1">{pollutant.unit}</span>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 mb-3">
              <span>Limit: {pollutant.limit}</span>
              <span className={pollutant.trend.startsWith('+') ? 'text-red-500' : 'text-emerald-500'}>
                {pollutant.trend}
              </span>
            </div>

            {/* Sparkline */}
            <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pollutant.data.map(v => ({ value: v }))}>
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={pollutant.status === 'Good' ? '#10b981' : pollutant.status === 'Moderate' ? '#f59e0b' : '#ef4444'} 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
