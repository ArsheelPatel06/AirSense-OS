import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { AlertTriangle, Search, Filter, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIotStore } from '../context/IotContext';

export function AlertsCenter() {
  const navigate = useNavigate();
  const { state, showToast } = useIotStore();

  const incidents = state.activeIncidents.map(inc => ({
    id: inc.id,
    severity: inc.severity,
    title: inc.issueType,
    desc: `Affected device: ${inc.device}`,
    fleet: 'System', // Mocked fleet since it's not in base state
    time: inc.duration,
    status: 'Open',
    color: inc.severity === 'Critical' ? 'var(--color-iot-critical)' : 'var(--color-iot-warning)'
  }));

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500 pb-8">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">Alerts & Incidents</h1>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Manage system alerts, anomalies, and active investigations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('Exporting Alerts Logs...', 'info')} className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm">
            Export Logs
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-[var(--color-iot-text-secondary)] uppercase">Active Critical</span>
            <ShieldAlert className="w-4 h-4 text-[var(--color-iot-critical)]" />
          </div>
          <span className="text-3xl font-bold text-[var(--color-iot-text-primary)]">
            {incidents.filter(i => i.severity === 'Critical').length}
          </span>
        </div>
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-[var(--color-iot-text-secondary)] uppercase">Active Warning</span>
            <AlertTriangle className="w-4 h-4 text-[var(--color-iot-warning)]" />
          </div>
          <span className="text-3xl font-bold text-[var(--color-iot-text-primary)]">
            {incidents.filter(i => i.severity === 'Warning').length}
          </span>
        </div>
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-[var(--color-iot-text-secondary)] uppercase">MTTR (24h)</span>
            <Clock className="w-4 h-4 text-[var(--color-iot-blue)]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[var(--color-iot-text-primary)]">42</span>
            <span className="text-[13px] font-medium text-[var(--color-iot-text-secondary)] pb-1">mins</span>
          </div>
        </div>
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-[var(--color-iot-text-secondary)] uppercase">Resolved (7d)</span>
            <CheckCircle className="w-4 h-4 text-[var(--color-iot-success)]" />
          </div>
          <span className="text-3xl font-bold text-[var(--color-iot-text-primary)]">128</span>
        </div>
      </div>

      {/* Incident List */}
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden flex-1 flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-iot-text-muted)]" />
            <input 
              type="text" 
              placeholder="Search incidents by ID, fleet, or description..." 
              className="w-full bg-white border border-[var(--color-iot-border)] rounded-md py-1.5 pl-9 pr-4 text-[13px] focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)] shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter by Severity
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-iot-surface)]/50 border-b border-[var(--color-iot-border)] text-[11px] font-bold text-[var(--color-iot-text-secondary)] uppercase tracking-wider">
                <th className="px-6 py-4">Incident ID</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Affected Fleet</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Time Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-iot-border)]">
              {incidents.map((incident) => (
                <tr 
                  key={incident.id}
                  className="hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/iot/alerts/${incident.id}`)}
                >
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">{incident.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm`} style={{ backgroundColor: `color-mix(in srgb, ${incident.color} 10%, transparent)`, color: incident.color, borderColor: `color-mix(in srgb, ${incident.color} 20%, transparent)` }}>
                      {incident.severity === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-iot-critical)] animate-pulse"></span>}
                      {incident.severity === 'Warning' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-iot-warning)]"></span>}
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">{incident.title}</span>
                    <p className="text-[11px] text-[var(--color-iot-text-secondary)] mt-0.5">{incident.desc}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-[var(--color-iot-text-secondary)]">{incident.fleet}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[12px] font-medium ${incident.status === 'Open' ? 'text-amber-600' : 'text-slate-500'}`}>{incident.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">{incident.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
