import React from 'react';
import { BookOpen } from 'lucide-react';

export function AirQualityStandards() {
  const standards = [
    { name: 'WHO Global Guidelines (2021)', status: 'Exceeded', color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'National Ambient Air Quality', status: 'Compliant', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'EPA Clean Air Act', status: 'Compliant', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
  ];

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Regulatory Standards</h2>
        <BookOpen className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-3">
        {standards.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#25262B] border border-slate-100 dark:border-[#38383A]">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.name}</span>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${s.bg} ${s.color}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
