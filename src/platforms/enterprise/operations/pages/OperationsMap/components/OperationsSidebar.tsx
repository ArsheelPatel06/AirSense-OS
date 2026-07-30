import React from 'react';
import type { SelectedEntity, Incident, SensorNode, Factory, Hospital } from '../types';
import { MOCK_INCIDENTS, MOCK_TEAMS, MOCK_TIMELINE } from '../mockData';
import { AlertTriangle, Factory as FactoryIcon, ShieldAlert, Activity, Truck, Zap, Thermometer, Droplets, Wind, Battery, Wifi, Building2 } from 'lucide-react';

interface OperationsSidebarProps {
  selectedEntity: SelectedEntity;
  onClose: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onEntitySelect?: (entity: SelectedEntity) => void;
}

export function OperationsSidebar({ selectedEntity, onClose, onToggleSidebar, isSidebarOpen, onEntitySelect }: OperationsSidebarProps) {
  
  if (!selectedEntity) {
    return <DefaultSidebar onClose={onClose} onEntitySelect={onEntitySelect} />;
  }

  return (
    <div className="w-80 bg-white/95 dark:bg-[#111318]/95 backdrop-blur border-l border-slate-200 dark:border-[#2C2E33] shadow-2xl h-full flex flex-col pointer-events-auto transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#181A20]">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-wide uppercase">
          {selectedEntity.type === 'incident' && <><AlertTriangle className="w-4 h-4 text-red-500" /> Incident Details</>}
          {selectedEntity.type === 'sensor' && <><Activity className="w-4 h-4 text-emerald-500" /> Sensor Telemetry</>}
          {selectedEntity.type === 'factory' && <><FactoryIcon className="w-4 h-4 text-amber-500" /> Facility Intel</>}
          {selectedEntity.type === 'hospital' && <><Building2 className="w-4 h-4 text-red-400" /> Healthcare Status</>}
          {selectedEntity.type === 'team' && <><Truck className="w-4 h-4 text-indigo-500" /> Team Status</>}
        </h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-white/10">
          <span className="text-lg leading-none">&times;</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
        
        {selectedEntity.type === 'incident' && (
          <IncidentView incident={selectedEntity.data as Incident} />
        )}

        {selectedEntity.type === 'sensor' && (
          <SensorView sensor={selectedEntity.data as SensorNode} />
        )}

        {selectedEntity.type === 'factory' && (
          <FactoryView factory={selectedEntity.data as Factory} />
        )}
        
        {selectedEntity.type === 'hospital' && (
          <HospitalView hospital={selectedEntity.data as Hospital} />
        )}

      </div>
    </div>
  );
}

