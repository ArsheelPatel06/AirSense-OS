import { AlertTriangle, Cloud, Wind, Zap } from 'lucide-react';

export function AlertThresholds() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* AQI Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-[#38383A]">
          <Cloud className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Air Quality (AQI)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Critical PM2.5 Threshold</span>
              <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">Triggers Red Alert</span>
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                defaultValue={150} 
                className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#38383A] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)]"
              />
              <span className="text-sm text-slate-500 font-semibold">µg/m³</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Fires alert if sustained for more than 15 minutes.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>High AQI Threshold</span>
              <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">Triggers Orange Alert</span>
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                defaultValue={200} 
                className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#38383A] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)]"
              />
              <span className="text-sm text-slate-500 font-semibold">Index</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Weather Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-[#38383A]">
          <Wind className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Meteorology</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Severe Wind Warning</span>
              <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">Triggers Orange Alert</span>
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                defaultValue={35} 
                className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#38383A] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)]"
              />
              <span className="text-sm text-slate-500 font-semibold">km/h</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Cross-referenced with industrial emission hotspots.</p>
          </div>
        </div>
      </div>

      {/* System Health Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-[#38383A]">
          <Zap className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">System Health</h3>
        </div>
        
        <div className="p-5 bg-yellow-50 dark:bg-[#25262B] border border-yellow-200 dark:border-yellow-900/30 rounded-xl mb-4 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Offline Timeouts</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1 max-w-xl leading-relaxed">
              Modifying offline timeouts will affect fleet uptime calculations globally. Ensure maintenance teams are aware of SLA changes before reducing these windows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Sensor Node Offline Tolerance
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                defaultValue={15} 
                className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#38383A] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)]"
              />
              <span className="text-sm text-slate-500 font-semibold">Minutes</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Gateway Offline Tolerance
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                defaultValue={5} 
                className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#38383A] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)]"
              />
              <span className="text-sm text-slate-500 font-semibold">Minutes</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
