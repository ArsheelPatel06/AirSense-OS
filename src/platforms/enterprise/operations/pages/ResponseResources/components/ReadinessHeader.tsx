import { Activity, ShieldCheck, Truck, Radio, Shield } from 'lucide-react';

export function ReadinessHeader() {
  return (
    <div className="shrink-0 bg-slate-900 dark:bg-black border-b border-slate-800 dark:border-[#2C2E33] px-6 py-2.5 flex items-center justify-between shadow-sm z-20">
      
      {/* Branding / Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[var(--color-ops-brand)]/20 flex items-center justify-center border border-[var(--color-ops-brand)]/30">
          <Shield className="w-4 h-4 text-[var(--color-ops-brand)]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-sm font-bold leading-none mb-0.5">Response Resources</h1>
          <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest">Live Asset Matrix</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-5">
        
        <div className="flex flex-col border-l border-slate-700 dark:border-[#38383A] pl-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> Personnel Teams
          </span>
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-tight"><span className="text-green-400 text-sm font-bold">14</span><span className="text-[8px] uppercase font-bold text-slate-500">Available</span></div>
            <div className="flex flex-col leading-tight"><span className="text-blue-400 text-sm font-bold">8</span><span className="text-[8px] uppercase font-bold text-slate-500">Deployed</span></div>
            <div className="flex flex-col leading-tight"><span className="text-yellow-500 text-sm font-bold">2</span><span className="text-[8px] uppercase font-bold text-slate-500">Maint</span></div>
          </div>
        </div>

        <div className="flex flex-col border-l border-slate-700 dark:border-[#38383A] pl-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Truck className="w-3 h-3" /> Mobile Units
          </span>
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-tight"><span className="text-green-400 text-sm font-bold">8</span><span className="text-[8px] uppercase font-bold text-slate-500">Available</span></div>
            <div className="flex flex-col leading-tight"><span className="text-blue-400 text-sm font-bold">3</span><span className="text-[8px] uppercase font-bold text-slate-500">Deployed</span></div>
            <div className="flex flex-col leading-tight"><span className="text-yellow-500 text-sm font-bold">1</span><span className="text-[8px] uppercase font-bold text-slate-500">Maint</span></div>
          </div>
        </div>

        <div className="flex flex-col border-l border-slate-700 dark:border-[#38383A] pl-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Radio className="w-3 h-3" /> Portable Sensors
          </span>
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-tight"><span className="text-green-400 text-sm font-bold">42</span><span className="text-[8px] uppercase font-bold text-slate-500">Online</span></div>
            <div className="flex flex-col leading-tight"><span className="text-slate-400 text-sm font-bold">8</span><span className="text-[8px] uppercase font-bold text-slate-500">Offline</span></div>
          </div>
        </div>

        <div className="flex flex-col border-l border-slate-700 dark:border-[#38383A] pl-5">
          <span className="text-[10px] font-bold text-[var(--color-ops-brand)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Activity className="w-3 h-3" /> Readiness Score
          </span>
          <span className="text-[var(--color-ops-brand)] text-lg font-bold leading-tight">85%</span>
        </div>

      </div>
    </div>
  );
}
