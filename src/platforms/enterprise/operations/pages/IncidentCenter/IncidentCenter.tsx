import React, { useState, useEffect } from 'react';
import { useOpsStore } from '../../context/OpsContext';
import { IncidentQueue } from './components/IncidentQueue';
import { IncidentDetails } from './components/IncidentDetails';
import { ResponseWorkspace } from './components/ResponseWorkspace';
import { IncidentTimeline } from './components/IncidentTimeline';
import { IncidentHeader } from './components/IncidentHeader';

export function IncidentCenter() {
  const { state } = useOpsStore();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(state.incidents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const selectedIncident = state.incidents.find(inc => inc.id === selectedIncidentId) || state.incidents[0];

  const filteredIncidents = state.incidents.filter(inc => {
    // Filter
    if (filter !== 'All') {
      if (filter.toLowerCase() === 'mine') {
        // Mock 'mine' logic
      } else if (filter.toLowerCase() === 'unassigned') {
        if (inc.assignedTeam !== null) return false;
      } else {
        if (inc.severity.toLowerCase() !== filter.toLowerCase()) return false;
      }
    }
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!inc.id.toLowerCase().includes(q) &&
          !inc.location.toLowerCase().includes(q) &&
          !inc.zone.toLowerCase().includes(q) &&
          !inc.pollutant.toLowerCase().includes(q) &&
          !(inc.assignedTeam?.name.toLowerCase().includes(q))) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-[#0E0F12] text-slate-900 dark:text-white animate-in fade-in duration-500">
      <IncidentHeader />
      
      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">
        {/* Top 3 columns */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left Panel: Queue */}
          <div className="col-span-3 flex flex-col min-h-0 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl shadow-sm overflow-hidden">
            <IncidentQueue 
              incidents={filteredIncidents}
              selectedId={selectedIncidentId}
              onSelect={setSelectedIncidentId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
          
          {/* Middle Panel: Details */}
          <div className="col-span-5 flex flex-col min-h-0 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl shadow-sm overflow-y-auto scrollbar-thin">
            <IncidentDetails incident={selectedIncident} />
          </div>
          
          {/* Right Panel: Response Workspace */}
          <div className="col-span-4 flex flex-col min-h-0 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl shadow-sm overflow-y-auto scrollbar-thin">
            <ResponseWorkspace incident={selectedIncident} />
          </div>
        </div>
        
        {/* Bottom Panel: Timeline */}
        <div className="h-48 shrink-0 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <IncidentTimeline timeline={selectedIncident.timeline} />
        </div>
      </div>
    </div>
  );
}
