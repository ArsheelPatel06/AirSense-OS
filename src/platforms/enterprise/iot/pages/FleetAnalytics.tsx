import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { Activity, ShieldAlert, Cpu, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { AreaChart, BarChart } from '../../../../shared/runtime/chart';
import { useNavigate } from 'react-router-dom';

const mockHealthData = Array.from({ length: 14 }).map((_, i) => ({
  date: `May ${i + 1}`,
  health: 92 + Math.sin(i) * 5 + Math.random() * 2,
}));

const mockIncidentData = [
  { severity: 'Critical', count: 4, color: 'var(--color-iot-critical)' },
  { severity: 'Warning', count: 18, color: 'var(--color-iot-warning)' },
  { severity: 'Resolved', count: 42, color: 'var(--color-iot-success)' },
];

export function FleetAnalytics() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500 pb-8">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">Fleet Analytics</h1>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Global fleet performance, AI predictions, and incident trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" /> Last 30 Days
          </button>
          <button className="px-3 py-1.5 bg-[var(--color-iot-brand)] text-white text-[12px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* AI Insight Box */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-lg border border-[#DBEAFE] shadow-sm p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Predictive Insights</h3>
              </div>
              <p className="text-[14px] leading-relaxed text-[var(--color-iot-text-primary)] mb-4">
                Fleet health is trending positively (up 2.4% this week). However, analysis of battery discharge curves across the <span className="font-semibold">Downtown Hub</span> fleet indicates 14 sensors will require replacement within 30 days. Recommend preemptive maintenance schedule.
              </p>
              <button className="text-[13px] font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors shadow-sm">
                Schedule Maintenance
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur rounded-lg border border-white/40 p-4">
                <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)]">Uptime Forecast</span>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">99.98%</span>
                  <span className="text-[11px] font-medium text-[var(--color-iot-success)] flex items-center mb-1"><TrendingUp className="w-3 h-3 mr-0.5" /> 0.02%</span>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg border border-white/40 p-4">
                <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)]">Est. Battery Failure</span>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">14</span>
                  <span className="text-[11px] font-medium text-[var(--color-iot-text-secondary)] mb-1">nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Health Trend */}
        <div className="lg:col-span-2 bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Global Fleet Health Index
            </h3>
            <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">30-Day Trend</span>
          </div>
          <AreaChart 
            data={mockHealthData} 
            xKey="date" 
            height={250}
            series={[{ key: 'health', name: 'Health Score', color: 'var(--color-iot-brand)' }]}
          />
        </div>

        {/* Incident Distribution */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Incident Severity
            </h3>
          </div>
          <BarChart 
            data={mockIncidentData}
            xKey="severity"
            height={250}
            series={[{ key: 'count', name: 'Incidents', color: 'var(--color-iot-blue)' }]}
          />
        </div>

      </div>

      {/* Alerts & Incidents Table */}
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden mt-2">
        <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--color-iot-text-secondary)]" /> Active Alerts & Incidents
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm">
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-iot-surface)]/50 border-b border-[var(--color-iot-border)] text-[11px] font-bold text-[var(--color-iot-text-secondary)] uppercase tracking-wider">
                <th className="px-6 py-4">Incident ID</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Affected Fleet</th>
                <th className="px-6 py-4 text-right">Time Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-iot-border)]">
              <tr 
                className="hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer"
                onClick={() => navigate('/iot/alerts/INC-9821')}
              >
                <td className="px-6 py-4">
                  <span className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">INC-9821</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--color-iot-critical)]/10 text-[var(--color-iot-critical)] border border-[var(--color-iot-critical)]/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-iot-critical)] animate-pulse"></span> Critical
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">Multiple Nodes Offline</span>
                  <p className="text-[11px] text-[var(--color-iot-text-secondary)] mt-0.5">12 nodes lost connection to gateway.</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] text-[var(--color-iot-text-secondary)]">North Campus</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">12 min ago</span>
                </td>
              </tr>

              <tr 
                className="hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer"
                onClick={() => navigate('/iot/alerts/INC-9822')}
              >
                <td className="px-6 py-4">
                  <span className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">INC-9822</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--color-iot-warning)]/10 text-[var(--color-iot-warning)] border border-[var(--color-iot-warning)]/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-iot-warning)]"></span> Warning
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">High Humidity Detected</span>
                  <p className="text-[11px] text-[var(--color-iot-text-secondary)] mt-0.5">Readings exceed 65% threshold.</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] text-[var(--color-iot-text-secondary)]">Downtown Hub</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">1 hour ago</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