// ── DEFAULT STATE (No Selection) ──
function DefaultSidebar({ onClose, onEntitySelect }: { onClose?: () => void, onEntitySelect?: (entity: SelectedEntity) => void }) {
  const [activeTab, setActiveTab] = React.useState<'incidents' | 'teams' | 'sensors'>('incidents');

  return (
    <div className="w-80 bg-white/95 dark:bg-[#111318]/95 backdrop-blur border-l border-slate-200 dark:border-[#2C2E33] shadow-2xl h-full flex flex-col pointer-events-auto">
      <div className="flex flex-col border-b border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#181A20]">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#0A84FF]" /> Operations Center
          </h3>
          {onClose && (
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-white/10">
              <span className="text-lg leading-none">&times;</span>
            </button>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 gap-4 mt-2">
          <TabButton active={activeTab === 'incidents'} onClick={() => setActiveTab('incidents')} label="Alerts" count={MOCK_INCIDENTS.length} color="text-red-500" />
          <TabButton active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} label="Teams" count={MOCK_TEAMS.length} color="text-indigo-500" />
          <TabButton active={activeTab === 'sensors'} onClick={() => setActiveTab('sensors')} label="Sensors" count={3} color="text-emerald-500" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
        
        {/* Alerts Tab */}
        {activeTab === 'incidents' && (
          <div className="flex flex-col gap-2">
            {MOCK_INCIDENTS.map(inc => (
              <div 
                key={inc.id} 
                onClick={() => onEntitySelect?.({ type: 'incident', data: inc })}
                className="bg-slate-50 dark:bg-[#1A1C23] border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide
                    ${inc.severity === 'critical' ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10 border border-red-500/20' : 
                      inc.severity === 'warning' ? 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 border border-amber-500/20' : 
                      'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-500/20'}`}
                  >
                    • {inc.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">Pos: {inc.x}, {inc.y}</span>
                </div>
                <div className="text-xs text-slate-900 dark:text-slate-300 font-medium truncate">{inc.title}</div>
                <div className="text-[10px] text-slate-500 mt-1">{inc.location}</div>
              </div>
            ))}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="flex flex-col gap-2">
            {MOCK_TEAMS.map(team => (
              <div 
                key={team.id} 
                onClick={() => onEntitySelect?.({ type: 'team', data: team })}
                className="flex items-center justify-between bg-slate-50 dark:bg-[#1A1C23] border border-slate-200 dark:border-slate-800 rounded-lg p-3 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded text-indigo-600 dark:text-indigo-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{team.name}</div>
                    <div className="text-[10px] text-slate-500">{team.availability}</div>
                  </div>
                </div>
                {team.availability === 'Dispatched' && <span className="text-xs font-bold text-indigo-500">ETA: {team.eta}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Sensors Tab */}
        {activeTab === 'sensors' && (
          <div className="flex flex-col gap-2">
            <div className="text-xs text-slate-500 text-center py-4">Click a sensor on the map for full diagnostics.</div>
          </div>
        )}

      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count, color }: { active: boolean, onClick: () => void, label: string, count: number, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`pb-2 text-[10px] font-bold uppercase tracking-wider transition-colors relative flex items-center gap-1.5
        ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
      `}
    >
      {label}
      <span className={`px-1.5 py-0.5 rounded-full text-[9px] bg-slate-200 dark:bg-[#2C2E33] ${active ? color : ''}`}>
        {count}
      </span>
      {active && <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-current ${color}`} />}
    </button>
  );
}


// ── INCIDENT VIEW (With UAV Image) ──
function IncidentView({ incident }: { incident: Incident }) {
  // Determine relevant image based on incident context
  const titleLower = incident.title.toLowerCase();
  let imageUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"; // Default: environmental/smoke
  if (titleLower.includes('traffic')) {
    imageUrl = "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&q=80&w=800"; // Traffic
  } else if (titleLower.includes('construction')) {
    imageUrl = "https://images.unsplash.com/photo-1541888081622-19e487103859?auto=format&fit=crop&q=80&w=800"; // Construction
  } else if (titleLower.includes('industrial') || titleLower.includes('factory') || titleLower.includes('pm2.5')) {
    imageUrl = "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800"; // Factory emissions
  } else if (titleLower.includes('sensor')) {
    imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"; // Tech/Hardware
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide
            ${incident.severity === 'critical' ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20' : 
              incident.severity === 'warning' ? 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20' : 
              'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20'}`}
          >
            {incident.severity}
          </span>
          <span className="text-xs text-slate-500 font-medium">{incident.id}</span>
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{incident.title}</h4>
        <div className="text-sm text-slate-500">{incident.location}</div>
      </div>

      {/* UAV Video Feed Mock */}
      <div className="relative w-full h-40 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-[#38383A] shadow-inner group mt-2">
        <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 z-10">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE UAV
        </div>
        <img 
          src={imageUrl} 
          alt="UAV Feed" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-green-400 text-[9px] font-mono px-2 py-1 rounded border border-green-500/30">
          ALT: 452m | SPD: 12kn
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#1A1C23] rounded-lg p-4 border border-slate-200 dark:border-slate-800">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">AI Recommendation</h5>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          Wind is pushing the plume North-East towards Residential Sector 4. Recommend dispatching Hazmat team to factory entrance and broadcasting shelter-in-place order for Sector 4.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned Team</h5>
        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded text-indigo-600 dark:text-indigo-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{incident.assigned}</div>
              <div className="text-[10px] text-slate-500">En route</div>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">ETA: 4m</span>
        </div>
      </div>
    </>
  );
}

// ── SENSOR VIEW ──
function SensorView({ sensor }: { sensor: SensorNode }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest
            ${sensor.status === 'Online' ? 'bg-emerald-100 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-400'}
          `}>
            {sensor.status}
          </span>
          <span className="text-xs text-slate-500 font-medium">{sensor.gateway}</span>
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Sensor {sensor.id}</h4>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={Thermometer} label="Temp" value="34°C" />
        <StatCard icon={Droplets} label="Humidity" value="45%" />
        <StatCard icon={Wind} label="Wind Spd" value="12 km/h" />
        <StatCard icon={Activity} label="Pressure" value="1012 hPa" />
      </div>

      <div className="bg-slate-50 dark:bg-[#1A1C23] rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Device Diagnostics</h5>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 flex items-center gap-2"><Battery className="w-3.5 h-3.5" /> Battery</span>
          <span className="text-slate-900 dark:text-white font-medium">84%</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 flex items-center gap-2"><Wifi className="w-3.5 h-3.5" /> Signal</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">-68 dBm</span>
        </div>
      </div>
    </>
  );
}

// ── FACTORY VIEW ──
function FactoryView({ factory }: { factory: Factory }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{factory.name}</h4>
        <div className="text-sm text-slate-500">{factory.industry}</div>
      </div>

      <div className="bg-slate-50 dark:bg-[#1A1C23] rounded-lg p-4 border border-slate-200 dark:border-slate-800">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Emission Status</h5>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-500">Current Trend</span>
          <span className={`text-xs font-bold ${factory.emissionTrend === 'Spiking' ? 'text-red-500' : 'text-emerald-500'}`}>{factory.emissionTrend}</span>
        </div>
        <div className="h-16 flex items-end gap-1 opacity-70">
          {/* Mock bar chart */}
          {[40, 45, 30, 50, 60, 80, 95].map((val, i) => (
            <div key={i} className={`flex-1 rounded-t-sm ${val > 70 ? 'bg-red-500' : 'bg-slate-400 dark:bg-slate-600'}`} style={{ height: `${val}%` }} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
          <span className="text-slate-500">Permit Status</span>
          <span className={`font-medium ${factory.permitStatus === 'Valid' ? 'text-emerald-500' : 'text-red-500'}`}>{factory.permitStatus}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
          <span className="text-slate-500">Last Inspection</span>
          <span className="text-slate-900 dark:text-slate-300 font-medium">{factory.lastInspection}</span>
        </div>
      </div>
    </>
  );
}

// ── HOSPITAL VIEW ──
function HospitalView({ hospital }: { hospital: Hospital }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{hospital.name}</h4>
      </div>
      
      <div className="bg-slate-50 dark:bg-[#1A1C23] rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Air Quality Risk</h5>
        <div className={`p-3 rounded border ${hospital.airQualityStatus === 'Safe' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
          <div className="font-bold text-sm mb-1">{hospital.airQualityStatus}</div>
          <div className="text-xs opacity-80">
            {hospital.airQualityStatus === 'Safe' ? 'HVAC filtration operating normally.' : 'External particulate matter breaching filtration limits. Close intakes immediately.'}
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-[#1A1C23] p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
      </div>
      <div className="text-sm font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
