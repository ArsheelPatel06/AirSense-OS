import { Activity, AlertTriangle, CheckCircle, MapPin, HardDrive, Filter, Download, Plus, RefreshCw, ChevronRight } from 'lucide-react';
import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { useIotStore } from '../context/IotContext';

export function FleetOverview() {
  const navigate = useNavigate();
  const { state, showToast, resolveIncident } = useIotStore();

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">Fleet Overview</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F1F5F9] rounded-full text-[10px] font-medium text-[var(--color-iot-text-secondary)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-iot-success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-iot-success)]"></span>
              </span>
              Last Updated: 12 sec ago
            </div>
          </div>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Monitor real-time health and status of your entire device fleet.</p>
          
          {/* Contextual Quick Actions (Below Title) */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button onClick={() => showToast('Opening Add Device dialog...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
              Add Device
            </button>
            <button onClick={() => showToast('Checking for firmware updates...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
              Update Firmware
            </button>
            <button onClick={() => showToast('Preparing data export...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
              Export Data
            </button>
          </div>
        </div>
        
        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('Toggling filters...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[13px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--color-iot-text-muted)]" />
            Filters
          </button>
        </div>
      </div>

      {/* 1. Fleet Health Overview (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        <div 
          onClick={() => navigate('/iot/devices')}
          className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[var(--color-iot-text-secondary)] group-hover:text-[var(--color-iot-text-primary)] transition-colors">Total Devices</span>
            <HardDrive className="w-4 h-4 text-[var(--color-iot-text-muted)] group-hover:text-[var(--color-iot-text-primary)] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">14,248</span>
              <span className="text-[11px] font-medium text-[var(--color-iot-success)] bg-[var(--color-iot-success)]/10 px-1.5 py-0.5 rounded-full">+12%</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--color-iot-border)] group-hover:text-[var(--color-iot-text-muted)] transition-colors" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/iot/devices?status=online')}
          className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-iot-success)]/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-iot-success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-iot-success)]"></span>
              </span>
              <span className="text-[13px] font-medium text-[var(--color-iot-text-secondary)] group-hover:text-[var(--color-iot-text-primary)] transition-colors">Online & Healthy</span>
            </div>
            <CheckCircle className="w-4 h-4 text-[var(--color-iot-success)] opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-baseline justify-between relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">13,902</span>
              <span className="text-[12px] font-medium text-[var(--color-iot-text-muted)]">97.5%</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--color-iot-border)] group-hover:text-[var(--color-iot-text-muted)] transition-colors" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/iot/devices?status=offline')}
          className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-iot-critical)]/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-iot-critical)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-iot-critical)]"></span>
              </span>
              <span className="text-[13px] font-medium text-[var(--color-iot-text-secondary)] group-hover:text-[var(--color-iot-text-primary)] transition-colors">Offline / Critical</span>
            </div>
            <AlertTriangle className="w-4 h-4 text-[var(--color-iot-critical)] opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-baseline justify-between relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">346</span>
              <span className="text-[12px] font-medium text-[var(--color-iot-text-muted)]">Attention</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--color-iot-border)] group-hover:text-[var(--color-iot-text-muted)] transition-colors" />
          </div>
        </div>

      </div>

      {/* AI Insight Card */}
      <div className="mb-8 bg-gradient-to-r from-[#EAF8EE] to-[#F0F9FF] rounded-lg border border-[var(--color-iot-brand)]/20 p-4 flex items-start gap-3 shadow-sm">
        <div className="w-8 h-8 bg-[var(--color-iot-brand)] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-iot-brand)]">AI Insight</span>
            <span className="text-[10px] text-[var(--color-iot-text-muted)] bg-white/60 px-1.5 py-0.5 rounded-full border border-[var(--color-iot-border)]">Live · Updated 12s ago</span>
          </div>
          <p className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">
            AI predicts <span className="font-bold text-[var(--color-iot-warning)]">14 batteries</span> will degrade below critical threshold within 30 days. Preventive replacement recommended for Fleet <span className="font-bold">SA-East</span>.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => navigate('/iot/devices?status=at-risk')} className="text-[12px] font-medium text-[var(--color-iot-brand)] hover:underline">View at-risk devices →</button>
            <button onClick={() => showToast('Insight dismissed')} className="text-[12px] text-[var(--color-iot-text-muted)] hover:text-[var(--color-iot-text-secondary)]">Dismiss</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 2. Global Map */}
        <div className="lg:col-span-2 bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--color-iot-border)] flex items-center justify-between bg-[var(--color-iot-surface)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-iot-text-secondary)]" />
              <h3 className="text-[13px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Geographic Distribution</h3>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-iot-text-secondary)]">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-iot-success)] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-iot-success)]"></span></span> 
                Online
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-iot-text-secondary)]">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-iot-critical)] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-iot-critical)]"></span></span> 
                Offline
              </span>
            </div>
          </div>
          <div className="w-full h-80 bg-[#E5E7EB]/20 relative flex items-center justify-center overflow-hidden">
            {/* Geometric Grid Map Placeholder - To be replaced by MapLibre */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(var(--color-iot-text-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Map clusters visualization */}
            <div className="absolute top-1/4 left-1/4 group cursor-pointer" onClick={() => navigate('/iot/fleets/NA-WEST')}>
              <div className="w-6 h-6 bg-[var(--color-iot-success)]/20 rounded-full flex items-center justify-center animate-pulse group-hover:scale-125 transition-transform">
                <div className="w-2 h-2 bg-[var(--color-iot-success)] rounded-full"></div>
              </div>
              <span className="absolute top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[var(--color-iot-text-secondary)] bg-[var(--color-iot-card)]/90 backdrop-blur px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">NA-WEST (3,200)</span>
            </div>
            
            <div className="absolute top-1/3 left-1/3 group cursor-pointer" onClick={() => navigate('/iot/fleets/NA-EAST')}>
              <div className="w-10 h-10 bg-[var(--color-iot-success)]/20 rounded-full flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform" style={{ animationDelay: '0.5s' }}>
                <div className="w-3 h-3 bg-[var(--color-iot-success)] rounded-full"></div>
              </div>
              <span className="absolute top-11 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[var(--color-iot-text-secondary)] bg-[var(--color-iot-card)]/90 backdrop-blur px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">NA-EAST (8,100)</span>
            </div>

            <div className="absolute top-1/2 right-1/3 group cursor-pointer" onClick={() => navigate('/iot/fleets/EU-CENTRAL')}>
              <div className="w-8 h-8 bg-[var(--color-iot-success)]/20 rounded-full flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform" style={{ animationDelay: '1s' }}>
                <div className="w-2.5 h-2.5 bg-[var(--color-iot-success)] rounded-full"></div>
              </div>
              <span className="absolute top-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[var(--color-iot-text-secondary)] bg-[var(--color-iot-card)]/90 backdrop-blur px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">EU-CENTRAL (2,400)</span>
            </div>

            <div className="absolute bottom-1/3 left-1/2 group cursor-pointer" onClick={() => navigate('/iot/fleets/SA-EAST')}>
              <div className="w-5 h-5 bg-[var(--color-iot-critical)]/20 rounded-full flex items-center justify-center animate-pulse group-hover:scale-125 transition-transform" style={{ animationDelay: '1.5s' }}>
                <div className="w-1.5 h-1.5 bg-[var(--color-iot-critical)] rounded-full"></div>
              </div>
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[var(--color-iot-critical)] bg-[var(--color-iot-card)]/90 backdrop-blur px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">SA-EAST (202 Offline)</span>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded shadow-sm text-[10px] text-[var(--color-iot-text-muted)] border border-[var(--color-iot-border)]">
              MapLibre Integration Pending
            </div>
          </div>
        </div>

        {/* 4. Firmware Version Distribution */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow flex flex-col cursor-pointer" onClick={() => navigate('/iot/firmware')}>
          <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-iot-text-secondary)]" />
            <h3 className="text-[13px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Firmware Distribution</h3>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center">
            <div className="mb-6 group">
              <div className="flex justify-between text-[13px] mb-2 font-medium">
                <span className="text-[var(--color-iot-text-primary)] group-hover:text-[var(--color-iot-brand)] transition-colors">v2.4.1 (Latest)</span>
                <span className="text-[var(--color-iot-text-secondary)]">78%</span>
              </div>
              <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 overflow-hidden">
                <div className="bg-[var(--color-iot-brand)] h-2 rounded-full transition-all duration-1000" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div className="mb-6 group">
              <div className="flex justify-between text-[13px] mb-2 font-medium">
                <span className="text-[var(--color-iot-text-primary)] group-hover:text-[var(--color-iot-blue)] transition-colors">v2.4.0</span>
                <span className="text-[var(--color-iot-text-secondary)]">15%</span>
              </div>
              <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 overflow-hidden">
                <div className="bg-[var(--color-iot-blue)] h-2 rounded-full transition-all duration-1000" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between text-[13px] mb-2 font-medium">
                <span className="text-[var(--color-iot-text-primary)] flex items-center gap-1.5 group-hover:text-[var(--color-iot-warning)] transition-colors">
                  v2.3.x (Legacy)
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--color-iot-warning)]/10 text-[var(--color-iot-warning)] uppercase tracking-wider">Update Req</span>
                </span>
                <span className="text-[var(--color-iot-text-secondary)]">7%</span>
              </div>
              <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-2 overflow-hidden">
                <div className="bg-[var(--color-iot-warning)] h-2 rounded-full transition-all duration-1000" style={{ width: '7%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Incidents List */}
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow overflow-hidden mb-8">
        <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--color-iot-text-secondary)]" />
            <h3 className="text-[13px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Active Critical Incidents</h3>
          </div>
          <span 
            onClick={() => navigate('/iot/alerts')}
            className="text-[12px] font-medium text-[var(--color-iot-brand)] cursor-pointer hover:underline flex items-center gap-1"
          >
            View All Incidents <ChevronRight className="w-3 h-3" />
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-iot-border)] bg-[var(--color-iot-bg)]/50 text-[11px] font-semibold text-[var(--color-iot-text-secondary)] uppercase tracking-wider">
                <th className="p-4 font-semibold">Incident ID</th>
                <th className="p-4 font-semibold">Severity</th>
                <th className="p-4 font-semibold">Device / Group</th>
                <th className="p-4 font-semibold">Issue Type</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {state.activeIncidents.map(inc => (
                <tr key={inc.id} className="border-b border-[var(--color-iot-border)] hover:bg-[#F1F5F9] transition-colors cursor-pointer group" onClick={() => navigate(`/iot/alerts/${inc.id}`)}>
                  <td className="p-4 font-mono text-[var(--color-iot-text-primary)] font-medium">{inc.id}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${inc.severity === 'Critical' ? 'bg-[var(--color-iot-critical)]/10 text-[var(--color-iot-critical)] border border-[var(--color-iot-critical)]/20' : 'bg-[var(--color-iot-warning)]/10 text-[var(--color-iot-warning)] border border-[var(--color-iot-warning)]/20'}`}>
                      {inc.severity === 'Critical' ? (
                        <><span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-iot-critical)] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-iot-critical)]"></span></span> Critical</>
                      ) : (
                        <><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-iot-warning)]"></span> Warning</>
                      )}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-iot-text-primary)] font-medium hover:text-[var(--color-iot-brand)] transition-colors">{inc.device}</td>
                  <td className="p-4 text-[var(--color-iot-text-secondary)]">{inc.issueType}</td>
                  <td className="p-4 text-[var(--color-iot-text-secondary)] font-mono text-[12px]">{inc.duration}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-3">
                    <button onClick={(e) => { e.stopPropagation(); resolveIncident(inc.id); }} className="text-[12px] font-medium text-[var(--color-iot-brand)] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Resolve</button>
                    <button className="text-[12px] font-medium text-[var(--color-iot-blue)] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Investigate</button>
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
