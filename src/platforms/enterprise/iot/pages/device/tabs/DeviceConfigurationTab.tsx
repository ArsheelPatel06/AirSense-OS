import { Settings, Save, RotateCcw } from 'lucide-react';

export function DeviceConfigurationTab() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
          <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[var(--color-iot-text-secondary)]" /> Device Parameters
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Device Name</label>
                <input 
                  type="text" 
                  defaultValue="AirNode-1004"
                  className="w-full px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]"
                />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Telemetry Reporting Interval (seconds)</label>
                <select className="w-full px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]">
                  <option value="15">15 seconds (High Power)</option>
                  <option value="30" selected>30 seconds (Standard)</option>
                  <option value="60">60 seconds (Battery Saver)</option>
                  <option value="300">5 minutes (Ultra Low Power)</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Assigned Fleet</label>
                <select className="w-full px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]">
                  <option value="flt-nc">North Campus (FLT-NC-9021)</option>
                  <option value="flt-dt">Downtown Hub</option>
                  <option value="flt-ind">Industrial Park</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Maintenance Mode</label>
                <div className="flex items-center gap-3">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ top: '2px', left: '2px' }}/>
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                  <span className="text-[13px] text-[var(--color-iot-text-secondary)]">Suppress alerts during maintenance</span>
                </div>
              </div>
            </div>

          </div>
          
          <div className="mt-8 pt-6 border-t border-[var(--color-iot-border)] flex items-center justify-end gap-3">
            <button className="px-4 py-2 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[13px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[var(--color-iot-text-muted)]" />
              Reset Changes
            </button>
            <button className="px-4 py-2 bg-[var(--color-iot-brand)] text-white text-[13px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors shadow-sm flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
