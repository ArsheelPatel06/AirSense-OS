import React from 'react';
import { MOCK_REGIONS } from '../mockData';

export function RegionalComparison() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Regional Comparison</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 uppercase">
              <th className="pb-3 pl-2">Region</th>
              <th className="pb-3 px-2">AQI</th>
              <th className="pb-3 px-2">PM2.5</th>
              <th className="pb-3 px-2">NO₂</th>
              <th className="pb-3 pr-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {MOCK_REGIONS.map((region, idx) => (
              <tr key={region.name} className={`border-b border-slate-100 dark:border-[#25262B] ${idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-[#1C1C1E]' : ''}`}>
                <td className="py-2.5 pl-2 text-slate-900 dark:text-white">{region.name}</td>
                <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">{region.aqi}</td>
                <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">{region.pm25}</td>
                <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">{region.no2}</td>
                <td className="py-2.5 pr-2 text-right">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    region.status === 'Good' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                    region.status === 'Moderate' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                    'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {region.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
