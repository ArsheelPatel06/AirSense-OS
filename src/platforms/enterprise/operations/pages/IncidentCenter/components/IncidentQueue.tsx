import React from 'react';
import { Search, ShieldAlert, Clock, MapPin, Activity } from 'lucide-react';
import type { Incident } from '../mockData';

interface IncidentQueueProps {
  incidents: Incident[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filter: string;
  onFilterChange: (val: string) => void;
}

const FILTERS = ['All', 'Critical', 'High', 'Medium', 'Resolved', 'My Shift', 'Today', 'Last 24h', 'Open', 'Closed'];

export function IncidentQueue({
  incidents,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange
}: IncidentQueueProps) {
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      case 'resolved': return 'bg-slate-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-[#121214]">
      {/* Top Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[var(--color-ops-brand)]" />
            Incident Queue
          </h2>
          <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-[#2C2E33] text-slate-600 dark:text-slate-300 rounded-full">
            {incidents.length}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search ID, Location, Pollutant..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0E0F12] border border-slate-200 dark:border-[#38383A] rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-ops-brand)] focus:ring-1 focus:ring-[var(--color-ops-brand)] transition-all"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors ${
                filter === f 
                  ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' 
                  : 'bg-slate-100 dark:bg-[#2C2E33] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#38383A]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {incidents.length === 0 ? (
          <div className="text-center p-6 text-slate-500 dark:text-slate-400 text-sm">
            No incidents match your filters.
          </div>
        ) : (
          incidents.map(incident => (
            <div 
              key={incident.id}
              onClick={() => onSelect(incident.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden group ${
                selectedId === incident.id
                  ? 'border-[var(--color-ops-brand)] bg-slate-50 dark:bg-[#25262B] shadow-lg'
                  : 'border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              {/* Selected indicator line */}
              {selectedId === incident.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-ops-brand)]"></div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <div className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">{incident.id}</span>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 leading-tight">
                {incident.title}
              </h3>
              
              <div className="flex flex-col gap-1.5 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{incident.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Reported {incident.reportedTime} ({incident.elapsedTime})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#38383A]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{incident.status}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Assigned To</span>
                  <span className="text-xs font-semibold text-[var(--color-ops-brand)] truncate max-w-[100px]">
                    {incident.assignedTeam ? incident.assignedTeam.name : 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
