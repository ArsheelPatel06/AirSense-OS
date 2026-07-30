import React, { useState } from 'react';
import { Cloud, Wind, Thermometer, Droplets, ArrowUpRight, ArrowDownRight, Activity, Zap, AlertTriangle, Play, FileText, CheckCircle, Clock, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useOpsStore } from '../../context/OpsContext';

export function Dashboard() {
  const getAQIDetails = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'var(--color-ops-success)', bg: 'rgba(50, 215, 75, 0.15)' };
    if (aqi <= 100) return { label: 'Satisfactory', color: '#a3e635', bg: 'rgba(163, 230, 53, 0.15)' }; // Lime green
    if (aqi <= 200) return { label: 'Moderate', color: 'var(--color-ops-warning)', bg: 'rgba(255, 159, 10, 0.15)' };
    if (aqi <= 300) return { label: 'Poor', color: 'var(--color-ops-critical)', bg: 'rgba(255, 69, 58, 0.15)' };
    return { label: 'Severe', color: '#9f1239', bg: 'rgba(159, 18, 57, 0.15)' };
  };

  const navigate = useNavigate();
  const { state, showToast, resolveIncident } = useOpsStore();
  const currentAQI = state.currentAQI;
  const aqiInfo = getAQIDetails(currentAQI);

  const topMetrics = [
    { 
      id: 'aqi',
      title: 'AIR QUALITY INDEX', 
      value: currentAQI.toString(), 
      badge: 'LIVE',
      emoji: '💨',
      emojiBg: 'transparent',
      status: aqiInfo.label,
      statusColor: aqiInfo.color,
      statusBg: aqiInfo.bg,
      valueColor: aqiInfo.color,
      subtitle: 'Updated 12 sec ago'
    },
    { 
      id: 'temp',
      title: 'TEMPERATURE', 
      value: '28.1°C', 
      badge: null,
      emoji: '🌡️',
      emojiBg: 'transparent',
      status: 'Rain',
      statusColor: 'var(--color-ops-text-primary)',
      statusBg: 'transparent',
      valueColor: 'var(--color-ops-text-primary)',
      subtitle: 'Feels like 34°C'
    },
    { 
      id: 'hum',
      title: 'HUMIDITY', 
      value: '89%', 
      badge: null,
      emoji: '💧',
      emojiBg: 'var(--color-ops-brand-surface)',
      status: 'High humidity may amplify PM readings',
      statusColor: 'var(--color-ops-text-muted)',
      statusBg: 'transparent',
      valueColor: 'var(--color-ops-brand)',
      subtitle: null
    },
    { 
      id: 'wind',
      title: 'WIND SPEED', 
      value: '34.1 km/h', 
      badge: null,
      emoji: '🍃',
      emojiBg: 'transparent',
      status: 'High dispersion',
      statusColor: 'var(--color-ops-success)',
      statusBg: 'transparent',
      valueColor: 'var(--color-ops-success)',
      subtitle: null
    }
  ];

  const trendData = state.trendData;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-ops-bg)] p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-ops-text-primary)] tracking-tight">Mission Overview</h1>
            <p className="text-[13px] text-[var(--color-ops-text-secondary)] mt-1">City-wide environmental status and active operations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/operations/map')} className="px-4 py-2 bg-[var(--color-ops-brand)] hover:bg-[var(--color-ops-brand-hover)] text-white font-bold text-[13px] rounded shadow-sm transition-colors flex items-center gap-2">
              <Zap className="w-4 h-4" /> Open Live Map
            </button>
            <button onClick={() => showToast('Exporting Snapshot...')} className="px-4 py-2 bg-[var(--color-ops-card)] hover:bg-[var(--color-ops-surface)] border border-[var(--color-ops-border)] text-[var(--color-ops-text-primary)] font-bold text-[13px] rounded shadow-sm transition-colors">
              Export Snapshot
            </button>
          </div>
        </div>

        {/* Top Metrics Cards (Replicating Screenshot Style) */}
        <div className="grid grid-cols-4 gap-4">
          {topMetrics.map(m => (
            <div key={m.id} className="relative overflow-hidden bg-[var(--color-ops-card)] border border-[var(--color-ops-border)] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[160px]">
              {/* Subtle watermark circle */}
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[var(--color-ops-text-disabled)]/5 rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <span className="text-[11px] font-bold text-[var(--color-ops-text-muted)] tracking-widest">{m.title}</span>
                <div className="w-8 h-8 rounded flex items-center justify-center text-lg" style={{ background: m.emojiBg }}>
                  {m.emoji}
                </div>
              </div>

              <div className="mt-1 mb-4 flex items-center gap-2 z-10">
                <span className="text-4xl font-bold tracking-tight" style={{ color: m.valueColor }}>{m.value}</span>
                {m.badge && (
                  <span className="px-2 py-0.5 bg-[var(--color-ops-surface)] text-[var(--color-ops-text-secondary)] text-[10px] font-bold rounded">
                    {m.badge}
                  </span>
                )}
              </div>

              <div className="mt-auto z-10 flex flex-col gap-1">
                {m.statusBg !== 'transparent' ? (
                  <span className="inline-flex w-fit px-2 py-1 text-[11px] font-bold rounded" style={{ backgroundColor: m.statusBg, color: m.statusColor }}>
                    {m.status}
                  </span>
                ) : (
                  <span className="text-[12px] font-bold" style={{ color: m.statusColor }}>
                    {m.status}
                  </span>
                )}
                {m.subtitle && (
                  <span className="text-[11px] text-[var(--color-ops-text-muted)]">{m.subtitle}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Col (Trend + Breakdowns) */}
          <div className="col-span-8 space-y-6">
            
            {/* Trend Chart */}
            <div className="bg-[var(--color-ops-card)] border border-[var(--color-ops-border)] rounded-2xl p-6 shadow-sm h-96 flex flex-col relative overflow-hidden">
              <div className="flex items-start justify-between mb-6 z-10">
                <div>
                  <h3 className="font-bold text-[var(--color-ops-text-primary)] text-[16px]">24-Hour Trend</h3>
                  <p className="text-[12px] text-[var(--color-ops-text-muted)] mt-1">Real-time AQI monitoring</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-ops-success)] flex items-center justify-center text-white font-bold text-lg">40</div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-[var(--color-ops-text-primary)]">Min.</span>
                      <span className="text-[10px] text-[var(--color-ops-text-muted)]">AT 03:00</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-ops-critical)] flex items-center justify-center text-white font-bold text-lg">59</div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-[var(--color-ops-text-primary)]">Max.</span>
                      <span className="text-[10px] text-[var(--color-ops-text-muted)]">AT 16:00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 -mx-2 z-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--color-ops-text-muted)', fontSize: 10 }}
                      ticks={['16:00', '20:00', '00:00', '04:00', '08:00', '12:00']}
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'var(--color-ops-surface)', opacity: 0.5 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[var(--color-ops-card)] border border-[var(--color-ops-border)] p-3 rounded-xl shadow-xl flex flex-col items-center min-w-[80px]">
                              <span className="text-[11px] font-bold text-[var(--color-ops-text-primary)]">{payload[0].payload.time}</span>
                              <span className="text-[13px] font-bold text-[var(--color-ops-text-primary)] mt-1">AQI: {payload[0].value}</span>
                              <span className="text-[10px] text-[var(--color-ops-text-muted)] mt-1">Calibrating</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="aqi" radius={[4, 4, 0, 0]} maxBarSize={12}>
                      {trendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.aqi === 57 ? 'var(--color-ops-success)' : 'var(--color-ops-success)'} fillOpacity={entry.time === '12:00' ? 1 : 0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Highlight background column for 12:00 similar to screenshot */}
              <div className="absolute top-[80px] bottom-8 left-[75%] w-12 bg-[var(--color-ops-surface)] opacity-50 rounded-t-lg z-0 pointer-events-none hidden md:block" />
            </div>

            {/* Pollutant Breakdowns removed for Operations Dashboard */}
          </div>

          {/* Right Col (AI, Incidents) */}
          <div className="col-span-4 space-y-6">
            
            {/* AI Operational Summary */}
            <div className="bg-[var(--color-ops-brand-surface)] border border-[var(--color-ops-brand)]/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[var(--color-ops-brand)]" />
                <span className="text-[13px] font-bold text-[var(--color-ops-brand)]">AI Operational Summary</span>
              </div>
              <ul className="space-y-3">
                <li className="text-[13px] text-[var(--color-ops-text-primary)] flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ops-critical)] mt-1.5 shrink-0" />
                  <span><strong className="text-[var(--color-ops-text-primary)] font-semibold">Morning traffic increased PM2.5</strong> by 14%.</span>
                </li>
                <li className="text-[13px] text-[var(--color-ops-text-primary)] flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ops-warning)] mt-1.5 shrink-0" />
                  <span>Wind shifted NE reducing dispersion efficiency.</span>
                </li>
                <li className="text-[13px] text-[var(--color-ops-text-primary)] flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ops-warning)] mt-1.5 shrink-0" />
                  <span>Construction activity in East Zone is contributing 11% above baseline.</span>
                </li>
                <li className="text-[13px] text-[var(--color-ops-text-primary)] flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ops-info)] mt-1.5 shrink-0" />
                  <span>Rain expected in 3 hours. Estimated AQI improvement after 18:00.</span>
                </li>
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => navigate('/operations/forecast')} className="py-2 bg-[var(--color-ops-brand)] hover:bg-[var(--color-ops-brand-hover)] text-white text-[11px] font-bold rounded shadow-sm transition-colors text-center">View Forecast</button>
                <button onClick={() => navigate('/operations/map')} className="py-2 bg-[var(--color-ops-card)] hover:bg-[var(--color-ops-surface)] border border-[var(--color-ops-brand)]/30 text-[var(--color-ops-brand)] text-[11px] font-bold rounded shadow-sm transition-colors text-center">Open Map</button>
              </div>
            </div>

            {/* Active Incidents */}
            <div className="bg-[var(--color-ops-card)] border border-[var(--color-ops-border)] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--color-ops-text-primary)] text-[14px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[var(--color-ops-warning)]" /> Active Incidents
                </h3>
                <span className="text-[11px] font-bold text-[var(--color-ops-text-muted)] bg-[var(--color-ops-surface)] px-2 py-1 rounded">{state.incidents.filter(inc => inc.status !== 'Resolved' && inc.status !== 'Closed').length} TOTAL</span>
              </div>
              <div className="space-y-3">
                {state.incidents.filter(inc => inc.status !== 'Resolved' && inc.status !== 'Closed').slice(0, 3).map(inc => (
                  <div key={inc.id} className={`p-3 border border-[var(--color-ops-border)] rounded-lg bg-[var(--color-ops-surface)] transition-colors cursor-pointer ${inc.severity === 'critical' ? 'hover:border-[var(--color-ops-critical)]/50' : 'hover:border-[var(--color-ops-warning)]/50'}`} onClick={() => navigate(`/operations/incidents/${inc.id}`)}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${inc.severity === 'critical' ? 'bg-[var(--color-ops-critical)]/10 text-[var(--color-ops-critical)]' : 'bg-[var(--color-ops-warning)]/10 text-[var(--color-ops-warning)]'}`}>{inc.severity}</span>
                      <span className="text-[10px] font-mono text-[var(--color-ops-text-disabled)]"><Clock className="w-3 h-3 inline mr-1" />{inc.elapsedTime}</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-[var(--color-ops-text-primary)]">{inc.title}</h4>
                    <p className="text-[11px] text-[var(--color-ops-text-muted)] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {inc.location}</p>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); resolveIncident(inc.id); }}
                      className="mt-2 text-[10px] font-bold text-[var(--color-ops-brand)] hover:underline"
                    >
                      Mark Resolved
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/operations/incidents')} className="w-full mt-4 py-2 text-[12px] font-bold text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] bg-[var(--color-ops-surface)] border border-[var(--color-ops-border)] rounded transition-colors">
                View All Incidents
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--color-ops-card)] border border-[var(--color-ops-border)] rounded-2xl p-5 shadow-sm">
               <h3 className="font-bold text-[var(--color-ops-text-primary)] text-[14px] mb-4">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => showToast('Opening Broadcast channel...', 'info')} className="p-3 bg-[var(--color-ops-surface)] hover:border-[var(--color-ops-critical)] border border-[var(--color-ops-border)] rounded flex flex-col items-center justify-center gap-2 transition-colors">
                   <AlertTriangle className="w-4 h-4 text-[var(--color-ops-critical)]" />
                   <span className="text-[11px] font-bold text-[var(--color-ops-text-secondary)]">Broadcast</span>
                 </button>
                 <button onClick={() => showToast('Generating Report...', 'info')} className="p-3 bg-[var(--color-ops-surface)] hover:border-[var(--color-ops-brand)] border border-[var(--color-ops-border)] rounded flex flex-col items-center justify-center gap-2 transition-colors">
                   <FileText className="w-4 h-4 text-[var(--color-ops-brand)]" />
                   <span className="text-[11px] font-bold text-[var(--color-ops-text-secondary)]">Report</span>
                 </button>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
