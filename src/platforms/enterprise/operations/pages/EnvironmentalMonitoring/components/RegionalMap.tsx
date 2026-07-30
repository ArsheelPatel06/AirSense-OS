import React from 'react';
import { Map } from 'lucide-react';

export function RegionalMap() {
  const districts = [
    { name: 'Industrial', score: 9, color: 'bg-red-500' },
    { name: 'South', score: 7, color: 'bg-red-400' },
    { name: 'East', score: 6, color: 'bg-amber-500' },
    { name: 'CBD', score: 5, color: 'bg-amber-400' },
    { name: 'Airport', score: 4, color: 'bg-amber-400' },
    { name: 'West', score: 3, color: 'bg-emerald-400' },
    { name: 'North', score: 2, color: 'bg-emerald-500' },
    { name: 'Residential', score: 1, color: 'bg-emerald-500' },
  ];

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">District Hotspot Ranking</h2>
        <Map className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-3">
        {districts.map(d => (
          <div key={d.name} className="flex items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 w-24">{d.name}</span>
            <div className="flex gap-0.5 flex-1">
               {Array.from({length: 12}).map((_, i) => (
                 <div key={i} className={`h-4 flex-1 rounded-sm ${i < d.score ? d.color : 'bg-slate-100 dark:bg-[#25262B]'}`}></div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
