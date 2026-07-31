import { useState } from 'react';
import { 
  Search, Filter, Download, Plus, MoreVertical, Activity, 
  CheckCircle, AlertTriangle, Battery, Wifi, ChevronDown, 
  ChevronLeft, ChevronRight, HardDrive, RefreshCw
} from 'lucide-react';
import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';

import { useIotStore } from '../context/IotContext';

export function DeviceList() {
  const navigate = useNavigate();
  const { state, showToast, restartDevice, deleteDevice } = useIotStore();
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedDevices.size === state.devices.length) {
      setSelectedDevices(new Set());
    } else {
      setSelectedDevices(new Set(state.devices.map(d => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedDevices);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedDevices(next);
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">Devices</h1>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Manage and monitor all 14,248 registered devices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('Preparing CSV Export...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[13px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4 text-[var(--color-iot-text-muted)]" />
            Export CSV
          </button>
          <button onClick={() => showToast('Opening Provision Device dialog...', 'info')} className="px-3 py-1.5 bg-[var(--color-iot-brand)] text-white text-[13px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Provision Device
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-3 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-iot-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search devices by ID, name, or fleet..." 
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)] transition-shadow placeholder:text-[var(--color-iot-text-muted)] text-[var(--color-iot-text-primary)]"
              />
            </div>
            
            {/* Filters */}
            <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
              Filters
              <span className="w-4 h-4 rounded-full bg-[var(--color-iot-brand)] text-white text-[10px] flex items-center justify-center ml-1">2</span>
            </button>
            
            {/* Saved Views */}
            <button className="px-3 py-1.5 bg-transparent text-[var(--color-iot-text-secondary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] hover:text-[var(--color-iot-text-primary)] transition-colors flex items-center gap-1.5">
              Saved Views <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Bulk Actions (visible only when selected) */}
          {selectedDevices.size > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <span className="text-[12px] font-medium text-[var(--color-iot-text-secondary)] mr-2">
                {selectedDevices.size} selected
              </span>
              <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" /> Firmware
              </button>
              <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" /> Restart
              </button>
              <button 
                onClick={() => navigate('/iot/devices/compare')}
                className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5"
              >
                Compare
              </button>
              <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
                Assign Fleet
              </button>
              <div className="w-px h-4 bg-[var(--color-iot-border)] mx-1"></div>
              <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" /> Export
              </button>
              <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-critical)] text-[var(--color-iot-critical)] text-[12px] font-medium rounded hover:bg-red-50 transition-colors shadow-sm flex items-center gap-1.5">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-[var(--color-iot-surface)] border-b border-[var(--color-iot-border)] z-10">
              <tr className="text-[11px] font-semibold text-[var(--color-iot-text-secondary)] uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-[var(--color-iot-border)] text-[var(--color-iot-brand)] focus:ring-[var(--color-iot-brand)] w-3.5 h-3.5 cursor-pointer"
                    checked={selectedDevices.size === state.devices.length && state.devices.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Device ID / Name</th>
                <th className="p-3 font-semibold">Fleet</th>
                <th className="p-3 font-semibold">Firmware</th>
                <th className="p-3 font-semibold">Battery</th>
                <th className="p-3 font-semibold">Signal</th>
                <th className="p-3 font-semibold text-right">AQI</th>
                <th className="p-3 font-semibold text-right">PM2.5</th>
                <th className="p-3 font-semibold text-right">Env</th>
                <th className="p-3 font-semibold">Last Seen</th>
                <th className="p-3 font-semibold w-12"></th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-[var(--color-iot-border)]">
              {state.devices.map((device) => (
                <tr 
                  key={device.id} 
                  className={`group transition-colors cursor-pointer ${selectedDevices.has(device.id) ? 'bg-[var(--color-iot-brand)]/5' : 'hover:bg-[#F1F5F9]'}`}
                  onClick={(e) => {
                    // Prevent navigation if clicking checkbox or action button
                    if ((e.target as HTMLElement).closest('input[type="checkbox"]') || (e.target as HTMLElement).closest('button')) {
                      return;
                    }
                    navigate(`/iot/devices/${device.id}`);
                  }}
                >
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded border-[var(--color-iot-border)] text-[var(--color-iot-brand)] focus:ring-[var(--color-iot-brand)] w-3.5 h-3.5 cursor-pointer"
                      checked={selectedDevices.has(device.id)}
                      onChange={() => toggleSelect(device.id)}
                    />
                  </td>
                  
                  {/* Status */}
                  <td className="p-3">
                    {device.status === 'online' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-iot-success)]/10 text-[var(--color-iot-success)] border border-[var(--color-iot-success)]/20">
                        <CheckCircle className="w-3 h-3" /> Online
                      </span>
                    )}
                    {device.status === 'warning' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-iot-warning)]/10 text-[var(--color-iot-warning)] border border-[var(--color-iot-warning)]/20">
                        <AlertTriangle className="w-3 h-3" /> Warning
                      </span>
                    )}
                    {device.status === 'offline' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-iot-critical)]/10 text-[var(--color-iot-critical)] border border-[var(--color-iot-critical)]/20">
                        <AlertTriangle className="w-3 h-3" /> Offline
                      </span>
                    )}
                  </td>
                  
                  {/* Device Name */}
                  <td className="p-3">
                    <div className="font-medium text-[var(--color-iot-text-primary)] group-hover:text-[var(--color-iot-brand)] transition-colors">{device.name}</div>
                    <div className="text-[11px] text-[var(--color-iot-text-secondary)] font-mono">{device.id}</div>
                  </td>
                  
                  {/* Fleet */}
                  <td className="p-3">
                    <span 
                      className="text-[var(--color-iot-text-primary)] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/iot/fleets/FLT-NC-9021'); // Mock fleet nav
                      }}
                    >
                      {device.fleet}
                    </span>
                  </td>
                  
                  {/* Firmware */}
                  <td className="p-3">
                    <span className={`text-[12px] font-mono ${device.firmware === 'v2.4.1' ? 'text-[var(--color-iot-text-secondary)]' : 'text-[var(--color-iot-warning)]'}`}>
                      {device.firmware}
                    </span>
                  </td>
                  
                  {/* Battery */}
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Battery className={`w-3.5 h-3.5 ${device.battery > 20 ? 'text-[var(--color-iot-success)]' : 'text-[var(--color-iot-critical)]'}`} />
                      <span className={`text-[12px] ${device.battery > 20 ? 'text-[var(--color-iot-text-primary)]' : 'text-[var(--color-iot-critical)] font-bold'}`}>
                        {device.battery}%
                      </span>
                    </div>
                  </td>
                  
                  {/* Signal */}
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Wifi className={`w-3.5 h-3.5 ${device.signal < 0 ? 'text-[var(--color-iot-success)]' : 'text-[var(--color-iot-text-disabled)]'}`} />
                      <span className="text-[12px] text-[var(--color-iot-text-primary)] font-mono">{device.signal} dBm</span>
                    </div>
                  </td>
                  
                  {/* AQI & Telemetry */}
                  <td className="p-3 text-right font-mono text-[var(--color-iot-text-primary)]">{device.aqi}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-iot-text-secondary)]">{device.pm25}</td>
                  <td className="p-3 text-right font-mono text-[11px] text-[var(--color-iot-text-secondary)]">
                    {device.temp}°C / {device.humidity}%
                  </td>
                  
                  {/* Last Seen */}
                  <td className="p-3 text-[12px] text-[var(--color-iot-text-secondary)]">
                    {device.lastSeen}
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="text-[11px] font-medium text-[var(--color-iot-blue)] hover:underline"
                        onClick={(e) => { e.stopPropagation(); restartDevice(device.id); }}
                      >
                        Restart
                      </button>
                      <button 
                        className="text-[11px] font-medium text-[var(--color-iot-critical)] hover:underline"
                        onClick={(e) => { e.stopPropagation(); deleteDevice(device.id); }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex items-center justify-between">
          <span className="text-[12px] text-[var(--color-iot-text-secondary)]">
            Showing <span className="font-medium text-[var(--color-iot-text-primary)]">1</span> to <span className="font-medium text-[var(--color-iot-text-primary)]">{state.devices.length}</span> of <span className="font-medium text-[var(--color-iot-text-primary)]">{state.devices.length}</span> devices
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-[var(--color-iot-border)] bg-white text-[var(--color-iot-text-muted)] disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded border border-[var(--color-iot-border)] bg-white text-[var(--color-iot-text-primary)] hover:bg-[#F1F5F9]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
