import { Activity, AlertTriangle, Battery, MapPin, Wifi, Settings, Edit, Plus, Download, HardDrive, CheckCircle, ChevronRight, Clock, ShieldCheck, Trash2 } from 'lucide-react';
import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { useIotStore } from '../context/IotContext';

export function FleetDetails() {
  const navigate = useNavigate();
  const { showToast } = useIotStore();

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">North Campus Fleet</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--color-iot-success)]/10 rounded-md text-[10px] font-bold text-[var(--color-iot-success)] uppercase tracking-wider border border-[var(--color-iot-success)]/20">
              Healthy
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F1F5F9] rounded-full text-[10px] font-medium text-[var(--color-iot-text-secondary)]">
              Last Sync: 18 sec ago
            </div>
          </div>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1 flex items-center gap-2">
            <span className="font-semibold text-[var(--color-iot-text-primary)]">148 Devices</span> • ID: FLT-NC-9021 • Region: US-East
          </p>
          
          {/* Contextual Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button onClick={() => showToast('Opening fleet editor...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
              Edit Fleet
            </button>
            <button 
              onClick={() => navigate('/iot/devices')}
              className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <HardDrive className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
              View All Devices
            </button>
          </div>
        </div>
        
        {/* Primary Actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('Preparing fleet export...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[13px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center gap-2">
            <Download className="w-4 h-4 text-[var(--color-iot-text-muted)]" />
            Export
          </button>
          <button onClick={() => showToast('Opening Provision Device dialog...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-brand)] text-white text-[13px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Device
          </button>
          <button onClick={() => navigate('/iot/settings')} className="p-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-muted)] rounded hover:text-[var(--color-iot-text-primary)] hover:bg-[#F1F5F9] transition-colors shadow-sm">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Left Column (3 spans): Main Metrics */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Row: Mini Map & Quick Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-md transition-shadow overflow-hidden flex flex-col h-64">
              <div className="p-3 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-iot-text-secondary)]" />
                  <h3 className="text-[12px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Campus Map</h3>
                </div>
              </div>
              <div className="flex-1 bg-[#E5E7EB]/20 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(var(--color-iot-text-primary) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                {/* Simulated campus clusters */}
                <div className="absolute top-1/4 left-1/3">
                  <div className="w-4 h-4 bg-[var(--color-iot-success)]/20 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-1.5 h-1.5 bg-[var(--color-iot-success)] rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-1/3 right-1/4">
                  <div className="w-6 h-6 bg-[var(--color-iot-success)]/20 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '0.3s' }}>
                    <div className="w-2 h-2 bg-[var(--color-iot-success)] rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-1/4 left-1/2">
                  <div className="w-5 h-5 bg-[var(--color-iot-warning)]/20 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '0.6s' }}>
                    <div className="w-2 h-2 bg-[var(--color-iot-warning)] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)]">Avg Battery</span>
                  <Battery className="w-4 h-4 text-[var(--color-iot-success)]" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">86%</span>
                  <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-1">3 devices &lt; 20%</p>
                </div>
              </div>
              <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)]">Connectivity</span>
                  <Wifi className="w-4 h-4 text-[var(--color-iot-success)]" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">99.1%</span>
                  <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-1">Avg RSSI: -65dBm</p>
                </div>
              </div>
              <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)]">Firmware</span>
                  <HardDrive className="w-4 h-4 text-[var(--color-iot-text-muted)]" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">100%</span>
                  <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-1">v2.4.1 compliance</p>
                </div>
              </div>
              <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between cursor-pointer hover:border-[var(--color-iot-warning)] transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)] group-hover:text-[var(--color-iot-warning)] transition-colors">Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-[var(--color-iot-warning)]" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-[var(--color-iot-text-primary)]">2</span>
                  <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-1">Active warnings</p>
                </div>
              </div>
            </div>

          </div>

          {/* Categories & Firmware */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Device Categories */}
            <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="p-3 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
                <h3 className="text-[12px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Device Types</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between text-[12px] mb-1 font-medium text-[var(--color-iot-text-primary)]">
                    <span>Air Quality Nodes</span>
                    <span>112</span>
                  </div>
                  <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-1.5">
                    <div className="bg-[var(--color-iot-brand)] h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] mb-1 font-medium text-[var(--color-iot-text-primary)]">
                    <span>Weather Stations</span>
                    <span>24</span>
                  </div>
                  <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-1.5">
                    <div className="bg-[var(--color-iot-blue)] h-1.5 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] mb-1 font-medium text-[var(--color-iot-text-primary)]">
                    <span>Gateways</span>
                    <span>12</span>
                  </div>
                  <div className="w-full bg-[var(--color-iot-bg)] rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '9%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts specific to Fleet */}
            <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="p-3 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex justify-between items-center">
                <h3 className="text-[12px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Recent Alerts</h3>
                <span className="text-[11px] text-[var(--color-iot-brand)] cursor-pointer hover:underline">View All</span>
              </div>
              <div className="p-0">
                <div className="p-3 border-b border-[var(--color-iot-border)] hover:bg-[#F1F5F9] transition-colors cursor-pointer flex gap-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--color-iot-warning)]"></div>
                  <div>
                    <p className="text-[12px] font-medium text-[var(--color-iot-text-primary)] leading-tight mb-0.5">Low Battery Warning</p>
                    <p className="text-[11px] text-[var(--color-iot-text-secondary)]">Node-NC-44 • 14 mins ago</p>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#F1F5F9] transition-colors cursor-pointer flex gap-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--color-iot-warning)]"></div>
                  <div>
                    <p className="text-[12px] font-medium text-[var(--color-iot-text-primary)] leading-tight mb-0.5">Signal Interference Detected</p>
                    <p className="text-[11px] text-[var(--color-iot-text-secondary)]">Gateway-NC-02 • 1 hr ago</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (1 span): Timeline & Admin Actions */}
        <div className="space-y-6">
          
          {/* Recent Activity Timeline */}
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="p-3 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
              <h3 className="text-[12px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Activity Timeline</h3>
            </div>
            <div className="p-4 relative">
              <div className="absolute left-[23px] top-4 bottom-4 w-px bg-[var(--color-iot-border)]"></div>
              
              <div className="relative pl-8 mb-6">
                <div className="absolute left-[-1px] w-5 h-5 rounded-full bg-[var(--color-iot-bg)] border border-[var(--color-iot-border)] flex items-center justify-center text-[var(--color-iot-text-muted)] z-10">
                  <HardDrive className="w-3 h-3" />
                </div>
                <p className="text-[12px] font-medium text-[var(--color-iot-text-primary)]">Firmware Update Completed</p>
                <p className="text-[11px] text-[var(--color-iot-text-secondary)] mt-0.5">All 148 devices updated to v2.4.1</p>
                <span className="text-[10px] text-[var(--color-iot-text-muted)] block mt-1">Today, 09:41 AM</span>
              </div>
              
              <div className="relative pl-8 mb-6">
                <div className="absolute left-[-1px] w-5 h-5 rounded-full bg-[var(--color-iot-bg)] border border-[var(--color-iot-border)] flex items-center justify-center text-[var(--color-iot-success)] z-10">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <p className="text-[12px] font-medium text-[var(--color-iot-text-primary)]">Maintenance Complete</p>
                <p className="text-[11px] text-[var(--color-iot-text-secondary)] mt-0.5">Filter replacement for 12 nodes.</p>
                <span className="text-[10px] text-[var(--color-iot-text-muted)] block mt-1">Yesterday, 14:30 PM</span>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-[-1px] w-5 h-5 rounded-full bg-[var(--color-iot-bg)] border border-[var(--color-iot-border)] flex items-center justify-center text-[var(--color-iot-text-muted)] z-10">
                  <Plus className="w-3 h-3" />
                </div>
                <p className="text-[12px] font-medium text-[var(--color-iot-text-primary)]">Devices Provisioned</p>
                <p className="text-[11px] text-[var(--color-iot-text-secondary)] mt-0.5">4 new Air Quality Nodes added.</p>
                <span className="text-[10px] text-[var(--color-iot-text-muted)] block mt-1">Jul 20, 10:15 AM</span>
              </div>
            </div>
          </div>

          {/* Maintenance Schedule */}
          <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="p-3 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
              <h3 className="text-[12px] font-semibold text-[var(--color-iot-text-primary)] uppercase tracking-wide">Next Maintenance</h3>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F1F5F9] rounded text-[var(--color-iot-text-primary)]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[var(--color-iot-text-primary)]">Routine Calibration</p>
                  <p className="text-[12px] text-[var(--color-iot-text-secondary)] mt-1">Scheduled for Aug 15, 2026</p>
                  <button className="mt-3 text-[11px] font-medium text-[var(--color-iot-brand)] hover:underline">Reschedule</button>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white rounded-lg border border-[var(--color-iot-border)] p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <button className="w-full text-left px-3 py-2 text-[12px] font-medium text-[var(--color-iot-text-primary)] hover:bg-[#F1F5F9] rounded flex items-center gap-2">
              <Edit className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" /> Rename Fleet
            </button>
            <button className="w-full text-left px-3 py-2 text-[12px] font-medium text-[var(--color-iot-text-primary)] hover:bg-[#F1F5F9] rounded flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" /> Bulk Firmware Update
            </button>
            <div className="my-1 border-t border-[var(--color-iot-border)]"></div>
            <button className="w-full text-left px-3 py-2 text-[12px] font-medium text-[var(--color-iot-critical)] hover:bg-red-50 rounded flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Delete Fleet
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
