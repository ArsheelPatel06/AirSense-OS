import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Users, Wind, Thermometer, Cloud, Activity, 
  MapPin, Clock, Search, Layers, Crosshair, ChevronRight,
  Zap, Play, Pause, ChevronLeft, Calendar, FileText, Megaphone, Plus, Image,
  X, CheckCircle, Info, ShieldAlert, Cross, Factory, Building
} from 'lucide-react';

// ─── Mock Data ─────────────────────────────────────────────────────────────

interface Incident {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  assigned: string;
  duration: string;
  status: string;
  rootCause?: string;
  actions?: string[];
}

const INCIDENTS: Incident[] = [
  { id: 'OPS-4821', severity: 'critical', title: 'PM2.5 Spike — Industrial Zone', location: 'Sector 7-W', assigned: 'Alpha Team', duration: '1h 12m', status: 'Investigating', rootCause: 'Unauthorized industrial venting detected.', actions: ['Dispatch HAZMAT', 'Issue Area Warning'] },
  { id: 'OPS-4820', severity: 'warning', title: 'High AQI — East Market', location: 'Zone EM-04', assigned: 'Bravo Team', duration: '2h 45m', status: 'Monitoring', rootCause: 'Traffic congestion combined with thermal inversion.', actions: ['Reroute Traffic', 'Notify Public'] },
  { id: 'OPS-4818', severity: 'warning', title: 'Sensor Cluster Offline', location: 'North Campus', assigned: 'Ops-3', duration: '45m', status: 'En Route', rootCause: 'Power grid failure in sector 9.', actions: ['Send Maintenance', 'Check Grid Status'] },
  { id: 'OPS-4815', severity: 'info', title: 'Construction Dust Alert', location: 'CBD Block C', assigned: 'Unassigned', duration: '4h 20m', status: 'Open', rootCause: 'Heavy excavation without water suppression.', actions: ['Issue Citation', 'Deploy Portable Sensors'] },
  { id: 'OPS-4814', severity: 'info', title: 'Planned Pipeline Work', location: 'South River', assigned: 'Delta', duration: '5h 00m', status: 'Scheduled' },
];

const MAP_LAYERS = [
  { id: 'aqi', label: 'AQI Heatmap', active: true, color: '#EF4444' },
  { id: 'pm25', label: 'PM2.5', active: false, color: '#F59E0B' },
  { id: 'wind', label: 'Wind Simulation', active: true, color: '#3B82F6' },
  { id: 'weather', label: 'Weather', active: false, color: '#0EA5E9' },
  { id: 'sensors', label: 'Sensor Locations', active: true, color: '#10B981' },
  { id: 'incidents', label: 'Active Incidents', active: true, color: '#EF4444' },
  { id: 'teams', label: 'Response Teams', active: true, color: '#6366F1' },
  { id: 'industrial', label: 'Industrial Zones', active: false, color: '#64748B' },
  { id: 'schools', label: 'Schools', active: false, color: '#F59E0B' },
  { id: 'hospitals', label: 'Hospitals', active: false, color: '#EF4444' },
];

const TIMELINE_EVENTS = [
  { time: '09:00', label: 'Morning Shift Start', type: 'info', x: 50, y: 50 },
  { time: '10:15', label: 'Wind Direction Changed', type: 'weather', x: 20, y: 30 },
  { time: '11:42', label: 'Incident Created (OPS-4820)', type: 'warning', x: 39, y: 32 },
  { time: '12:05', label: 'AQI Exceeded Threshold', type: 'critical', x: 47, y: 42 },
  { time: '12:30', label: 'Team Dispatched (Alpha)', type: 'action', x: 60, y: 60 },
];

// ─── Components ────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-900',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-900',
    info: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-900',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${map[severity] ?? map.info}`}>
      {severity === 'critical' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-600"></span>
        </span>
      )}
      {severity}
    </span>
  );
}

// ─── GIS Map Canvas (Mock) ──────────────────────────────────────────────────

