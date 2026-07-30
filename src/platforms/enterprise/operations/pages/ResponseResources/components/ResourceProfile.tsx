import React from 'react';
import { 
  Truck, MapPin, Radio, Clock, Shield, Users, Zap, Activity, 
  Share, History, Crosshair, Navigation, Camera, Wind,
  AlertOctagon, CheckCircle2, ChevronRight
} from 'lucide-react';
import type { OperationsResource, ResourceType } from '../mockData';

interface ResourceProfileProps {
  resource: OperationsResource;
  onOpenDispatch: () => void;
}

export function ResourceProfile({ resource, onOpenDispatch }: ResourceProfileProps) {

  const getIconForType = (type: ResourceType) => {
    switch(type) {
      case 'Hazmat': return <Shield className="w-8 h-8 text-white" />;
      case 'Traffic': return <Users className="w-8 h-8 text-white" />;
      case 'Drone': return <Zap className="w-8 h-8 text-white" />;
      default: return <Truck className="w-8 h-8 text-white" />;
    }
  };
  
  const getCapabilityIcon = (iconName: string) => {
    switch(iconName) {
      case 'flask': return <AlertOctagon className="w-3.5 h-3.5" />;
      case 'biohazard': return <AlertOctagon className="w-3.5 h-3.5" />;
      case 'shower': return <Shield className="w-3.5 h-3.5" />;
      case 'barrier': return <AlertOctagon className="w-3.5 h-3.5" />;
      case 'police': return <Users className="w-3.5 h-3.5" />;
      case 'route': return <Navigation className="w-3.5 h-3.5" />;
      case 'flame': return <Activity className="w-3.5 h-3.5" />;
      case 'camera': return <Camera className="w-3.5 h-3.5" />;
      case 'wind': return <Wind className="w-3.5 h-3.5" />;
      case 'particulate': return <CloudIcon className="w-3.5 h-3.5" />;
      case 'chemical': return <AlertOctagon className="w-3.5 h-3.5" />;
      case 'sun': return <Zap className="w-3.5 h-3.5" />;
      default: return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch(priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10';
      case 'High': return 'text-orange-500 bg-orange-500/10';
      case 'Medium': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C1C1E] overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 flex flex-col gap-8">
        
        {/* CURRENT MISSION */}
        {resource.currentAssignment ? (
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-[var(--color-ops-brand)]" />
              Current Mission
            </h3>
            
            <div className="p-4 rounded-xl border border-[var(--color-ops-brand)]/30 bg-[var(--color-ops-brand)]/5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-[var(--color-ops-brand)]">{resource.currentAssignment}</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{resource.locationDesc}</span>
                </div>
                {resource.missionPriority && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(resource.missionPriority)}`}>
                    {resource.missionPriority}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Started</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{resource.missionStarted || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elapsed</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{resource.missionElapsed || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ETA Finish</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{resource.etaFinish || 'N/A'}</span>
                </div>
                {resource.commander && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commander</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{resource.commander}</span>
                  </div>
                )}
              </div>
              
              {resource.missionProgress !== null && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-500">Mission Progress</span>
                    <span className="text-[var(--color-ops-brand)]">{resource.missionProgress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 dark:bg-[#2C2E33] overflow-hidden">
                    <div className="h-full bg-[var(--color-ops-brand)] rounded-full" style={{ width: `${resource.missionProgress}%` }}></div>
                  </div>
                </div>
              )}
              
              <button className="text-[10px] font-bold uppercase text-[var(--color-ops-brand)] hover:underline flex items-center justify-center gap-1 mt-1">
                Open Incident <Navigation className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              Current Mission
            </h3>
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-[#38383A] flex items-center justify-center text-xs font-semibold text-slate-500">
              Unassigned
            </div>
          </div>
        )}

        {/* RESOURCE IDENTITY */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Resource</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-slate-800 dark:bg-[#38383A] flex items-center justify-center shadow-md shrink-0">
              {getIconForType(resource.type)}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">{resource.name}</h2>
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">{resource.id} • {resource.type}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#2C2E33] mb-4">
            {resource.members !== null && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {resource.members} Members
              </div>
            )}
            {resource.vehicleAssigned && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                {resource.vehicleAssigned}
              </div>
            )}
            {resource.radioStatus && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Radio className={`w-3.5 h-3.5 ${resource.radioStatus === 'Connected' ? 'text-green-500' : 'text-slate-400'}`} />
                {resource.radioStatus}
              </div>
            )}
          </div>
          
          <button 
            onClick={onOpenDispatch}
            className="w-full py-2.5 rounded-lg bg-[var(--color-ops-brand)] hover:bg-[var(--color-ops-brand-hover)] text-white text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Share className="w-4 h-4" /> Assign to Incident
          </button>
        </div>

        {/* AVAILABILITY & CAPABILITIES SIDE BY SIDE */}
        <div className="grid grid-cols-2 gap-4">
          {/* AVAILABILITY */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Availability
            </h3>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col gap-3 h-[120px] justify-center">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mission Status</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${resource.status === 'Available' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></span>
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white">{resource.status === 'Available' ? 'Available' : 'Busy'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Available</span>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{resource.status === 'Available' ? 'Now' : resource.etaFinish || 'TBD'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue Position</span>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">1</span>
              </div>
              
            </div>
          </div>

          {/* CAPABILITIES */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Capabilities
            </h3>
            <div className="flex flex-col gap-1.5 h-[120px] overflow-y-auto scrollbar-thin pr-1">
              {resource.capabilities.map(cap => (
                <span key={cap.name} className="w-full px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-md shadow-sm">
                  {getCapabilityIcon(cap.icon)}
                  <span className="truncate">{cap.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DYNAMIC OPERATIONAL STATUS */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Operational Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {resource.fuelLevel !== null && (
              <div className="p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fuel</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{resource.fuelLevel}%</span>
              </div>
            )}
            {resource.batteryLevel !== null && (
              <div className="p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Battery</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{resource.batteryLevel}%</span>
              </div>
            )}
            {resource.shiftRemaining !== null && (
              <div className="p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shift</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{resource.shiftRemaining}</span>
              </div>
            )}
            {resource.flightTime !== null && (
              <div className="p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Flight Time</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{resource.flightTime}</span>
              </div>
            )}
            {resource.signalStrength !== null && (
              <div className="p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Signal</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{resource.signalStrength}</span>
              </div>
            )}
            {resource.calibration !== null && (
              <div className="p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Calibration</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{resource.calibration}</span>
              </div>
            )}
          </div>
        </div>

        {/* RESOURCE HISTORY */}
        {resource.history && (
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Resource History
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-[#2C2E33]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Mission</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{resource.history.lastMission}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{resource.history.lastMissionDate}</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Time</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{resource.history.avgResponseTime}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{resource.history.completedMissions}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Success</span>
                    <span className="text-xs font-bold text-green-500">{resource.history.successRate}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maint</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{resource.lastMaintenance || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEARBY RESOURCES */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Closest Available Resources
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] hover:border-slate-300 dark:hover:border-[#505055] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Hazmat Bravo</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-300">ETA 4 min</span>
                <span className="text-xs font-bold text-[var(--color-ops-brand)]">3.2 km</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] hover:border-slate-300 dark:hover:border-[#505055] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Lab 2</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-300">ETA 8 min</span>
                <span className="text-xs font-bold text-[var(--color-ops-brand)]">5.0 km</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] hover:border-slate-300 dark:hover:border-[#505055] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Drone Unit 6</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-300">ETA 6 min</span>
                <span className="text-xs font-bold text-[var(--color-ops-brand)]">6.0 km</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function CloudIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5S20 10 17.5 10c-.3 0-.6 0-.8.1-.5-2.9-3-5.1-6-5.1-3.1 0-5.7 2.3-6.1 5.4C2 10.7 0 13.1 0 16c0 3.3 2.7 6 6 6"/>
      <circle cx="9" cy="18" r="1"/>
      <circle cx="14" cy="18" r="1"/>
    </svg>
  );
}
