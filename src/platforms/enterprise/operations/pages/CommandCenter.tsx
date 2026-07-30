import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, AlertTriangle, Cpu, Wifi, Wind, Thermometer,
  ShieldAlert, CheckCircle, Radio, RefreshCw, Settings,
  Bell, Map, TrendingUp, TrendingDown, Zap, Eye
} from 'lucide-react';

// ─── Mock Live Data ─────────────────────────────────────────────────────────

const incidents = [
  { id: 'INC-9821', severity: 'critical', location: 'SA-East Gateway', title: 'Connection Timeout', duration: '45m', devices: 14 },
  { id: 'INC-9820', severity: 'warning', location: 'EU-Central Node', title: 'Battery < 5%', duration: '2h 15m', devices: 3 },
  { id: 'INC-9818', severity: 'warning', location: 'NA-East Cluster', title: 'High Latency (840ms)', duration: '4h 30m', devices: 32 },
  { id: 'INC-9815', severity: 'info', location: 'North Campus', title: 'Firmware OTA Pending', duration: '1d 2h', devices: 87 },
];

const liveAQI = [
  { zone: 'North Campus', aqi: 38, trend: 'down', status: 'Good' },
  { zone: 'East Campus', aqi: 55, trend: 'stable', status: 'Moderate' },
  { zone: 'Industrial Zone', aqi: 89, trend: 'up', status: 'Moderate' },
  { zone: 'SA-East', aqi: 124, trend: 'up', status: 'Unhealthy' },
];

const systemStatus = [
  { name: 'MQTT Broker', status: 'operational', latency: '12ms' },
  { name: 'Time Series DB', status: 'operational', latency: '8ms' },
  { name: 'Alert Engine', status: 'operational', latency: '3ms' },
  { name: 'AI Pipeline', status: 'degraded', latency: '340ms' },
  { name: 'Gateway NC-02', status: 'operational', latency: '24ms' },
  { name: 'Webhook Relay', status: 'operational', latency: '15ms' },
];

