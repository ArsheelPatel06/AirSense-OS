import { HardDrive, DownloadCloud, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function DeviceFirmwareTab() {
  const { deviceId } = useParams();
  const currentVersion = 'v2.3.9';
  const targetVersion = 'v2.4.1';

  return (
    <div className="flex flex-col gap-6 pb-8">
      
      {/* Status Banner */}
      <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="text-[14px] font-bold text-amber-900">Firmware Update Available</h3>
            <p className="text-[13px] text-amber-800 mt-1">
              Version {targetVersion} is available for {deviceId}. This update includes critical security patches and improved battery management for AirNode devices.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white text-[13px] font-medium rounded hover:bg-amber-600 transition-colors whitespace-nowrap shadow-sm">
          Update to {targetVersion}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Version Details */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Current Firmware
            </h3>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] border border-[var(--color-iot-border)] flex items-center justify-center">
                <span className="text-[14px] font-mono font-bold text-[var(--color-iot-text-secondary)]">{currentVersion}</span>
              </div>
              <div>
                <p className="text-[14px] font-bold text-[var(--color-iot-text-primary)]">AirSense OS Core</p>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)]">Installed on May 12, 2026</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-iot-border)]">
                <span className="text-[12px] text-[var(--color-iot-text-secondary)]">Build Number</span>
                <span className="text-[12px] font-mono text-[var(--color-iot-text-primary)]">bld-8894-release</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-iot-border)]">
                <span className="text-[12px] text-[var(--color-iot-text-secondary)]">Bootloader</span>
                <span className="text-[12px] font-mono text-[var(--color-iot-text-primary)]">v1.1.0</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[12px] text-[var(--color-iot-text-secondary)]">Compliance</span>
                <span className="flex items-center gap-1 text-[12px] text-[var(--color-iot-success)] font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Update History */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Update History
            </h3>
          </div>
          <div className="p-0">
            <div className="p-4 border-b border-[var(--color-iot-border)] flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded bg-[var(--color-iot-success)]/10 text-[var(--color-iot-success)]">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Updated to v2.3.9</p>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">Automated fleet rollout (North Campus Policy).</p>
                <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-1 font-mono">May 12, 2026 • 02:00 AM</p>
              </div>
            </div>
            
            <div className="p-4 border-b border-[var(--color-iot-border)] flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded bg-[var(--color-iot-success)]/10 text-[var(--color-iot-success)]">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Updated to v2.3.5</p>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">Manual update triggered by admin.</p>
                <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-1 font-mono">Feb 28, 2026 • 11:45 AM</p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 opacity-60">
              <div className="mt-0.5 p-1.5 rounded bg-[var(--color-iot-text-muted)]/10 text-[var(--color-iot-text-muted)]">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Initial Factory Flash (v2.0.1)</p>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">Manufacturing line programming.</p>
                <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-1 font-mono">Nov 15, 2025 • 09:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
