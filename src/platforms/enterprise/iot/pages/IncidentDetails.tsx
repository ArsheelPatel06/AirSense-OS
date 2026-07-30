import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { useParams, useNavigate } from 'react-router-dom';
import { useIotStore } from '../context/IotContext';

export function IncidentDetails() {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const { state, resolveIncident, showToast } = useIotStore();

  const incident = state.activeIncidents.find(i => i.id === incidentId);
  const isCritical = incident?.severity === 'Critical';

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500 pb-8">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${isCritical ? 'bg-[var(--color-iot-critical)]/10 text-[var(--color-iot-critical)] border-[var(--color-iot-critical)]/20' : 'bg-[var(--color-iot-warning)]/10 text-[var(--color-iot-warning)] border-[var(--color-iot-warning)]/20'} border shadow-sm`}>
              {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-iot-critical)] animate-pulse"></span>}
              {incident?.severity || 'Warning'}
            </span>
            <span className="text-[13px] font-mono text-[var(--color-iot-text-secondary)]">{incidentId}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">{incident?.issueType || 'Unknown Incident'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('Incident Acknowledged', 'info')} className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm">
            Acknowledge
          </button>
          <button 
            onClick={() => {
              if (incidentId) {
                resolveIncident(incidentId);
                navigate('/iot/alerts');
              }
            }}
            className="px-3 py-1.5 bg-[var(--color-iot-brand)] text-white text-[12px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Resolve Incident
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Affected Devices */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Summary Box */}
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-6">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] mb-4">Incident Summary</h3>
            <p className="text-[14px] leading-relaxed text-[var(--color-iot-text-primary)] mb-6">
              Affected device/fleet: <span className="font-semibold">{incident?.device}</span>.
              This issue was detected automatically by the monitoring engine.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-[var(--color-iot-border)]">
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-iot-text-secondary)] uppercase tracking-wider mb-1">Status</span>
                <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">Open (Unacknowledged)</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-iot-text-secondary)] uppercase tracking-wider mb-1">Time Detected</span>
                <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">Today, 14:30 PM</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-iot-text-secondary)] uppercase tracking-wider mb-1">Duration</span>
                <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">{incident?.duration || 'Unknown'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[var(--color-iot-text-secondary)] uppercase tracking-wider mb-1">Assignee</span>
                <span className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">Unassigned</span>
              </div>
            </div>
          </div>

          {/* Affected Devices */}
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex justify-between items-center">
              <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--color-iot-text-secondary)]" /> Affected Devices (12)
              </h3>
              <button 
                onClick={() => navigate('/iot/devices?status=offline')}
                className="text-[12px] text-[var(--color-iot-brand)] cursor-pointer hover:underline font-medium"
              >
                View in Device List
              </button>
            </div>
            <div className="divide-y divide-[var(--color-iot-border)]">
              {['AN-1004', 'AN-1005', 'AN-1008', 'AN-1012'].map((device) => (
                <div key={device} className="p-4 hover:bg-[#F1F5F9] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-iot-critical)]"></div>
                    <div>
                      <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">{device}</p>
                      <p className="text-[11px] text-[var(--color-iot-text-secondary)]">Last seen: 14:30 PM</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/iot/devices/${device}`)}
                    className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[11px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm"
                  >
                    Diagnose
                  </button>
                </div>
              ))}
              <div className="p-3 text-center bg-[#F8FAFC]">
                <span className="text-[12px] text-[var(--color-iot-text-secondary)] font-medium">8 more devices affected...</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: AI Analysis & Timeline */}
        <div className="flex flex-col gap-6">
          
          {/* AI Root Cause Analysis */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-lg border border-[#DBEAFE] shadow-sm p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-[13px] font-bold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Root Cause Analysis</h3>
              </div>
              
              <p className="text-[13px] leading-relaxed text-[var(--color-iot-text-primary)] mb-4">
                Analysis of gateway logs indicates <span className="font-semibold">Gateway NC-02</span> is still connected and routing traffic for other sub-networks. The simultaneous failure of exactly 12 nodes on the same 900MHz frequency band highly suggests <span className="font-semibold text-[var(--color-iot-critical)]">localized RF interference</span> or a <span className="font-semibold text-[var(--color-iot-critical)]">power failure</span> in Building C, Wing 4.
              </p>
              
              <div className="bg-white/60 backdrop-blur rounded border border-white/40 p-3 mt-4">
                <span className="block text-[11px] font-bold text-[var(--color-iot-text-secondary)] uppercase tracking-wider mb-2">Recommended Actions</span>
                <ul className="text-[12px] text-[var(--color-iot-text-primary)] space-y-2 list-disc list-inside">
                  <li>Dispatch technician to Building C, Wing 4 to check local power.</li>
                  <li>Verify if new RF-emitting equipment was installed nearby today.</li>
                  <li>Attempt to issue a remote channel hop command to Gateway NC-02.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
              <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-iot-text-secondary)]" /> Investigation Timeline
              </h3>
            </div>
            <div className="p-5 relative">
              <div className="absolute left-[27px] top-5 bottom-5 w-px bg-[var(--color-iot-border)]"></div>
              
              <div className="relative pl-10 mb-6">
                <div className="absolute left-[3px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--color-iot-critical)] ring-4 ring-[var(--color-iot-critical)]/20 z-10"></div>
                <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Incident Created</p>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">Anomaly detected by Watchdog service. 12 nodes dropped.</p>
                <span className="text-[11px] text-[var(--color-iot-text-muted)] block mt-1.5 font-mono">14:32 PM</span>
              </div>
              
              <div className="relative pl-10 mb-6">
                <div className="absolute left-[3px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--color-iot-blue)] ring-4 ring-white border border-[var(--color-iot-border)] z-10"></div>
                <p className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Automated Ping</p>
                <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-0.5">System attempted to ping Gateway NC-02. Gateway responded (latency 45ms).</p>
                <span className="text-[11px] text-[var(--color-iot-text-muted)] block mt-1.5 font-mono">14:35 PM</span>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-[-2px] top-0 w-5 h-5 rounded-full bg-white border border-[var(--color-iot-border)] z-10 flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-[var(--color-iot-text-secondary)]" />
                </div>
                <div className="bg-[#F8FAFC] border border-[var(--color-iot-border)] rounded-lg p-3">
                  <p className="text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-1">Jane Doe <span className="font-normal text-[var(--color-iot-text-muted)] ml-2">14:50 PM</span></p>
                  <p className="text-[12px] text-[var(--color-iot-text-secondary)]">I'm sending a technician over to Building C to check the breaker panel. They were doing electrical work earlier today.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add a comment or update..." 
                  className="flex-1 bg-white border border-[var(--color-iot-border)] rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-[var(--color-iot-brand)]"
                />
                <button className="px-3 py-1.5 bg-[var(--color-iot-brand)] text-white text-[12px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
