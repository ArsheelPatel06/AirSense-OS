import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Users, Zap, Wind, Thermometer,
  Cloud, Activity, Plus, Radio, Megaphone, TrendingUp, TrendingDown,
  Minus, Clock, ChevronRight, MapPin, RefreshCw,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INCIDENTS = [
  { id: 'OPS-4821', severity: 'critical', title: 'PM2.5 Spike — Industrial Zone', location: 'Sector 7-W', assigned: 'Alpha Team', duration: '1h 12m', status: 'Investigating' },
  { id: 'OPS-4820', severity: 'warning', title: 'High AQI — East Market', location: 'Zone EM-04', assigned: 'Bravo Team', duration: '2h 45m', status: 'Monitoring' },
  { id: 'OPS-4818', severity: 'warning', title: 'Sensor Cluster Offline', location: 'North Campus', assigned: 'Ops-3', duration: '45m', status: 'En Route' },
  { id: 'OPS-4815', severity: 'info', title: 'Construction Dust Alert', location: 'CBD Block C', assigned: 'Unassigned', duration: '4h 20m', status: 'Open' },
];

const RESPONSE_TEAMS = [
  { name: 'Alpha Team', status: 'deployed', members: 4, location: 'Industrial Zone', task: 'OPS-4821' },
  { name: 'Bravo Team', status: 'deployed', members: 3, location: 'East Market', task: 'OPS-4820' },
  { name: 'Charlie Team', status: 'standby', members: 5, location: 'Dispatch HQ', task: null },
  { name: 'Delta Team', status: 'standby', members: 3, location: 'Dispatch HQ', task: null },
  { name: 'Ops-3', status: 'en-route', members: 2, location: 'North Campus', task: 'OPS-4818' },
];

const AQI_ZONES = [
  { zone: 'North Campus', aqi: 38, trend: 'down', status: 'Good', color: '#22C55E' },
  { zone: 'East Market', aqi: 82, trend: 'up', status: 'Moderate', color: '#F59E0B' },
  { zone: 'Industrial Zone', aqi: 147, trend: 'up', status: 'Unhealthy', color: '#EF4444' },
  { zone: 'CBD', aqi: 54, trend: 'stable', status: 'Moderate', color: '#F59E0B' },
  { zone: 'South Harbor', aqi: 41, trend: 'down', status: 'Good', color: '#22C55E' },
];

const TIMELINE = [
  { time: '12:47', type: 'critical', icon: AlertTriangle, msg: 'OPS-4821 opened — PM2.5 exceeded 150μg/m³ in Industrial Zone', color: '#EF4444' },
  { time: '12:31', type: 'ai', icon: Zap, msg: 'AI: Pollution plume trajectory heading NE at ~8km/h. Est. impact in 37 min', color: '#8B5CF6' },
  { time: '12:18', type: 'team', icon: Users, msg: 'Alpha Team dispatched to Industrial Zone (ETA 14 min)', color: '#2563EB' },
  { time: '12:05', type: 'warning', icon: AlertTriangle, msg: 'OPS-4820 opened — AQI climbing in East Market', color: '#F59E0B' },
  { time: '11:52', type: 'resolved', icon: CheckCircle, msg: 'OPS-4812 resolved — Sensor cluster back online', color: '#22C55E' },
  { time: '11:40', type: 'team', icon: Users, msg: 'Morning shift handover complete — 6 teams active', color: '#2563EB' },
];

const SYSTEM_STATUS = [
  { name: 'Sensor Network', status: 'operational', uptime: '99.8%' },
  { name: 'Alert Engine', status: 'operational', uptime: '100%' },
  { name: 'AI Pipeline', status: 'degraded', uptime: '94.2%' },
  { name: 'MQTT Broker', status: 'operational', uptime: '100%' },
  { name: 'GIS Tiles', status: 'operational', uptime: '99.1%' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-[var(--color-ops-critical)]/10 text-[var(--color-ops-critical)] border-[var(--color-ops-critical)]/20',
    warning: 'bg-[var(--color-ops-warning)]/10 text-[var(--color-ops-warning)] border-[var(--color-ops-warning)]/20',
    info: 'bg-[var(--color-ops-info)]/10 text-[var(--color-ops-info)] border-[var(--color-ops-info)]/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${map[severity] ?? map.info}`}>
      {severity === 'critical' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-ops-critical)] opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-ops-critical)]"></span>
        </span>
      )}
      {severity}
    </span>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-[var(--color-ops-critical)]" />;
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-[var(--color-ops-success)]" />;
  return <Minus className="w-3 h-3 text-[var(--color-ops-text-muted)]" />;
}

