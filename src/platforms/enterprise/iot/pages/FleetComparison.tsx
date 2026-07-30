import { useState } from 'react';
import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { Activity, Battery, AlertTriangle, Cpu, HardDrive, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const fleets = [
  {
    id: 'north-campus',
    name: 'North Campus',
    color: '#2F9E44',
    devices: 3240,
    online: 3198,
    offline: 42,
    battery: 81,
    aqi: 38,
    alerts: 2,
    firmware: '2.4.1',
    uptime: 98.7,
    trend: 'up',
  },
  {
    id: 'east-campus',
    name: 'East Campus',
    color: '#2F80ED',
    devices: 2800,
    online: 2690,
    offline: 110,
    battery: 64,
    aqi: 55,
    alerts: 7,
    firmware: '2.4.0',
    uptime: 96.1,
    trend: 'down',
  },
  {
    id: 'industrial-zone',
    name: 'Industrial Zone',
    color: '#F59E0B',
    devices: 5100,
    online: 4930,
    offline: 170,
    battery: 72,
    aqi: 89,
    alerts: 14,
    firmware: '2.3.9',
    uptime: 96.7,
    trend: 'neutral',
  },
];

type Metric = { label: string; key: keyof typeof fleets[0]; unit?: string; higherIsBetter?: boolean; icon: any };

const metrics: Metric[] = [
  { label: 'Total Devices', key: 'devices', icon: Cpu, higherIsBetter: true },
  { label: 'Online Devices', key: 'online', icon: Activity, higherIsBetter: true },
  { label: 'Offline Devices', key: 'offline', unit: '', icon: AlertTriangle, higherIsBetter: false },
  { label: 'Avg Battery', key: 'battery', unit: '%', icon: Battery, higherIsBetter: true },
  { label: 'Avg AQI', key: 'aqi', icon: Activity, higherIsBetter: false },
  { label: 'Active Alerts', key: 'alerts', icon: AlertTriangle, higherIsBetter: false },
  { label: 'Uptime', key: 'uptime', unit: '%', icon: TrendingUp, higherIsBetter: true },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-[var(--color-iot-success)]" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-[var(--color-iot-critical)]" />;
  return <Minus className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />;
}

export function FleetComparison() {
  const [selectedFleets, setSelectedFleets] = useState(['north-campus', 'east-campus', 'industrial-zone']);

  const toggleFleet = (id: string) => {
    setSelectedFleets(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(f => f !== id) : prev) : [...prev, id]
    );
  };

  const activeFleets = fleets.filter(f => selectedFleets.includes(f.id));

  const getBest = (key: keyof typeof fleets[0], higherIsBetter: boolean) => {
    const vals = activeFleets.map(f => f[key] as number);
    return higherIsBetter ? Math.max(...vals) : Math.min(...vals);
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500 pb-8">
      <div className="mb-6"><Breadcrumb /></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">Fleet Comparison</h1>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Side-by-side comparison of fleet performance metrics.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {fleets.map(fleet => (
            <button
              key={fleet.id}
              onClick={() => toggleFleet(fleet.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                selectedFleets.includes(fleet.id)
                  ? 'text-white shadow-sm'
                  : 'bg-white text-[var(--color-iot-text-secondary)] border-[var(--color-iot-border)] hover:bg-[#F1F5F9]'
              }`}
              style={selectedFleets.includes(fleet.id) ? { backgroundColor: fleet.color, borderColor: fleet.color } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFleets.includes(fleet.id) ? 'rgba(255,255,255,0.8)' : fleet.color }}></span>
              {fleet.name}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="mb-8 bg-gradient-to-r from-[#EAF8EE] to-[#F0F9FF] rounded-lg border border-[var(--color-iot-brand)]/20 p-4 flex items-start gap-3 shadow-sm">
        <div className="w-8 h-8 bg-[var(--color-iot-brand)] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-iot-brand)]">AI Insight</span>
          </div>
          <p className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">
            <span className="font-bold">Industrial Zone</span> has the highest AQI readings and most active alerts. Recommend deploying additional sensor coverage and scheduling a maintenance sweep.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden mb-8">
        <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
          <h3 className="text-[13px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Metrics Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-iot-border)] bg-[var(--color-iot-bg)]/50">
                <th className="text-left p-4 text-[11px] font-semibold text-[var(--color-iot-text-secondary)] uppercase tracking-wider w-40">Metric</th>
                {activeFleets.map(fleet => (
                  <th key={fleet.id} className="text-center p-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: fleet.color }}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fleet.color }}></span>
                      {fleet.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, i) => {
                const best = getBest(metric.key, metric.higherIsBetter ?? true);
                return (
                  <tr key={metric.key} className={`border-b border-[var(--color-iot-border)] last:border-0 ${i % 2 === 0 ? '' : 'bg-[var(--color-iot-bg)]/30'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <metric.icon className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
                        <span className="text-[13px] font-medium text-[var(--color-iot-text-secondary)]">{metric.label}</span>
                      </div>
                    </td>
                    {activeFleets.map(fleet => {
                      const val = fleet[metric.key] as number;
                      const isBest = val === best;
                      return (
                        <td key={fleet.id} className="p-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold ${
                            isBest
                              ? 'bg-[var(--color-iot-brand)]/10 text-[var(--color-iot-brand)]'
                              : 'text-[var(--color-iot-text-primary)]'
                          }`}>
                            {val}{metric.unit ?? ''}
                            {isBest && <span className="text-[9px] font-bold uppercase">BEST</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Health Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeFleets.map(fleet => (
          <div key={fleet.id} className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: fleet.color }}></span>
              <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)]">{fleet.name}</h3>
              <div className="ml-auto flex items-center gap-1">
                <TrendIcon trend={fleet.trend} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[12px] mb-1 font-medium">
                  <span className="text-[var(--color-iot-text-secondary)]">Online Rate</span>
                  <span className="text-[var(--color-iot-text-primary)]">{((fleet.online / fleet.devices) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${(fleet.online / fleet.devices) * 100}%`, backgroundColor: fleet.color }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1 font-medium">
                  <span className="text-[var(--color-iot-text-secondary)]">Avg Battery</span>
                  <span className="text-[var(--color-iot-text-primary)]">{fleet.battery}%</span>
                </div>
                <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${fleet.battery}%`, backgroundColor: fleet.battery < 50 ? 'var(--color-iot-warning)' : fleet.color }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1 font-medium">
                  <span className="text-[var(--color-iot-text-secondary)]">Uptime</span>
                  <span className="text-[var(--color-iot-text-primary)]">{fleet.uptime}%</span>
                </div>
                <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${fleet.uptime}%`, backgroundColor: fleet.color }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-iot-border)] grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-[18px] font-bold text-[var(--color-iot-text-primary)]">{fleet.devices.toLocaleString()}</p>
                <p className="text-[10px] text-[var(--color-iot-text-muted)] uppercase tracking-wide">Devices</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold" style={{ color: fleet.alerts > 5 ? 'var(--color-iot-critical)' : 'var(--color-iot-warning)' }}>{fleet.alerts}</p>
                <p className="text-[10px] text-[var(--color-iot-text-muted)] uppercase tracking-wide">Alerts</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold text-[var(--color-iot-text-primary)]">{fleet.aqi}</p>
                <p className="text-[10px] text-[var(--color-iot-text-muted)] uppercase tracking-wide">AQI</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