function GISMapWorkspace({ layers, mapOffset }: { layers: typeof MAP_LAYERS, mapOffset: {x: number, y: number} }) {
  const isLayerActive = (id: string) => layers.find(l => l.id === id)?.active;

  return (
    <div className="absolute inset-0 bg-[#E8EEF4] dark:bg-[#1E293B] overflow-hidden">
      {/* Container for pan effect */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{ transform: `translate(${-mapOffset.x}px, ${-mapOffset.y}px)` }}
      >
        {/* Grid Pattern */}
        <div className="absolute inset-[-100%] opacity-[0.06] dark:opacity-[0.1]"
          style={{ backgroundImage: 'radial-gradient(var(--color-ops-brand) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        </div>

        {/* PM2.5 */}
        {isLayerActive('pm25') && (
          <div className="absolute inset-[-100%] pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/50 via-transparent to-transparent"></div>
        )}

        {/* Simulated AQI Heatmap */}
        {isLayerActive('aqi') && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500">
            <div className="absolute rounded-full blur-3xl opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ top: '40%', left: '45%', width: '300px', height: '250px', backgroundColor: '#EF4444', transform: 'translate(-50%,-50%)' }}></div>
            <div className="absolute rounded-full blur-3xl opacity-20 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen" style={{ top: '38%', left: '55%', width: '200px', height: '180px', backgroundColor: '#F59E0B', transform: 'translate(-50%,-50%)' }}></div>
          </div>
        )}

        {/* Industrial Zones */}
        {isLayerActive('industrial') && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-32 h-24 border-2 border-slate-500/50 bg-slate-500/10 flex items-center justify-center rounded-sm" style={{ top: '25%', left: '70%' }}>
               <Factory className="w-6 h-6 text-slate-500/50" />
            </div>
          </div>
        )}

        {/* Hospitals */}
        {isLayerActive('hospitals') && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-6 h-6 bg-red-100 dark:bg-red-900 border-2 border-red-500 flex items-center justify-center rounded-full" style={{ top: '55%', left: '30%' }}>
               <Cross className="w-3 h-3 text-red-600 dark:text-red-400" />
            </div>
          </div>
        )}

        {/* Schools */}
        {isLayerActive('schools') && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-6 h-6 bg-amber-100 dark:bg-amber-900 border-2 border-amber-500 flex items-center justify-center rounded-full" style={{ top: '65%', left: '50%' }}>
               <Building className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        )}

        {/* Weather */}
        {isLayerActive('weather') && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute text-sky-500/70 dark:text-sky-400/50 font-bold text-4xl" style={{ top: '15%', left: '15%' }}>
               <Cloud className="w-16 h-16" />
            </div>
          </div>
        )}

        {/* Simulated Wind Vectors */}
        {isLayerActive('wind') && (
          <svg className="absolute inset-[-100%] w-[300%] h-[300%] opacity-20 pointer-events-none" preserveAspectRatio="none">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="currentColor" className="text-[var(--color-ops-brand)]" />
              </marker>
            </defs>
            <line x1="20%" y1="60%" x2="30%" y2="50%" stroke="currentColor" className="text-[var(--color-ops-brand)]" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrow)">
              <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="70%" x2="55%" y2="60%" stroke="currentColor" className="text-[var(--color-ops-brand)]" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrow)">
              <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" />
            </line>
          </svg>
        )}

        {/* Sensors */}
        {isLayerActive('sensors') && (
          <>
            {[
              { top: '30%', left: '30%' },
              { top: '45%', left: '55%' },
              { top: '60%', left: '40%' },
            ].map((s, i) => (
              <div key={i} className="absolute w-2 h-2 bg-emerald-500 rounded-full border border-white shadow-sm" style={{ top: s.top, left: s.left }}></div>
            ))}
          </>
        )}

        {/* Teams */}
        {isLayerActive('teams') && (
          <>
            {[
              { top: '50%', left: '48%', label: 'T-Alpha' },
              { top: '35%', left: '42%', label: 'T-Bravo' },
            ].map((t, i) => (
              <div key={i} className="absolute flex flex-col items-center pointer-events-none" style={{ top: t.top, left: t.left, transform: 'translate(-50%,-50%)' }}>
                <div className="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm mb-1">
                  <Users className="w-3 h-3" />
                </div>
                <span className="bg-white/80 dark:bg-slate-800/80 px-1 rounded text-[9px] font-bold text-slate-800 dark:text-white shadow-sm">{t.label}</span>
              </div>
            ))}
          </>
        )}

        {/* Incidents */}
        {isLayerActive('incidents') && (
          <>
            {[
              { top: '42%', left: '47%', severity: 'critical', label: 'OPS-4821' },
              { top: '32%', left: '39%', severity: 'warning', label: 'OPS-4820' },
            ].map(marker => (
              <div key={marker.label} className="absolute group cursor-pointer" style={{ top: marker.top, left: marker.left, transform: 'translate(-50%,-50%)' }}>
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse absolute" style={{ backgroundColor: marker.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)' }}>
                  </div>
                  <div className="w-5 h-5 rounded-full shadow-lg border-2 border-white flex items-center justify-center z-10" style={{ backgroundColor: marker.severity === 'critical' ? '#EF4444' : '#F59E0B' }}>
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-900 border border-[var(--color-ops-border)] rounded px-2 py-1 text-[10px] text-[var(--color-ops-text-muted)] font-mono z-0 pointer-events-none shadow-sm">
        © OpenStreetMap · AirSense GIS Engine
      </div>
    </div>
  );
}

// ─── Modal Shell ─────────────────────────────────────────────────────────────

function Modal({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-[var(--color-ops-border)] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-[var(--color-ops-border)] flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-[var(--color-ops-text-primary)] text-[14px]">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-ops-surface)] rounded text-[var(--color-ops-text-muted)] hover:text-[var(--color-ops-text-primary)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export function MissionControl() {
  const [layers, setLayers] = useState(MAP_LAYERS);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  
  // Modals & Drawers state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const toggleLayer = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const handleTimelineClick = (x: number, y: number) => {
    // Simulate panning map to the event location (subtracting 50 to keep it somewhat centered relative to origin)
    setMapOffset({ x: (x - 50) * 10, y: (y - 50) * 10 });
  };

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const openIncidentDrawer = (inc: Incident) => {
    setSelectedIncident(inc);
  };
  const closeIncidentDrawer = () => setSelectedIncident(null);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-[var(--color-ops-bg)] font-sans">
      
      {/* ── Main Workspace ── */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        
        {/* Background GIS Map */}
        <div className="absolute inset-0 z-0">
          <GISMapWorkspace layers={layers} mapOffset={mapOffset} />
        </div>

        {/* ── Floating Overlays (Left/Top) ── */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 pointer-events-none">
          
          {/* Quick Stats / City Selector */}
          <div className="bg-white dark:bg-slate-900 border border-[var(--color-ops-border)] rounded-xl shadow p-3 min-w-[200px] pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[13px] font-bold text-[var(--color-ops-text-primary)]">Ahmedabad</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <div className="text-[11px] text-[var(--color-ops-text-secondary)] flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5" /> 24°C
              <span className="mx-1 text-[var(--color-ops-border)]">|</span>
              <Wind className="w-3.5 h-3.5" /> 12 km/h
            </div>
          </div>

          {/* Map Controls */}
          <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 border border-[var(--color-ops-border)] rounded-lg shadow p-1 pointer-events-auto w-max">
            <button className="p-2 text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)] rounded transition-colors" title="Locate Me">
              <Crosshair className="w-4 h-4" />
            </button>
            <div className="h-px bg-[var(--color-ops-border)] mx-2 my-1" />
            <button className="p-2 text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)] rounded transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-2 text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)] rounded transition-colors">
              <div className="w-4 h-1 bg-current rounded-full" />
            </button>
          </div>
        </div>

        {/* ── Floating Overlays (Right / Panel) ── */}
        <div className={`absolute top-0 right-0 bottom-0 z-20 flex transition-transform duration-300 pointer-events-none ${isPanelOpen ? 'translate-x-0' : 'translate-x-[calc(100%-24px)]'}`}>
          
          {/* Panel Toggle Handle */}
          <button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="w-6 h-12 my-auto bg-white dark:bg-slate-900 border border-r-0 border-[var(--color-ops-border)] rounded-l-md shadow flex items-center justify-center text-[var(--color-ops-text-muted)] hover:text-[var(--color-ops-text-primary)] transition-colors pointer-events-auto"
          >
            {isPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Operational Context Panel */}
          <div className="w-96 h-full bg-white dark:bg-slate-900 border-l border-[var(--color-ops-border)] shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
            
            <div className="p-4 border-b border-[var(--color-ops-border)] flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-[14px] font-bold text-[var(--color-ops-text-primary)] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--color-ops-brand)]" />
                Operational Summary
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
              
              {/* AI Assistant Insight */}
              <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                  </div>
                  <span className="text-[12px] font-bold text-purple-900 dark:text-purple-300">AI Operational Assistant</span>
                </div>
                <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Pollution plume moving northeast</span> at ~8 km/h from Industrial Zone. Expected to impact Sector 5 within 45 minutes.
                </p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => openModal('alert')} className="w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-[12px] font-medium rounded-lg transition-colors flex justify-center items-center gap-1.5 shadow-sm">
                    <Megaphone className="w-3.5 h-3.5" /> Broadcast Alert to Sector 5
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => openModal('evidence')} className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[11px] font-medium rounded-lg transition-colors flex justify-center shadow-sm">
                      View Evidence
                    </button>
                    <button onClick={() => openModal('assign')} className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[11px] font-medium rounded-lg transition-colors flex justify-center shadow-sm">
                      Assign Team
                    </button>
                  </div>
                </div>
              </div>

              {/* Layer Manager */}
              <div>
                <h3 className="text-[11px] font-bold text-[var(--color-ops-text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Layer Manager
                </h3>
                <div className="flex flex-wrap gap-2">
                  {layers.map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={`px-2.5 py-1.5 rounded-md border text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                        layer.active 
                          ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-sm' 
                          : 'bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-solid hover:border-slate-400 dark:hover:border-slate-500'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.active ? layer.color : 'transparent', border: layer.active ? 'none' : '1px solid currentColor' }} />
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incident Queue */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-bold text-[var(--color-ops-text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Active Incidents
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {INCIDENTS.map(inc => (
                    <div key={inc.id} onClick={() => openIncidentDrawer(inc)} className="p-3 bg-white dark:bg-slate-900 border border-[var(--color-ops-border)] rounded-lg hover:border-[var(--color-ops-brand)] transition-colors cursor-pointer group shadow-sm">
                      <div className="flex items-start justify-between mb-1.5">
                        <SeverityBadge severity={inc.severity} />
                        <span className="text-[10px] text-[var(--color-ops-text-muted)] font-mono">{inc.duration}</span>
                      </div>
                      <p className="text-[13px] font-medium text-[var(--color-ops-text-primary)] leading-tight mb-2 group-hover:text-[var(--color-ops-brand)] transition-colors">{inc.title}</p>
                      <div className="flex items-center justify-between text-[11px] text-[var(--color-ops-text-secondary)]">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {inc.location}</span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{inc.assigned}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Slide-out Incident Drawer ── */}
        <div className={`absolute top-0 right-96 bottom-0 w-80 bg-white dark:bg-slate-900 border-l border-[var(--color-ops-border)] shadow-2xl z-10 transition-transform duration-300 flex flex-col ${selectedIncident ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedIncident && (
            <>
              <div className="p-4 border-b border-[var(--color-ops-border)] bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="font-bold text-[14px] text-[var(--color-ops-text-primary)]">Incident Details</h3>
                <button onClick={closeIncidentDrawer} className="p-1 text-[var(--color-ops-text-muted)] hover:bg-[var(--color-ops-surface)] rounded transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-5">
                <div>
                  <div className="mb-2"><SeverityBadge severity={selectedIncident.severity} /></div>
                  <h4 className="text-[16px] font-bold text-[var(--color-ops-text-primary)] leading-snug">{selectedIncident.title}</h4>
                  <p className="text-[12px] text-slate-500 font-mono mt-1">{selectedIncident.id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Zone</span>
                    <span className="font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedIncident.location}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Elapsed</span>
                    <span className="font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{selectedIncident.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Assigned</span>
                    <span className="font-medium flex items-center gap-1"><Users className="w-3 h-3" />{selectedIncident.assigned}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Status</span>
                    <span className="font-medium flex items-center gap-1"><Activity className="w-3 h-3" />{selectedIncident.status}</span>
                  </div>
                </div>

                <div className="border-t border-[var(--color-ops-border)] pt-4">
                  <h4 className="text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-2 flex items-center gap-2"><Search className="w-3 h-3" /> Root Cause</h4>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    {selectedIncident.rootCause || 'Investigation pending. Initial telemetry indicates abnormal readings.'}
                  </p>
                </div>

                <div className="border-t border-[var(--color-ops-border)] pt-4">
                  <h4 className="text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-3 flex items-center gap-2"><CheckCircle className="w-3 h-3" /> Suggested Actions</h4>
                  <div className="space-y-2">
                    {selectedIncident.actions?.map((action, idx) => (
                      <button key={idx} onClick={() => openModal('action')} className="w-full text-left px-3 py-2 bg-white dark:bg-slate-900 border border-[var(--color-ops-border)] rounded-lg hover:border-[var(--color-ops-brand)] hover:shadow-sm text-[12px] font-medium text-[var(--color-ops-text-primary)] transition-colors flex items-center justify-between">
                        {action}
                        <ChevronRight className="w-3 h-3 text-[var(--color-ops-text-muted)]" />
                      </button>
                    )) || <span className="text-[12px] text-slate-500">No AI actions available.</span>}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Floating Action Toolbar (Bottom Center) ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-[var(--color-ops-border)] rounded-2xl shadow-lg">
          <button onClick={() => openModal('incident')} className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Open Incident
          </button>
          <div className="w-px h-6 bg-[var(--color-ops-border)] mx-1" />
          {[
            { icon: Megaphone, label: 'Alert', id: 'alert' },
            { icon: Users, label: 'Assign', id: 'assign' },
            { icon: Cloud, label: 'Forecast', id: 'forecast' },
            { icon: Image, label: 'Snapshot', id: 'snapshot' },
          ].map(action => (
            <button key={action.id} onClick={() => openModal(action.id)} className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <action.icon className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-medium">{action.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ── Bottom Live Timeline ── */}
      <div className="h-16 shrink-0 bg-white dark:bg-slate-900 border-t border-[var(--color-ops-border)] flex items-center px-4 gap-4 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-2 pr-4 border-r border-[var(--color-ops-border)] shrink-0">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[var(--color-ops-text-primary)] hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">Live</div>
        </div>

        {/* Timeline Events Track */}
        <div className="flex-1 relative h-full flex items-center overflow-x-auto scrollbar-none">
          <div className="absolute left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800" />
          
          <div className="flex items-center gap-24 min-w-max px-8 relative z-10">
            {TIMELINE_EVENTS.map((evt, i) => (
              <div key={i} onClick={() => handleTimelineClick(evt.x, evt.y)} className="flex flex-col items-center group cursor-pointer">
                <div className="text-[10px] text-slate-500 font-mono mb-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{evt.time}</div>
                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 relative transition-transform group-hover:scale-125 ${
                  evt.type === 'critical' ? 'bg-red-500' :
                  evt.type === 'warning' ? 'bg-amber-500' :
                  evt.type === 'action' ? 'bg-indigo-500' : 
                  evt.type === 'weather' ? 'bg-sky-500' : 'bg-slate-400'
                }`}>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[11px] font-medium bg-slate-800 dark:bg-slate-700 text-white px-2.5 py-1 rounded shadow-lg pointer-events-none">
                    {evt.label}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Live Indicator */}
            <div className="flex flex-col items-center ml-24 cursor-pointer group" onClick={() => handleTimelineClick(50, 50)}>
              <div className="text-[10px] text-[var(--color-ops-brand)] font-mono font-bold mb-2">NOW</div>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-[var(--color-ops-brand)] shadow-[0_0_8px_var(--color-ops-brand)] relative">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--color-ops-brand)] animate-ping" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Modals ── */}
      
      <Modal title="Open New Incident" isOpen={activeModal === 'incident'} onClose={closeModal}>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-1">Incident Title</label>
            <input type="text" className="w-full bg-white dark:bg-slate-800 border border-[var(--color-ops-border)] rounded-md px-3 py-2 text-[13px] text-[var(--color-ops-text-primary)]" placeholder="e.g. Hazardous Gas Leak" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-1">Severity</label>
              <select className="w-full bg-white dark:bg-slate-800 border border-[var(--color-ops-border)] rounded-md px-3 py-2 text-[13px] text-[var(--color-ops-text-primary)]">
                <option>Critical</option>
                <option>Warning</option>
                <option>Info</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-1">Zone</label>
              <select className="w-full bg-white dark:bg-slate-800 border border-[var(--color-ops-border)] rounded-md px-3 py-2 text-[13px] text-[var(--color-ops-text-primary)]">
                <option>Sector 1</option>
                <option>Sector 2</option>
                <option>Industrial Zone</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-1">Initial Report</label>
            <textarea className="w-full h-24 bg-white dark:bg-slate-800 border border-[var(--color-ops-border)] rounded-md px-3 py-2 text-[13px] text-[var(--color-ops-text-primary)] resize-none" placeholder="Describe the incident..."></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-white bg-[var(--color-ops-brand)] hover:bg-indigo-700 rounded-md transition-colors">Create Incident</button>
          </div>
        </div>
      </Modal>

      <Modal title="Broadcast Alert" isOpen={activeModal === 'alert'} onClose={closeModal}>
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg flex gap-3 text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p className="text-[12px] leading-relaxed">This will trigger emergency push notifications to all users and digital signage in the selected zones. Use only for confirmed critical events.</p>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-1">Target Zones</label>
            <select multiple className="w-full h-24 bg-white dark:bg-slate-800 border border-[var(--color-ops-border)] rounded-md px-3 py-2 text-[13px] text-[var(--color-ops-text-primary)]">
              <option>Sector 5</option>
              <option>Sector 7-W</option>
              <option>East Market</option>
              <option>All Zones (Citywide)</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-1">Message Payload</label>
            <textarea className="w-full h-20 bg-white dark:bg-slate-800 border border-[var(--color-ops-border)] rounded-md px-3 py-2 text-[13px] text-[var(--color-ops-text-primary)] resize-none" defaultValue="URGENT: Pollution plume approaching. Stay indoors and close all windows."></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">Confirm Broadcast</button>
          </div>
        </div>
      </Modal>

      <Modal title="Assign Response Team" isOpen={activeModal === 'assign'} onClose={closeModal}>
         <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[var(--color-ops-text-primary)] mb-1">Available Teams</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-[var(--color-ops-border)] rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input type="radio" name="team" className="w-4 h-4 text-[var(--color-ops-brand)]" defaultChecked />
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[var(--color-ops-text-primary)]">HAZMAT Alpha</div>
                  <div className="text-[11px] text-slate-500">ETA: 5 mins • Sector 5</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-[var(--color-ops-border)] rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input type="radio" name="team" className="w-4 h-4 text-[var(--color-ops-brand)]" />
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[var(--color-ops-text-primary)]">Mobile Unit Bravo</div>
                  <div className="text-[11px] text-slate-500">ETA: 12 mins • East Market</div>
                </div>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-white bg-[var(--color-ops-brand)] hover:bg-indigo-700 rounded-md transition-colors">Dispatch Team</button>
          </div>
        </div>
      </Modal>

      <Modal title="View Evidence" isOpen={activeModal === 'evidence'} onClose={closeModal}>
         <div className="space-y-4">
           <p className="text-[13px] text-slate-600 dark:text-slate-300">AI analysis correlates recent PM2.5 spikes with unauthorized venting at factory complex C-19.</p>
           <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg border border-[var(--color-ops-border)] flex items-center justify-center overflow-hidden relative">
             <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]" />
             <div className="flex flex-col items-center gap-2 z-10">
                <FileText className="w-8 h-8 text-slate-400" />
                <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Sensor Telemetry Log</span>
             </div>
           </div>
           <div className="flex justify-end pt-2">
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-md transition-colors">Close</button>
          </div>
         </div>
      </Modal>

      <Modal title="Predictive Forecast" isOpen={activeModal === 'forecast'} onClose={closeModal}>
         <div className="space-y-4">
           <div className="grid grid-cols-2 gap-3">
             <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
               <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">+1 Hour (Predicted)</span>
               <div className="text-[18px] font-bold text-amber-600">AQI 145</div>
             </div>
             <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
               <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">+4 Hours (Predicted)</span>
               <div className="text-[18px] font-bold text-red-600">AQI 180</div>
             </div>
           </div>
           <p className="text-[12px] text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
             Wind models predict stagnation. Dispersion rate is extremely low. Recommend preemptive health advisories.
           </p>
           <div className="flex justify-end pt-2">
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-md transition-colors">Close</button>
          </div>
         </div>
      </Modal>

      <Modal title="Export Snapshot" isOpen={activeModal === 'snapshot'} onClose={closeModal}>
         <div className="space-y-4 flex flex-col items-center py-4">
           <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
             <CheckCircle className="w-8 h-8" />
           </div>
           <h3 className="font-bold text-[var(--color-ops-text-primary)]">Snapshot Captured</h3>
           <p className="text-[13px] text-slate-500 text-center">A timestamped PDF report containing current map layers, incidents, and timeline events has been generated.</p>
           <button onClick={closeModal} className="mt-4 px-6 py-2 text-[13px] font-medium text-white bg-[var(--color-ops-brand)] hover:bg-indigo-700 rounded-md transition-colors shadow-sm">
             Download Report
           </button>
         </div>
      </Modal>

      {/* Catch-all Action Modal for Drawer Buttons */}
      <Modal title="Execute Action" isOpen={activeModal === 'action'} onClose={closeModal}>
         <div className="space-y-4 py-4 text-center">
           <Info className="w-12 h-12 text-blue-500 mx-auto mb-2" />
           <p className="text-[13px] text-[var(--color-ops-text-primary)] font-medium">Executing suggested operational workflow...</p>
           <div className="flex justify-center pt-2">
            <button onClick={closeModal} className="px-4 py-2 text-[13px] font-medium text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-md transition-colors">Done</button>
          </div>
         </div>
      </Modal>

    </div>
  );
}
