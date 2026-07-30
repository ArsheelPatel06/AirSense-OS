import React from 'react';
import { MOCK_VIOLATIONS } from '../mockData';

export function ThresholdViolations() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Threshold Violations</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#2C2E33] text-xs font-semibold text-slate-500 uppercase">
              <th className="pb-3 pl-2">Location</th>
              <th className="pb-3 px-2">Pollutant</th>
              <th className="pb-3 px-2">Value</th>
              <th className="pb-3 px-2">Limit</th>
              <th className="pb-3 px-2">Duration</th>
              <th className="pb-3 px-2">Affected Pop.</th>
              <th className="pb-3 px-2">Recommended Action</th>
              <th className="pb-3 px-2">Authority</th>
              <th className="pb-3 pr-2 text-right">Severity</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {MOCK_VIOLATIONS.map((violation, idx) => (
              <tr key={violation.id} className={`border-b border-slate-100 dark:border-[#25262B] ${idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-[#1C1C1E]' : ''}`}>
                <td className="py-3 pl-2 text-slate-900 dark:text-white">{violation.location}</td>
                <td className="py-3 px-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#25262B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#38383A]">
                    {violation.pollutant}
                  </span>
                </td>
                <td className="py-3 px-2 text-red-500">{violation.value}</td>
                <td className="py-3 px-2 text-slate-500">{violation.limit}</td>
                <td className="py-3 px-2 text-slate-700 dark:text-slate-300">{violation.duration}</td>
                <td className="py-3 px-2 text-slate-700 dark:text-slate-300 font-semibold">{violation.population}</td>
                <td className="py-3 px-2 text-slate-700 dark:text-slate-300 text-xs">{violation.action}</td>
                <td className="py-3 px-2 text-slate-500 text-xs font-mono">{violation.authority}</td>
                <td className="py-3 pr-2 text-right">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    violation.severity === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                    'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                  }`}>
                    {violation.severity}
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
