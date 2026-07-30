import { Battery, MapPin, Wifi, Activity, AlertTriangle, Clock, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function DeviceOverviewTab() {
  const { deviceId } = useParams();
  
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Top Section: Health & AI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Health Score */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-6 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-iot-success)]"></div>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-4">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="var(--color-iot-border)" strokeWidth="8" fill="none" />
                <circle cx="64" cy="64" r="58" stroke="var(--color-iot-success)" strokeWidth="8" fill="none" strokeDasharray="364" strokeDashoffset="10" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[var(--color-iot-text-primary)]">97<span className="text-xl text-[var(--color-iot-text-muted)]">%</span></span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-iot-text-primary)]">Excellent</h3>
            <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Overall Device Health</p>
          </div>
        </div>
        
        {/* AI Summary */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-lg border border-[#DBEAFE] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-[13px] font-bold text-[var(--color-iot-text-primary)] uppercase tracking-wide">AI Insight</h3>
            </div>
            
            <p className="text-[15px] leading-relaxed text-[var(--color-iot-text-primary)]">
              Device health remains stable with nominal environmental readings over the past 24 hours. However, battery degradation has accelerated slightly, dropping 4% faster than the fleet average. PM2.5 spikes (up to 16 µg/m³) correlate with scheduled facility cleaning hours (3:00 PM - 5:00 PM).
            </p>
            
            <div className="mt-5 flex gap-3">
              <button className="px-3 py-1.5 bg-white border border-[#BFDBFE] text-blue-700 text-[12px] font-medium rounded hover:bg-blue-50 transition-colors shadow-sm">
                View Battery Diagnostics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Sensor Cards & Mini Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-3">
          <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] mb-4 flex items-center gap-2">
            Latest Sensor Readings
            <span className="text-[11px] font-normal text-[var(--color-iot-text-muted)] bg-[var(--color-iot-bg)] px-2 py-0.5 rounded-full border border-[var(--color-iot-border)]">Live</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)] uppercase tracking-wider">PM2.5</span>
                <span className="text-[10px] font-bold text-[var(--color-iot-success)] bg-[var(--color-iot-success)]/10 px-1.5 py-0.5 rounded">Healthy</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">12</span>
                <span className="text-[12px] text-[var(--color-iot-text-muted)] ml-1">µg/m³</span>
              </div>
            </div>

            <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)] uppercase tracking-wider">AQI</span>
                <span className="text-[10px] font-bold text-[var(--color-iot-success)] bg-[var(--color-iot-success)]/10 px-1.5 py-0.5 rounded">Healthy</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">42</span>
                <span className="text-[12px] text-[var(--color-iot-text-muted)] ml-1">Index</span>
              </div>
            </div>

            <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)] uppercase tracking-wider">Temp</span>
                <span className="text-[10px] font-bold text-[var(--color-iot-success)] bg-[var(--color-iot-success)]/10 px-1.5 py-0.5 rounded">Healthy</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">22.4</span>
                <span className="text-[12px] text-[var(--color-iot-text-muted)] ml-1">°C</span>
              </div>
            </div>

            <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-warning)] p-4 shadow-sm bg-[var(--color-iot-warning)]/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)] uppercase tracking-wider">Humidity</span>
                <span className="text-[10px] font-bold text-[var(--color-iot-warning)] bg-[var(--color-iot-warning)]/20 px-1.5 py-0.5 rounded">Warning</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">68</span>
                <span className="text-[12px] text-[var(--color-iot-text-muted)] ml-1">%</span>
              </div>
              <p className="text-[10px] text-[var(--color-iot-warning)] mt-1.5 leading-tight font-medium">Outside 40-60% optimal range</p>
            </div>
            
          </div>
        </div>
        
        {/* Mini GIS Map */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-iot-text-secondary)]" />
            <h3 className="text-[12px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Location</h3>
          </div>
          <div className="flex-1 bg-[#E5E7EB]/20 relative flex items-center justify-center min-h-[160px] cursor-pointer group">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(var(--color-iot-text-primary) 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
            {/* Mock device pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full shadow-lg border-2 border-[var(--color-iot-success)] flex items-center justify-center absolute -top-8 -left-4 z-10 transition-transform group-hover:scale-110">
                  <Activity className="w-4 h-4 text-[var(--color-iot-success)]" />
                </div>
                <div className="w-2 h-2 bg-[var(--color-iot-success)] rounded-full animate-ping absolute -left-1 -top-1"></div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-[var(--color-iot-text-muted)] font-mono bg-white/80 px-1.5 py-0.5 rounded shadow-sm">
              40.7128° N, -74.0060° W
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Alerts & Maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Alerts */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="p-4 border-b border-[var(--color-iot-border)] flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--color-iot-text-secondary)]" /> Recent Alerts
            </h3>
            <span className="text-[12px] text-[var(--color-iot-brand)] cursor-pointer hover:underline font-medium">View All</span>
          </div>
          <div className="divide-y divide-[var(--color-iot-border)]">
            <div className="p-4 hover:bg-[#F1F5F9] transition-colors cursor-pointer flex gap-3">
              <div className="mt-0.5 p-1.5 rounded bg-[var(--color-iot-warning)]/10 text-[var(--color-iot-warning)]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)] leading-tight">Humidity Threshold Exceeded</p>
                  <span className="text-[11px] text-[var(--color-iot-text-muted)] whitespace-nowrap ml-2">2 hours ago</span>
                </div>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)]">Humidity recorded at 68%, exceeding the recommended max threshold of 60%.</p>
              </div>
            </div>
            <div className="p-4 hover:bg-[#F1F5F9] transition-colors cursor-pointer flex gap-3 opacity-60">
              <div className="mt-0.5 p-1.5 rounded bg-[var(--color-iot-success)]/10 text-[var(--color-iot-success)]">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)] leading-tight line-through">Connection Lost</p>
                  <span className="text-[11px] text-[var(--color-iot-text-muted)] whitespace-nowrap ml-2">Yesterday</span>
                </div>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)]">Resolved: Gateway NC-02 reconnected successfully after 14s.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Timeline */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="p-4 border-b border-[var(--color-iot-border)] flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-iot-text-secondary)]" /> Device Timeline
            </h3>
            <span className="text-[12px] text-[var(--color-iot-brand)] cursor-pointer hover:underline font-medium">Full History</span>
          </div>
          <div className="p-5 relative">
            <div className="absolute left-[27px] top-5 bottom-5 w-px bg-[var(--color-iot-border)]"></div>
            
            <div className="relative pl-10 mb-6">
              <div className="absolute left-[3px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--color-iot-brand)] ring-4 ring-[var(--color-iot-brand)]/20 z-10"></div>
              <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Firmware Updated to v2.3.9</p>
              <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">Deployed automatically via North Campus policy.</p>
              <span className="text-[11px] text-[var(--color-iot-text-muted)] block mt-1.5 font-mono">2026-06-12 • 02:00 AM</span>
            </div>
            
            <div className="relative pl-10 mb-6">
              <div className="absolute left-[3px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--color-iot-success)] ring-4 ring-white border border-[var(--color-iot-border)] z-10"></div>
              <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Sensor Calibration</p>
              <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">Routine bi-annual sensor calibration performed by Technician 42.</p>
              <span className="text-[11px] text-[var(--color-iot-text-muted)] block mt-1.5 font-mono">2026-05-01 • 14:30 PM</span>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-[3px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--color-iot-text-muted)] ring-4 ring-white border border-[var(--color-iot-border)] z-10"></div>
              <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Device Provisioned</p>
              <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">Initial setup and registration to North Campus fleet.</p>
              <span className="text-[11px] text-[var(--color-iot-text-muted)] block mt-1.5 font-mono">2025-11-20 • 09:15 AM</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
