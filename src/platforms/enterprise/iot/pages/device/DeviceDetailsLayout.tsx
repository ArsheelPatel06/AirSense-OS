import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { Battery, Wifi, HardDrive, CheckCircle, MoreVertical, RefreshCw, Activity, ShieldCheck, Settings, Clock, List } from 'lucide-react';
import { useIotStore } from '../../context/IotContext';

export function DeviceDetailsLayout() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { state, restartDevice } = useIotStore();
  
  const device = state.devices.find(d => d.id === deviceId);
  const isCritical = device?.status === 'offline';
  const isWarning = device?.status === 'warning';
  
  const statusInfo = isCritical 
    ? { text: 'Offline', color: 'var(--color-iot-critical)', bg: 'var(--color-iot-critical)' }
    : isWarning 
      ? { text: 'Warning', color: 'var(--color-iot-warning)', bg: 'var(--color-iot-warning)' }
      : { text: 'Healthy', color: 'var(--color-iot-success)', bg: 'var(--color-iot-success)' };

  const navItems = [
    { name: 'Overview', path: `/iot/devices/${deviceId}`, exact: true, icon: Activity },
    { name: 'Telemetry', path: `/iot/devices/${deviceId}/telemetry`, exact: false, icon: Activity },
    { name: 'Firmware', path: `/iot/devices/${deviceId}/firmware`, exact: false, icon: HardDrive },
    { name: 'Diagnostics', path: `/iot/devices/${deviceId}/diagnostics`, exact: false, icon: ShieldCheck },
    { name: 'Configuration', path: `/iot/devices/${deviceId}/configuration`, exact: false, icon: Settings },
    { name: 'History', path: `/iot/devices/${deviceId}/history`, exact: false, icon: Clock },
  ];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Device Header */}
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] mb-6">
        <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${statusInfo.bg} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${statusInfo.color} 20%, transparent)` }}>
              <Activity className="w-6 h-6" style={{ color: statusInfo.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">{device?.name || 'Unknown Device'}</h1>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" 
                     style={{ backgroundColor: `color-mix(in srgb, ${statusInfo.bg} 10%, transparent)`, color: statusInfo.color, border: `1px solid color-mix(in srgb, ${statusInfo.color} 20%, transparent)` }}>
                  <span className="relative flex h-1.5 w-1.5">
                    {!isCritical && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: statusInfo.color }}></span>}
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: statusInfo.color }}></span>
                  </span>
                  {statusInfo.text} · {isCritical ? 'Offline' : 'Online'}
                </div>
              </div>
              {/* Contextual Metadata Row */}
              <div className="flex items-center gap-3 flex-wrap text-[12px] text-[var(--color-iot-text-secondary)]">
                <span className="font-mono text-[var(--color-iot-text-muted)]">{deviceId}</span>
                <span className="text-[var(--color-iot-border)]">·</span>
                <span className="flex items-center gap-1">📍 {device?.fleet || 'Unknown'}</span>
                <span className="text-[var(--color-iot-border)]">·</span>
                <span className="flex items-center gap-1">🔗 Gateway NC-02</span>
                <span className="text-[var(--color-iot-border)]">·</span>
                <span className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    {!isCritical && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-iot-success)] opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isCritical ? 'bg-[var(--color-iot-critical)]' : 'bg-[var(--color-iot-success)]'}`}></span>
                  </span>
                  Last Seen {device?.lastSeen || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Header Metrics */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <Battery className={`w-4 h-4 ${isCritical ? 'text-[var(--color-iot-critical)]' : 'text-[var(--color-iot-success)]'}`} />
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-iot-text-disabled)] uppercase tracking-wider">Battery</p>
                <p className="text-[13px] font-semibold text-[var(--color-iot-text-primary)]">{device?.battery ?? 0}%</p>
              </div>
            </div>
            <div className="w-px h-8 bg-[var(--color-iot-border)]"></div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[var(--color-iot-text-muted)]" />
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-iot-text-disabled)] uppercase tracking-wider">Firmware</p>
                <p className="text-[13px] font-semibold text-[var(--color-iot-text-primary)]">{device?.firmware || 'Unknown'}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-[var(--color-iot-border)]"></div>
            <div className="flex items-center gap-2">
              <Wifi className={`w-4 h-4 ${isCritical ? 'text-[var(--color-iot-text-disabled)]' : 'text-[var(--color-iot-success)]'}`} />
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-iot-text-disabled)] uppercase tracking-wider">Signal</p>
                <p className="text-[13px] font-semibold text-[var(--color-iot-text-primary)] font-mono">{device?.signal ?? 'N/A'} dBm</p>
              </div>
            </div>
            <div className="w-px h-8 bg-[var(--color-iot-border)]"></div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-[var(--color-iot-info)] text-center leading-none font-bold text-[11px]">AQ</div>
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-iot-text-disabled)] uppercase tracking-wider">AQI</p>
                <p className={`text-[13px] font-semibold ${isCritical ? 'text-[var(--color-iot-text-muted)]' : 'text-[var(--color-iot-success)]'}`}>{device?.aqi ?? 'N/A'}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-[var(--color-iot-border)]"></div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center text-[var(--color-iot-text-muted)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v6m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-iot-text-disabled)] uppercase tracking-wider">Temp</p>
                <p className="text-[13px] font-semibold text-[var(--color-iot-text-primary)]">{device?.temp ?? 'N/A'}°C</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-1">
              <button 
                onClick={() => deviceId && restartDevice(deviceId)}
                className="px-3 py-1.5 bg-[var(--color-iot-card)] border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[var(--color-iot-text-muted)]" />
                Restart
              </button>
              <button 
                onClick={() => navigate(`/iot/devices/${deviceId}/diagnostics`)}
                className="px-3 py-1.5 bg-[var(--color-iot-brand)] text-white text-[12px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors shadow-sm flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Diagnostics
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-5 border-t border-[var(--color-iot-border)] flex overflow-x-auto scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-3 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors
                ${isActive 
                  ? 'border-[var(--color-iot-brand)] text-[var(--color-iot-brand)]' 
                  : 'border-transparent text-[var(--color-iot-text-secondary)] hover:text-[var(--color-iot-text-primary)] hover:border-[var(--color-iot-border)]'
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* Tab Content Outlet */}
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
