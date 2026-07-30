import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_TREND_DATA } from '../mockData';

export function TrendAnalysis() {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pollutant Trends</h2>
        <div className="flex gap-1">
          {['24h', '7d', '30d'].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                timeRange === range 
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-black' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-[#25262B] dark:hover:bg-[#2C2E33]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#2C2E33', fontSize: '12px', color: '#fff', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="PM2.5" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPM25)" strokeWidth={2} />
            <Area type="monotone" dataKey="NO2" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNO2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
