import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { Activity, Battery, Thermometer, CloudRain, ShieldCheck } from 'lucide-react';
import { BarChart, LineChart } from '../../../../shared/runtime/chart';
import { useIotStore } from '../context/IotContext';

const mockCompareData = [
  { metric: 'AQI', 'AN-1004': 42, 'AN-1032': 38, 'AN-2045': 55 },
  { metric: 'PM2.5', 'AN-1004': 12, 'AN-1032': 10, 'AN-2045': 18 },
  { metric: 'Temp', 'AN-1004': 22.4, 'AN-1032': 21.8, 'AN-2045': 24.1 },
  { metric: 'Battery', 'AN-1004': 84, 'AN-1032': 92, 'AN-2045': 45 },
];

const mockTimelineData = Array.from({ length: 12 }).map((_, i) => ({
  time: `${i * 2}:00`,
  'AN-1004': 40 + Math.random() * 10,
  'AN-1032': 38 + Math.random() * 10,
  'AN-2045': 50 + Math.random() * 15,
}));

export function DeviceComparison() {
  const { showToast } = useIotStore();

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">Compare Devices</h1>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Comparing 3 selected devices side-by-side.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('Opening device selector...', 'info')} className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm">
            Add Device
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
        
        {/* Comparison Header Row */}
        <div className="grid grid-cols-4 bg-[var(--color-iot-surface)] border-b border-[var(--color-iot-border)]">
          <div className="p-4 border-r border-[var(--color-iot-border)]">
            <span className="text-[12px] font-bold text-[var(--color-iot-text-secondary)] uppercase">Attributes</span>
          </div>
          {['AN-1004', 'AN-1032', 'AN-2045'].map((id, idx) => (
            <div key={id} className={`p-4 ${idx < 2 ? 'border-r border-[var(--color-iot-border)]' : ''} relative group`}>
              <button onClick={() => showToast(`Removed ${id} from comparison`, 'info')} className="absolute top-2 right-2 text-[var(--color-iot-text-muted)] hover:text-[var(--color-iot-critical)] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              <h3 className="text-[15px] font-bold text-[var(--color-iot-text-primary)] mb-1">{id}</h3>
              <p className="text-[12px] text-[var(--color-iot-text-secondary)] font-mono mb-2">North Campus</p>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-iot-success)]/10 text-[var(--color-iot-success)] border border-[var(--color-iot-success)]/20">
                Healthy
              </span>
            </div>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[600px] scrollbar-thin divide-y divide-[var(--color-iot-border)]">
          
          {/* Key Metrics row */}
          <div className="grid grid-cols-4 hover:bg-[#F1F5F9]/50 transition-colors">
            <div className="p-4 border-r border-[var(--color-iot-border)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-iot-text-secondary)]" />
              <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">Firmware</span>
            </div>
            <div className="p-4 border-r border-[var(--color-iot-border)] text-[13px] font-mono">v2.3.9 <span className="text-[10px] text-[var(--color-iot-warning)] ml-2 border border-[var(--color-iot-warning)] rounded px-1">Update</span></div>
            <div className="p-4 border-r border-[var(--color-iot-border)] text-[13px] font-mono">v2.4.1</div>
            <div className="p-4 text-[13px] font-mono">v2.4.1</div>
          </div>

          <div className="grid grid-cols-4 hover:bg-[#F1F5F9]/50 transition-colors">
            <div className="p-4 border-r border-[var(--color-iot-border)] flex items-center gap-2">
              <Battery className="w-4 h-4 text-[var(--color-iot-text-secondary)]" />
              <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">Battery</span>
            </div>
            <div className="p-4 border-r border-[var(--color-iot-border)] text-[13px] font-bold text-[var(--color-iot-success)]">84%</div>
            <div className="p-4 border-r border-[var(--color-iot-border)] text-[13px] font-bold text-[var(--color-iot-success)]">92%</div>
            <div className="p-4 text-[13px] font-bold text-[var(--color-iot-warning)]">45%</div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-4">
            <div className="p-4 border-r border-[var(--color-iot-border)] flex flex-col gap-2 bg-[var(--color-iot-surface)]/50">
              <span className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">AQI Timeline</span>
              <span className="text-[11px] text-[var(--color-iot-text-secondary)]">24 hour trailing average</span>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono"><div className="w-2 h-2 rounded-full bg-[var(--color-iot-brand)]"></div> AN-1004</div>
                <div className="flex items-center gap-2 text-[11px] font-mono"><div className="w-2 h-2 rounded-full bg-[var(--color-iot-blue)]"></div> AN-1032</div>
                <div className="flex items-center gap-2 text-[11px] font-mono"><div className="w-2 h-2 rounded-full bg-[var(--color-iot-warning)]"></div> AN-2045</div>
              </div>
            </div>
            <div className="col-span-3 p-6">
              <LineChart 
                data={mockTimelineData} 
                xKey="time"
                height={250}
                series={[
                  { key: 'AN-1004', color: 'var(--color-iot-brand)' },
                  { key: 'AN-1032', color: 'var(--color-iot-blue)' },
                  { key: 'AN-2045', color: 'var(--color-iot-warning)' },
                ]}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
