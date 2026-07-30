import React from 'react';
import { aqiForecastData } from '../mockData';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { useOpsTheme } from '../../../../../../app/layouts/AppShell/AppShell';

export function AqiForecastChart() {
  const { theme } = useOpsTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">AQI Forecast Timeline</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Predicted air quality with 95% confidence intervals</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>
              <span className="text-slate-600 dark:text-slate-300">Actual (Past)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-ops-brand)]"></div>
              <span className="text-slate-600 dark:text-slate-300">Predicted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[var(--color-ops-brand)]/20"></div>
              <span className="text-slate-600 dark:text-slate-300">Confidence Band</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Model refreshes every 15 minutes</span>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={aqiForecastData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-ops-brand)" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="var(--color-ops-brand)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
            <XAxis dataKey="time" stroke={isDark ? '#888' : '#999'} tick={{ fontSize: 12 }} dy={10} axisLine={false} tickLine={false} />
            <YAxis stroke={isDark ? '#888' : '#999'} tick={{ fontSize: 12 }} dx={-10} axisLine={false} tickLine={false} />
            
            <Tooltip
              contentStyle={{ backgroundColor: isDark ? '#1C1C1E' : '#fff', borderColor: isDark ? '#333' : '#eee', borderRadius: '8px' }}
              itemStyle={{ color: isDark ? '#fff' : '#000' }}
            />
            
            {/* Confidence Band (Area) */}
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#colorConfidence)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#1C1C1E" fillOpacity={isDark ? 1 : 0} /> 
            {/* Note: In a real implementation we'd use a custom shape or standard deviation bounds. For simplicity, we use an area up to upper and mask it if needed, or rely on recharts stacked areas. A simpler approach is just plotting the upper and lower as lines with a subtle fill. */}
            
            <ReferenceLine x="13:00" stroke={isDark ? '#555' : '#ccc'} strokeDasharray="3 3" label={{ position: 'top', value: 'NOW', fill: isDark ? '#888' : '#666', fontSize: 12, fontWeight: 'bold' }} />
            
            {/* Actual Data */}
            <Line type="monotone" dataKey="actual" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth={3} dot={{ r: 4, fill: isDark ? '#64748b' : '#94a3b8' }} />
            
            {/* Predicted Data */}
            <Line type="monotone" dataKey="predicted" stroke="var(--color-ops-brand)" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: 'var(--color-ops-brand)' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
