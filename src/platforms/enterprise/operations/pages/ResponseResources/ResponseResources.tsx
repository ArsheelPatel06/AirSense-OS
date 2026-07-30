import React, { useState } from 'react';
import { ReadinessHeader } from './components/ReadinessHeader';
import { ResourceDirectory } from './components/ResourceDirectory';
import { ResourceRoster } from './components/ResourceRoster';
import { ResourceProfile } from './components/ResourceProfile';
import { DispatchDrawer } from './components/DispatchDrawer';
import { useOpsStore } from '../../context/OpsContext';

export function ResponseResources() {
  const { state } = useOpsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Select first resource by default
  const [selectedResourceId, setSelectedResourceId] = useState<string>(state.teams[0]?.id || '');
  
  const [isDispatchDrawerOpen, setIsDispatchDrawerOpen] = useState(false);

  // Filtering
  const filteredResources = state.teams.filter(res => {
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Personnel' && res.category !== 'Personnel') return false;
      if (selectedCategory === 'Vehicles' && res.type !== 'Command Van' && res.type !== 'Mobile Lab' && res.type !== 'Sensor Van') return false;
      if (selectedCategory === 'Equipment' && res.category !== 'Equipment') return false;
      // Detailed subtypes like 'Hazmat'
      const isSubtype = ['Hazmat', 'Traffic', 'Environmental', 'Command', 'Medical'].includes(selectedCategory);
      if (isSubtype && res.type !== selectedCategory) return false;
      
      const isVehicleType = ['Command Vans', 'Mobile Labs', 'Sensor Vans'].includes(selectedCategory);
      if (selectedCategory === 'Command Vans' && res.type !== 'Command Van') return false;
      if (selectedCategory === 'Mobile Labs' && res.type !== 'Mobile Lab') return false;
      if (selectedCategory === 'Sensor Vans' && res.type !== 'Sensor Van') return false;
      
      const isEqType = ['Portable Sensors', 'Drones', 'Gateways'].includes(selectedCategory);
      if (selectedCategory === 'Portable Sensors' && res.type !== 'Portable Sensor') return false;
      if (selectedCategory === 'Drones' && res.type !== 'Drone') return false;
      if (selectedCategory === 'Gateways' && res.type !== 'Gateway') return false;
    }
    
    if (selectedStatus !== 'All' && res.status !== selectedStatus) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!res.name.toLowerCase().includes(q) && !res.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const selectedResource = state.teams.find(r => r.id === selectedResourceId) || state.teams[0];

  React.useEffect(() => {
    if (filteredResources.length > 0 && !filteredResources.some(r => r.id === selectedResourceId)) {
      setSelectedResourceId(filteredResources[0].id);
    }
  }, [filteredResources, selectedResourceId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0E0F12]">
      {/* Header spanning full width */}
      <ReadinessHeader />
      
      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Directory (Fixed width) */}
        <div className="w-[280px] min-w-[280px] max-w-[280px] border-r border-slate-200 dark:border-[#38383A] shrink-0 bg-white dark:bg-[#1C1C1E] flex flex-col">
          <ResourceDirectory 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
          />
        </div>
        
        {/* Center: Roster (Flexible width) */}
        <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-[#38383A] bg-[#F1F5F9] dark:bg-[#121214] min-w-0">
          <ResourceRoster 
            resources={filteredResources}
            selectedId={selectedResourceId}
            onSelect={setSelectedResourceId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        
        {/* Right: Profile (Fixed width) */}
        <div className="w-[400px] min-w-[400px] max-w-[400px] shrink-0 bg-white dark:bg-[#1C1C1E] flex flex-col">
          <ResourceProfile 
            resource={selectedResource} 
            onOpenDispatch={() => setIsDispatchDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Dispatch Drawer */}
      <DispatchDrawer 
        isOpen={isDispatchDrawerOpen}
        onClose={() => setIsDispatchDrawerOpen(false)}
        resource={selectedResource}
      />
    </div>
  );
}