// ─── GIS Map Canvas ───────────────────────────────────────────────────────────

function GISMapCanvas() {
  return (
    <div className="relative w-full h-full bg-[#E8EEF4] overflow-hidden rounded-none">
      {/* Light Mission map base */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      </div>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)', backgroundSize: '70px 70px' }}>
      </div>

      {/* "Road" lines suggesting city grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" preserveAspectRatio="none">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1D4ED8" strokeWidth="2" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1D4ED8" strokeWidth="2" />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#1D4ED8" strokeWidth="1" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#1D4ED8" strokeWidth="1" />
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#1D4ED8" strokeWidth="1" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#1D4ED8" strokeWidth="1" />
        <line x1="0" y1="35%" x2="100%" y2="65%" stroke="#1D4ED8" strokeWidth="0.5" />
        <line x1="0" y1="65%" x2="100%" y2="35%" stroke="#1D4ED8" strokeWidth="0.5" />
      </svg>

      {/* AQI Heatmap overlay blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full blur-3xl opacity-25" style={{ top: '40%', left: '55%', width: '220px', height: '180px', backgroundColor: '#EF4444', transform: 'translate(-50%,-50%)' }}></div>
        <div className="absolute rounded-full blur-3xl opacity-15" style={{ top: '38%', left: '65%', width: '140px', height: '120px', backgroundColor: '#F59E0B', transform: 'translate(-50%,-50%)' }}></div>
        <div className="absolute rounded-full blur-2xl opacity-12" style={{ top: '30%', left: '38%', width: '100px', height: '90px', backgroundColor: '#F59E0B', transform: 'translate(-50%,-50%)' }}></div>
      </div>

      {/* Incident markers */}
      {[
        { top: '42%', left: '57%', severity: 'critical', label: 'OPS-4821', sublabel: 'AQI 147' },
        { top: '32%', left: '39%', severity: 'warning', label: 'OPS-4820', sublabel: 'AQI 82' },
        { top: '22%', left: '22%', severity: 'warning', label: 'OPS-4818', sublabel: 'Offline' },
        { top: '55%', left: '45%', severity: 'info', label: 'OPS-4815', sublabel: 'Dust' },
      ].map(marker => {
        const colors: Record<string, { ring: string; dot: string; bg: string }> = {
          critical: { ring: '#EF4444', dot: '#EF4444', bg: 'bg-red-100 border-red-300 text-red-700' },
          warning: { ring: '#F59E0B', dot: '#F59E0B', bg: 'bg-amber-100 border-amber-300 text-amber-700' },
          info: { ring: '#0EA5E9', dot: '#0EA5E9', bg: 'bg-sky-100 border-sky-300 text-sky-700' },
        };
        const c = colors[marker.severity] ?? colors.info;
        return (
          <div key={marker.label} className="absolute group cursor-pointer" style={{ top: marker.top, left: marker.left, transform: 'translate(-50%,-50%)' }}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${c.ring}18`, border: `1.5px solid ${c.ring}50` }}>
                <div className="w-3.5 h-3.5 rounded-full animate-pulse" style={{ backgroundColor: c.dot, boxShadow: `0 0 8px ${c.dot}` }}></div>
              </div>
              {/* Tooltip */}
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20`}>
                <div className={`px-2 py-1 rounded border text-[11px] font-semibold shadow-md ${c.bg}`}>
                  <p>{marker.label}</p>
                  <p className="text-[10px] font-normal opacity-70">{marker.sublabel}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Response team icons */}
      {[
        { top: '46%', left: '60%', team: 'α', color: '#2563EB' },
        { top: '35%', left: '42%', team: 'β', color: '#2563EB' },
        { top: '20%', left: '20%', team: 'ε', color: '#8B5CF6' },
      ].map(t => (
        <div key={t.team} className="absolute group cursor-pointer" style={{ top: t.top, left: t.left }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md animate-pulse" style={{ backgroundColor: t.color, boxShadow: `0 0 6px ${t.color}60` }}>
            {t.team}
          </div>
        </div>
      ))}

      {/* AI trajectory arrow */}
      <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#8B5CF6" />
          </marker>
        </defs>
        <line x1="57%" y1="42%" x2="68%" y2="25%" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow)">
          <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* AI trajectory label */}
      <div className="absolute bg-white/90 border border-purple-200 rounded px-2 py-1 text-[10px] font-semibold text-purple-700 shadow-sm" style={{ top: '26%', left: '67%' }}>
        AI: Plume → NE
      </div>

      {/* Layer controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        {['AQI', 'Wind', 'Traffic'].map(layer => (
          <button key={layer} className="px-2.5 py-1 bg-white/90 border border-[var(--color-ops-border)] rounded text-[10px] font-semibold text-[var(--color-ops-text-secondary)] hover:bg-white hover:border-[var(--color-ops-brand)] hover:text-[var(--color-ops-brand)] transition-all shadow-sm">
            {layer}
          </button>
        ))}
      </div>

      {/* Map attribution */}
      <div className="absolute bottom-2 left-2 bg-white/70 rounded px-1.5 py-0.5 text-[9px] text-slate-400 font-mono">
        © OpenStreetMap · AirSense GIS
      </div>

      {/* Live badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 border border-[var(--color-ops-border)] rounded-full px-2.5 py-1 shadow-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-ops-success)] opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-ops-success)]"></span>
        </span>
        <span className="text-[10px] font-bold text-[var(--color-ops-text-primary)] uppercase tracking-widest">Live</span>
      </div>
    </div>
  );
}

// ─── Panel Card ───────────────────────────────────────────────────────────────

function PanelCard({ title, icon: Icon, action, actionHref, children }: {
  title: string; icon: any; action?: string; actionHref?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-ops-card)] border border-[var(--color-ops-border)] rounded-lg flex flex-col overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="px-4 py-2.5 border-b border-[var(--color-ops-border)] bg-[var(--color-ops-surface)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-[var(--color-ops-text-muted)]" />
          <span className="text-[11px] font-bold text-[var(--color-ops-text-secondary)] uppercase tracking-widest">{title}</span>
        </div>
        {action && actionHref && (
          <Link to={actionHref} className="text-[11px] text-[var(--color-ops-brand)] hover:underline font-medium">{action} →</Link>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MissionControl() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-ops-bg)]">

      {/* ── Page Title Row ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-ops-border)] bg-[var(--color-ops-card)] shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[15px] font-bold text-[var(--color-ops-text-primary)] tracking-tight">Mission Control</h1>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ops-text-disabled)] border border-[var(--color-ops-border)] px-2 py-0.5 rounded">City: Ahmedabad</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-ops-text-muted)] uppercase tracking-widest">UTC</p>
            <p className="font-mono text-[13px] font-bold text-[var(--color-ops-text-primary)]">{time.toISOString().slice(11, 19)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-ops-critical)] text-white text-[12px] font-semibold rounded-md hover:bg-red-700 transition-colors shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              Open Incident
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-ops-brand)] text-white text-[12px] font-semibold rounded-md hover:bg-[var(--color-ops-brand-hover)] transition-colors shadow-sm">
              <Megaphone className="w-3.5 h-3.5" />
              Broadcast Alert
            </button>
            <button className="p-2 rounded-md border border-[var(--color-ops-border)] bg-[var(--color-ops-card)] text-[var(--color-ops-text-muted)] hover:text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)] transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      {/* Layout: [GIS Map 70%] | [Right Panel 30%] */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_356px] min-h-0 overflow-hidden">

        {/* LEFT: Map + Bottom Row */}
        <div className="flex flex-col border-r border-[var(--color-ops-border)] overflow-hidden">

          {/* GIS Map — ~65% of remaining height */}
          <div className="flex-[2] min-h-0 relative">
            <GISMapCanvas />

            {/* Floating Quick Actions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              <div className="flex items-center gap-1.5 bg-white/95 border border-[var(--color-ops-border)] rounded-full px-3 py-1.5 shadow-md backdrop-blur-sm">
                {[
                  { label: 'Assign Team', icon: Users },
                  { label: 'View Forecast', icon: TrendingUp },
                  { label: 'Export Snapshot', icon: Activity },
                ].map(action => (
                  <button key={action.label} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-brand)] rounded-full hover:bg-[var(--color-ops-brand-surface)] transition-colors">
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: AQI + Timeline */}
          <div className="flex-[1] border-t border-[var(--color-ops-border)] grid grid-cols-2 min-h-0" style={{ maxHeight: '200px' }}>

            {/* Live AQI by Zone */}
            <PanelCard title="Live AQI by Zone" icon={Wind} action="Environmental" actionHref="/operations/environmental">
              <div className="divide-y divide-[var(--color-ops-border)]">
                {AQI_ZONES.map(zone => (
                  <div key={zone.zone} className="px-4 py-2 flex items-center justify-between hover:bg-[var(--color-ops-surface)] transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }}></span>
                      <span className="text-[12px] text-[var(--color-ops-text-primary)]">{zone.zone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold" style={{ color: zone.color }}>{zone.aqi}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ color: zone.color, backgroundColor: `${zone.color}15` }}>{zone.status}</span>
                      <TrendIcon trend={zone.trend} />
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>

            {/* Event Timeline */}
            <PanelCard title="Live Timeline" icon={Clock} action="All" actionHref="/operations/playback">
              <div className="divide-y divide-[var(--color-ops-border)]">
                {TIMELINE.slice(0, 4).map((event, i) => (
                  <div key={i} className="px-4 py-2 flex items-start gap-2.5 hover:bg-[var(--color-ops-surface)] transition-colors cursor-pointer">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${event.color}15` }}>
                      <event.icon className="w-3 h-3" style={{ color: event.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[var(--color-ops-text-primary)] leading-snug line-clamp-2">{event.msg}</p>
                      <p className="text-[10px] text-[var(--color-ops-text-muted)] font-mono mt-0.5">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col overflow-hidden bg-[var(--color-ops-surface)]">

          {/* Active Incidents */}
          <div className="flex-[2] min-h-0 flex flex-col border-b border-[var(--color-ops-border)]">
            <PanelCard title="Active Incidents" icon={AlertTriangle} action="View All" actionHref="/operations/incidents">
              <div className="divide-y divide-[var(--color-ops-border)]">
                {INCIDENTS.map(inc => (
                  <Link
                    key={inc.id}
                    to={`/operations/incidents/${inc.id}`}
                    className="block px-4 py-3 hover:bg-[var(--color-ops-bg)] transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={inc.severity} />
                        <span className="text-[10px] font-mono text-[var(--color-ops-text-muted)]">{inc.id}</span>
                      </div>
                      <span className="text-[10px] text-[var(--color-ops-text-muted)] font-mono shrink-0">{inc.duration}</span>
                    </div>
                    <p className="text-[12px] font-semibold text-[var(--color-ops-text-primary)] group-hover:text-[var(--color-ops-brand)] transition-colors leading-snug">{inc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-[var(--color-ops-text-muted)]">
                        <MapPin className="w-2.5 h-2.5" />{inc.location}
                      </span>
                      <span className="text-[var(--color-ops-border)]">·</span>
                      <span className="text-[10px] text-[var(--color-ops-text-muted)]">{inc.assigned}</span>
                      <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded" style={{
                        backgroundColor: inc.status === 'Investigating' ? 'rgba(239,68,68,0.1)' : inc.status === 'Monitoring' ? 'rgba(245,158,11,0.1)' : 'rgba(37,99,235,0.1)',
                        color: inc.status === 'Investigating' ? '#DC2626' : inc.status === 'Monitoring' ? '#D97706' : '#2563EB',
                      }}>{inc.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </PanelCard>
          </div>

          {/* AI Operational Summary */}
          <div className="shrink-0 border-b border-[var(--color-ops-border)]">
            <div className="px-4 py-2.5 border-b border-[var(--color-ops-border)] bg-[var(--color-ops-card)] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[11px] font-bold text-[var(--color-ops-text-secondary)] uppercase tracking-widest">AI Operational Summary</span>
              <span className="ml-auto text-[10px] bg-purple-500/10 text-purple-600 border border-purple-500/20 px-1.5 py-0.5 rounded-full font-medium">Live</span>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/30">
              <p className="text-[12px] text-[var(--color-ops-text-primary)] leading-relaxed mb-3">
                <span className="font-bold text-purple-600">Pollution plume detected</span> moving northeast at ~8 km/h from Industrial Zone. Estimated impact radius reaches residential Sector 5 in <span className="font-bold text-[var(--color-ops-critical)]">37 minutes</span>.
              </p>
              <p className="text-[11px] text-[var(--color-ops-text-secondary)] mb-3">Root cause likely heavy industrial exhaust during afternoon shift change. PM2.5 at 147μg/m³ — exceeds NAAQS safe limit.</p>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-purple-600 text-white text-[11px] font-semibold rounded-md hover:bg-purple-700 transition-colors text-center">
                  View Evidence
                </button>
                <button className="flex-1 py-1.5 bg-[var(--color-ops-card)] border border-[var(--color-ops-border)] text-[var(--color-ops-text-primary)] text-[11px] font-medium rounded-md hover:bg-[var(--color-ops-bg)] transition-colors">
                  Issue Warning
                </button>
              </div>
            </div>
          </div>

          {/* Response Teams */}
          <div className="flex-1 min-h-0 flex flex-col border-b border-[var(--color-ops-border)]">
            <PanelCard title="Response Teams" icon={Users} action="Assets" actionHref="/operations/assets">
              <div className="divide-y divide-[var(--color-ops-border)]">
                {RESPONSE_TEAMS.map(team => (
                  <div key={team.name} className="px-4 py-2.5 flex items-center justify-between hover:bg-[var(--color-ops-bg)] transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${team.status === 'deployed' ? 'bg-[var(--color-ops-critical)]' : team.status === 'en-route' ? 'bg-[var(--color-ops-warning)]' : 'bg-[var(--color-ops-success)]'}`}></div>
                      <div>
                        <p className="text-[12px] font-semibold text-[var(--color-ops-text-primary)]">{team.name}</p>
                        <p className="text-[10px] text-[var(--color-ops-text-muted)]">{team.location} · {team.members} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize ${
                        team.status === 'deployed' ? 'bg-[var(--color-ops-critical)]/10 text-[var(--color-ops-critical)]' :
                        team.status === 'en-route' ? 'bg-[var(--color-ops-warning)]/10 text-[var(--color-ops-warning)]' :
                        'bg-[var(--color-ops-success)]/10 text-[var(--color-ops-success)]'
                      }`}>{team.status.replace('-', ' ')}</span>
                      {team.task && <p className="text-[9px] font-mono text-[var(--color-ops-text-muted)] mt-0.5">{team.task}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          </div>

          {/* System Status */}
          <div className="shrink-0">
            <div className="px-4 py-2.5 border-b border-[var(--color-ops-border)] bg-[var(--color-ops-card)] flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[var(--color-ops-text-muted)]" />
              <span className="text-[11px] font-bold text-[var(--color-ops-text-secondary)] uppercase tracking-widest">System Status</span>
            </div>
            <div className="grid grid-cols-1 divide-y divide-[var(--color-ops-border)]">
              {SYSTEM_STATUS.map(svc => (
                <div key={svc.name} className="px-4 py-2 flex items-center justify-between bg-[var(--color-ops-card)]">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${svc.status === 'operational' ? 'bg-[var(--color-ops-success)]' : 'bg-[var(--color-ops-warning)]'}`}></span>
                    <span className="text-[11px] text-[var(--color-ops-text-primary)]">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--color-ops-text-muted)]">{svc.uptime}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${svc.status === 'operational' ? 'text-[var(--color-ops-success)] bg-[var(--color-ops-success)]/10' : 'text-[var(--color-ops-warning)] bg-[var(--color-ops-warning)]/10'}`}>
                      {svc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
