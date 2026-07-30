import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MOCK_SOURCES } from '../mockData';

export function PollutionSources() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pollution Sources</h2>
      </div>

      <div className="space-y-4">
        {MOCK_SOURCES.map((source, idx) => {
          const blocks = Math.round((source.value / 50) * 12); // scaled out of 12 blocks
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">{source.name}</span>
                <span className="text-slate-500">{source.value}%</span>
              </div>
              <div className="flex gap-0.5 w-full">
                {Array.from({length: 12}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-3 flex-1 rounded-sm ${i < blocks ? '' : 'bg-slate-100 dark:bg-[#25262B]'}`} 
                    style={i < blocks ? { backgroundColor: source.fill } : undefined}
                  ></div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