const activityFeed = [
  { time: '17:21:04', type: 'alert', msg: 'INC-9821 escalated to Critical — SA-East Gateway' },
  { time: '17:20:47', type: 'device', msg: 'AN-2041 came online after 3h 12m offline' },
  { time: '17:19:30', type: 'firmware', msg: 'OTA v2.4.1 deployed to 87 devices in North Campus' },
  { time: '17:18:12', type: 'ai', msg: 'AI flagged anomalous PM2.5 spike in Industrial Zone' },
  { time: '17:16:55', type: 'alert', msg: 'INC-9818 acknowledged by ops-team@acme.com' },
  { time: '17:15:02', type: 'device', msg: 'Gateway EU-01 heartbeat restored' },
  { time: '17:13:44', type: 'ai', msg: 'Predictive model updated: 14 batteries at risk in 30d' },
  { time: '17:11:20', type: 'device', msg: 'AN-1007 diagnostics auto-triggered (CPU >90%)' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function KPITile({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string; sub?: string; icon: any; color: string; trend?: 'up' | 'down' | 'stable';
}) {
  return (
    <div className="bg-[#0F1729] border border-[#1E2D4A] rounded-lg p-4 flex items-center gap-4 hover:border-[#2D4A6E] transition-colors">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{value}</span>
          {sub && <span className="text-[11px] text-slate-400">{sub}</span>}
          {trend && (
            trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-400" /> :
            trend === 'down' ? <TrendingDown className="w-3 h-3 text-red-400" /> : null
          )}
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    info: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${map[severity] ?? map.info}`}>
      {severity === 'critical' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400"></span>
        </span>
      )}
      {severity}
    </span>
  );
}

function FeedIcon({ type }: { type: string }) {
  const map: Record<string, { icon: any; color: string }> = {
    alert: { icon: AlertTriangle, color: '#F87171' },
    device: { icon: Cpu, color: '#34D399' },
    firmware: { icon: RefreshCw, color: '#60A5FA' },
    ai: { icon: Zap, color: '#A78BFA' },
  };
  const { icon: Icon, color } = map[type] ?? map.device;
  return <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />;
}

// ─── Map Placeholder ──────────────────────────────────────────────────────────

function GISMapCanvas() {
  return (
    <div className="relative w-full h-full bg-[#080D1A] overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#4A90D9 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      {/* Glow lines */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #1E3A5F 1px, transparent 1px), linear-gradient(to bottom, #1E3A5F 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>

      {/* Clusters */}
      {[
        { top: '25%', left: '20%', size: 40, color: '#34D399', label: 'NA-WEST', count: '3,200', status: 'online' },
        { top: '30%', left: '38%', size: 60, color: '#34D399', label: 'NA-EAST', count: '8,100', status: 'online' },
        { top: '35%', left: '58%', size: 48, color: '#34D399', label: 'EU-CENTRAL', count: '2,400', status: 'online' },
        { top: '55%', left: '48%', size: 28, color: '#F87171', label: 'SA-EAST', count: '202 OFFLINE', status: 'critical' },
        { top: '45%', left: '72%', size: 36, color: '#FBBF24', label: 'AP-SOUTH', count: '1,800', status: 'warning' },
      ].map(cluster => (
        <div
          key={cluster.label}
          className="absolute group cursor-pointer"
          style={{ top: cluster.top, left: cluster.left, transform: 'translate(-50%, -50%)' }}
        >
          <div
            className="rounded-full flex items-center justify-center animate-pulse"
            style={{ width: cluster.size, height: cluster.size, backgroundColor: `${cluster.color}18`, border: `1px solid ${cluster.color}40` }}
          >
            <div className="rounded-full" style={{ width: cluster.size / 3, height: cluster.size / 3, backgroundColor: cluster.color, boxShadow: `0 0 12px ${cluster.color}` }}></div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            <div className="bg-slate-900/95 border border-slate-700 rounded px-2 py-1 text-center">
              <p className="text-[10px] font-bold text-white">{cluster.label}</p>
              <p className="text-[9px]" style={{ color: cluster.color }}>{cluster.count}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Animated connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <line x1="20%" y1="25%" x2="38%" y2="30%" stroke="#34D399" strokeWidth="0.5" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="38%" y1="30%" x2="58%" y2="35%" stroke="#34D399" strokeWidth="0.5" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1="48%" y1="55%" x2="38%" y2="30%" stroke="#F87171" strokeWidth="0.5" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="58%" y1="35%" x2="72%" y2="45%" stroke="#FBBF24" strokeWidth="0.5" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="2.2s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Corner badge */}
      <div className="absolute bottom-3 right-3 bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-[10px] text-slate-400 font-mono">
        MapLibre GL • Live Feed
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CommandCenter() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060C18] text-white flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-[#1A2744] bg-[#080D1A] shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/iot/fleets" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white group-hover:text-emerald-400 transition-colors">AirSense</span>
          </Link>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-[12px] font-semibold text-emerald-400 uppercase tracking-widest">Operations Command Center</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Live Clock */}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">UTC</p>
            <p className="font-mono text-[14px] text-white font-bold">
              {time.toISOString().slice(11, 19)}
            </p>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          {/* System pulse */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[12px] font-medium text-emerald-400">All Systems Nominal</span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Settings className="w-4 h-4" /></button>
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow">JD</div>
          </div>
        </div>
      </header>

      {/* ── Global KPIs ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 border-b border-[#1A2744] bg-[#080D1A] shrink-0">
        <KPITile label="Total Devices" value="14,248" sub="+12%" icon={Cpu} color="#34D399" trend="up" />
        <KPITile label="Online" value="13,902" sub="97.5%" icon={Activity} color="#34D399" trend="stable" />
        <KPITile label="Critical Alerts" value="3" sub="Active" icon={ShieldAlert} color="#F87171" trend="down" />
        <KPITile label="Avg AQI" value="62" sub="Moderate" icon={Wind} color="#FBBF24" trend="up" />
        <KPITile label="Avg Temperature" value="24.1°C" icon={Thermometer} color="#60A5FA" />
        <KPITile label="Gateways Online" value="42/44" sub="95.4%" icon={Radio} color="#A78BFA" trend="stable" />
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-0 min-h-0">

        {/* Left: Map + Bottom panels */}
        <div className="flex flex-col border-r border-[#1A2744]">
          {/* Map */}
          <div className="flex-1 relative min-h-[340px]">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <div className="bg-slate-900/90 border border-slate-700 rounded-md px-3 py-1.5 flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Global Fleet Map</span>
              </div>
            </div>
            <GISMapCanvas />
          </div>

          {/* Bottom: AQI + Activity Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#1A2744] shrink-0" style={{ maxHeight: '240px' }}>
            {/* Live AQI */}
            <div className="border-r border-[#1A2744] overflow-auto">
              <div className="px-4 py-2.5 border-b border-[#1A2744] flex items-center gap-2 bg-[#0A1020]">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Live AQI</span>
                <span className="ml-auto relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span></span>
              </div>
              <div className="divide-y divide-[#1A2744]">
                {liveAQI.map(zone => (
                  <div key={zone.zone} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                    <span className="text-[12px] text-slate-300">{zone.zone}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-bold ${zone.aqi < 50 ? 'text-emerald-400' : zone.aqi < 100 ? 'text-amber-400' : 'text-red-400'}`}>{zone.aqi}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${zone.aqi < 50 ? 'bg-emerald-500/20 text-emerald-400' : zone.aqi < 100 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{zone.status}</span>
                      {zone.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-400" /> : zone.trend === 'down' ? <TrendingDown className="w-3 h-3 text-emerald-400" /> : <span className="w-3 h-3"></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="overflow-auto">
              <div className="px-4 py-2.5 border-b border-[#1A2744] flex items-center gap-2 bg-[#0A1020]">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Activity Feed</span>
              </div>
              <div className="divide-y divide-[#1A2744]">
                {activityFeed.slice(0, 5).map((event, i) => (
                  <div key={i} className="px-4 py-2 flex items-start gap-2 hover:bg-slate-900/50 transition-colors">
                    <FeedIcon type={event.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-300 leading-snug truncate">{event.msg}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Incidents + AI Summary + System Status */}
        <div className="flex flex-col overflow-hidden bg-[#080D1A]">

          {/* Active Incidents */}
          <div className="border-b border-[#1A2744]">
            <div className="px-4 py-2.5 bg-[#0A1020] border-b border-[#1A2744] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Incidents</span>
              </div>
              <Link to="/iot/alerts" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">View All →</Link>
            </div>
            <div className="divide-y divide-[#1A2744]">
              {incidents.map(inc => (
                <Link
                  key={inc.id}
                  to={`/iot/alerts/${inc.id}`}
                  className="block px-4 py-3 hover:bg-slate-900/60 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={inc.severity} />
                      <span className="text-[11px] font-mono text-slate-500">{inc.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono shrink-0">{inc.duration}</span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-200 group-hover:text-white transition-colors">{inc.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{inc.location} · {inc.devices} devices</p>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="border-b border-[#1A2744]">
            <div className="px-4 py-2.5 bg-[#0A1020] border-b border-[#1A2744] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">AI Summary</span>
            </div>
            <div className="p-4">
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  <span className="text-violet-400 font-bold">Root cause identified:</span> INC-9821 is likely caused by a DHCP lease exhaustion on Gateway NC-02. Three similar patterns were observed in the last 90 days. Recommended action: restart DHCP service and expand lease pool.
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="px-2.5 py-1 bg-violet-500 text-white text-[11px] font-medium rounded hover:bg-violet-600 transition-colors">Apply Fix</button>
                  <button className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[11px] font-medium rounded hover:bg-slate-700 transition-colors border border-slate-700">View Details</button>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 py-2.5 bg-[#0A1020] border-b border-[#1A2744] flex items-center gap-2 sticky top-0">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">System Status</span>
            </div>
            <div className="divide-y divide-[#1A2744]">
              {systemStatus.map(svc => (
                <div key={svc.name} className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${svc.status === 'operational' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span className="text-[12px] text-slate-300">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{svc.latency}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${svc.status === 'operational' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                      {svc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer: Switch to IoT */}
          <div className="p-3 border-t border-[#1A2744] bg-[#0A1020] shrink-0">
            <Link
              to="/iot/fleets"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-slate-800 border border-slate-700 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              Switch to IoT Platform
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
