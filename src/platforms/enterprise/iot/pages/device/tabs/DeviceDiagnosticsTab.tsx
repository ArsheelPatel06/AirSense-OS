import { ShieldCheck, Cpu, HardDrive, Wifi, Activity, Terminal } from 'lucide-react';

export function DeviceDiagnosticsTab() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      
      {/* Action Bar */}
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-sm flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[13px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--color-iot-brand)]" />
          Run Full Diagnostic
        </button>
        <button className="px-4 py-2 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[13px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-2">
          <Wifi className="w-4 h-4 text-[var(--color-iot-blue)]" />
          Reconnect Network
        </button>
        <button className="px-4 py-2 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[13px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[var(--color-iot-warning)]" />
          Calibrate Sensors
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Resources */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> CPU Usage
            </h3>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">14%</span>
              <span className="text-[12px] text-[var(--color-iot-text-secondary)] pb-1">Average load</span>
            </div>
            <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 mt-4">
              <div className="bg-[var(--color-iot-brand)] h-2 rounded-full" style={{ width: '14%' }}></div>
            </div>
          </div>
          
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2 mb-4">
              <HardDrive className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Memory (RAM)
            </h3>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">42%</span>
              <span className="text-[12px] text-[var(--color-iot-text-secondary)] pb-1">108MB / 256MB</span>
            </div>
            <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 mt-4">
              <div className="bg-[var(--color-iot-blue)] h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>

          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2 mb-4">
              <Wifi className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Network Latency
            </h3>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">45</span>
              <span className="text-[12px] text-[var(--color-iot-text-secondary)] pb-1">ms (Ping)</span>
            </div>
            <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 mt-4">
              <div className="bg-[var(--color-iot-success)] h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
          
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Error Rate
            </h3>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-[var(--color-iot-text-primary)] font-mono">0.01%</span>
              <span className="text-[12px] text-[var(--color-iot-text-secondary)] pb-1">Packets dropped</span>
            </div>
            <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 mt-4">
              <div className="bg-[var(--color-iot-success)] h-2 rounded-full" style={{ width: '2%' }}></div>
            </div>
          </div>
        </div>

        {/* Live Terminal / Logs */}
        <div className="bg-[#1E293B] rounded-lg border border-[#334155] shadow-lg flex flex-col overflow-hidden h-[400px]">
          <div className="p-3 border-b border-[#334155] bg-[#0F172A] flex items-center justify-between">
            <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wide flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> Live Console
            </h3>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#38BDF8]">
            <div className="mb-2"><span className="text-[#94A3B8]">[14:32:01]</span> System initialized.</div>
            <div className="mb-2"><span className="text-[#94A3B8]">[14:32:02]</span> Connecting to MQTT broker... <span className="text-[#10B981]">SUCCESS</span></div>
            <div className="mb-2"><span className="text-[#94A3B8]">[14:32:05]</span> Publishing telemetry packet 8942...</div>
            <div className="mb-2"><span className="text-[#94A3B8]">[14:33:05]</span> Publishing telemetry packet 8943...</div>
            <div className="mb-2"><span className="text-[#94A3B8]">[14:34:05]</span> Publishing telemetry packet 8944...</div>
            <div className="mb-2"><span className="text-[#94A3B8]">[14:35:05]</span> Publishing telemetry packet 8945...</div>
            <div className="mb-2 text-[#F59E0B]"><span className="text-[#94A3B8]">[14:35:12]</span> WARN: I2C bus latency spike (42ms) detected on PM2.5 sensor.</div>
            <div className="mb-2"><span className="text-[#94A3B8]">[14:36:05]</span> Publishing telemetry packet 8946...</div>
            <div className="mt-4 flex items-center gap-2 text-[#94A3B8] animate-pulse">
              <span>Waiting for new logs</span>
              <span className="w-1.5 h-3 bg-[#94A3B8]"></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
