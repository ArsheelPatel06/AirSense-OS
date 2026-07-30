import { Search, MapPin, Users, Shield, Zap, Truck, Radio, Plane, TerminalSquare, Stethoscope, Database } from 'lucide-react';
import type { OperationsResource, ResourceType } from '../mockData';

interface ResourceRosterProps {
  resources: OperationsResource[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function ResourceRoster({
  resources,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange
}: ResourceRosterProps) {

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-green-500';
      case 'On Site': return 'bg-indigo-500';
      case 'Assigned': 
      case 'En Route': return 'bg-blue-500';
      case 'Returning': return 'bg-orange-500';
      case 'Maintenance': return 'bg-yellow-500';
      case 'Offline': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getIconForType = (type: ResourceType) => {
    switch(type) {
      case 'Hazmat': return <Shield className="w-4 h-4 text-white" />;
      case 'Traffic': return <Users className="w-4 h-4 text-white" />;
      case 'Environmental': return <Database className="w-4 h-4 text-white" />;
      case 'Command': return <TerminalSquare className="w-4 h-4 text-white" />;
      case 'Medical': return <Stethoscope className="w-4 h-4 text-white" />;
      case 'Command Van':
      case 'Sensor Van':
      case 'Mobile Lab': return <Truck className="w-4 h-4 text-white" />;
      case 'Drone': return <Plane className="w-4 h-4 text-white" />;
      case 'Portable Sensor': return <Zap className="w-4 h-4 text-white" />;
      case 'Gateway':
      case 'Communications': return <Radio className="w-4 h-4 text-white" />;
      default: return <Users className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-200 dark:border-[#38383A] shrink-0 bg-white dark:bg-[#1C1C1E] flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Roster
          <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-[#2C2E33] text-slate-600 dark:text-slate-300 rounded-full">
            {resources.length}
          </span>
        </h2>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search team, vehicle, sensor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)] transition-colors"
          />
        </div>
      </div>

      {/* Roster Header row */}
      <div className="grid grid-cols-12 gap-3 px-6 py-2 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <div className="col-span-3">Resource</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3">Assignment / Location</div>
        <div className="col-span-2 text-right">Availability</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {resources.length === 0 ? (
          <div className="text-center p-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
            No resources match the current filters.
          </div>
        ) : (
          <div className="flex flex-col">
            {resources.map(res => (
              <div 
                key={res.id}
                onClick={() => onSelect(res.id)}
                className={`grid grid-cols-12 gap-3 px-6 py-2.5 items-center border-b border-slate-100 dark:border-[#2C2E33] transition-colors cursor-pointer ${
                  selectedId === res.id
                    ? 'bg-blue-50 dark:bg-[#25262B] relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[var(--color-ops-brand)]'
                    : 'bg-white dark:bg-[#1C1C1E] hover:bg-slate-50 dark:hover:bg-[#25262B]'
                }`}
              >
                
                {/* Identity */}
                <div className="col-span-3 flex items-center gap-3 overflow-hidden">
                  <div className={`w-7 h-7 rounded-md shrink-0 flex items-center justify-center shadow-sm ${selectedId === res.id ? 'bg-[var(--color-ops-brand)]' : 'bg-slate-700 dark:bg-[#38383A]'}`}>
                    {getIconForType(res.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{res.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{res.id}</span>
                  </div>
                </div>

                {/* Type */}
                <div className="col-span-2 flex items-center">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">{res.type}</span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(res.status)} ${res.status === 'On Site' || res.status === 'En Route' ? 'animate-pulse' : ''}`}></div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{res.status}</span>
                </div>

                {/* Assignment / Location */}
                <div className="col-span-3 flex flex-col min-w-0">
                  {res.currentAssignment ? (
                    <span className="text-xs font-bold text-[var(--color-ops-brand)] truncate">{res.currentAssignment}</span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 italic truncate">Unassigned</span>
                  )}
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{res.locationDesc}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="col-span-2 flex flex-col items-end gap-0.5 text-xs">
                  {res.shiftRemaining && (
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="text-[9px] font-bold uppercase">Shift</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{res.shiftRemaining}</span>
                    </div>
                  )}
                  {res.batteryLevel !== null && (
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="text-[9px] font-bold uppercase">Bat</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{res.batteryLevel}%</span>
                    </div>
                  )}
                  {res.signalStrength !== null && (
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="text-[9px] font-bold uppercase">Sig</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{res.signalStrength}</span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
