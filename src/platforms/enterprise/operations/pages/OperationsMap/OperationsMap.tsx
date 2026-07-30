import React, { useState } from 'react';
import { GISViewport } from './components/GISViewport';
import { TopFilterBar } from './components/TopFilterBar';
import { MapControls } from './components/MapControls';
import { OperationsSidebar } from './components/OperationsSidebar';
import { TimelineDock } from './components/TimelineDock';
import { LayerManager } from './components/LayerManager';
import { NavigatorMap } from './components/NavigatorMap';
import type { Incident, TimelineEvent, SelectedEntity } from './types';
import { MOCK_LAYERS, MOCK_INCIDENTS, MOCK_TEAMS, MOCK_SENSORS, MOCK_TIMELINE } from './mockData';
import { Search } from 'lucide-react';

export function OperationsMap() {
  const [layers, setLayers] = useState(MOCK_LAYERS);
  const [isLayerManagerOpen, setIsLayerManagerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>(null);
  const [mapZoom, setMapZoom] = useState(1.5);

  const isSidebarVisible = isSidebarOpen || selectedEntity !== null;

  const toggleLayer = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const handleEntityClick = (entity: SelectedEntity) => {
    setSelectedEntity(entity);
    setIsSidebarOpen(true);
    if (entity?.data?.x && entity?.data?.y) {
      setMapCenter({ x: entity.data.x, y: entity.data.y });
    }
  };

  const handleTimelineClick = (event: TimelineEvent) => {
    setMapCenter({ x: event.x, y: event.y });
    if (event.type === 'critical' || event.type === 'warning') {
      const inc = MOCK_INCIDENTS.find(i => i.x === event.x && i.y === event.y);
      if (inc) handleEntityClick({ type: 'incident', data: inc });
    }
  };

  const handleMapAction = (action: string) => {
    switch (action) {
      case 'zoom-in': setMapZoom(z => Math.min(z + 0.5, 4)); break;
      case 'zoom-out': setMapZoom(z => Math.max(z - 0.5, 1)); break;
      case 'pan': alert('Map panning enabled. Drag the map to explore.'); break;
      case 'reset': setMapZoom(1.5); setMapCenter({ x: 50, y: 50 }); break;
      case 'location': setMapCenter({ x: 50, y: 50 }); break;
      case 'layers': setIsLayerManagerOpen(!isLayerManagerOpen); break;
      case 'fullscreen': 
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
        break;
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-slate-50 dark:bg-[#0A0F1C] font-sans">
      
      {/* ── Background Full-Screen Map ── */}
      <GISViewport 
        layers={layers} 
        incidents={MOCK_INCIDENTS} 
        teams={MOCK_TEAMS} 
        sensors={MOCK_SENSORS} 
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        selectedEntity={selectedEntity}
        onEntityClick={handleEntityClick} 
      />

      {/* ── Top Left: Filter & Search Bar ── */}
      <TopFilterBar />
      
      {/* ── Right Map Controls (Zoom, My Location) ── */}
      <div 
        className="absolute z-20 pointer-events-auto transition-all duration-300"
        style={{ right: isSidebarVisible ? '336px' : '16px', bottom: '160px' }}
      >
        <MapControls onAction={handleMapAction} isLayerManagerOpen={isLayerManagerOpen} />
      </div>

      {/* ── Floating Layer Manager ── */}
      {isLayerManagerOpen && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 ml-48 z-20 pointer-events-auto shadow-2xl transition-transform duration-300" style={{ transform: `translateX(calc(-50% - ${isSidebarVisible ? '160px' : '0px'}))` }}>
          <LayerManager 
            layers={layers} 
            onToggleLayer={toggleLayer} 
            onClose={() => setIsLayerManagerOpen(false)} 
          />
        </div>
      )}

      {/* ── Right Context Panel ── */}
      <div className={`absolute top-0 bottom-0 right-0 z-30 pointer-events-auto flex flex-col transition-transform duration-300 ${isSidebarVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <OperationsSidebar 
          selectedEntity={selectedEntity}
          onClose={() => {
            setSelectedEntity(null);
            setIsSidebarOpen(false);
          }}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onEntitySelect={handleEntityClick}
        />
      </div>

      {/* ── Toggle Button for Sidebar (when closed) ── */}
      {!isSidebarVisible && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 right-4 z-20 bg-white/95 dark:bg-[#111318]/95 backdrop-blur border border-slate-200 dark:border-[#2C2E33] text-slate-700 dark:text-slate-300 p-2 rounded-lg shadow-xl hover:bg-slate-100 dark:hover:bg-[#1A1C23] pointer-events-auto"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      )}

      {/* ── Bottom Right: Mini Map ── */}
      <div 
        className="absolute bottom-4 z-20 pointer-events-auto transition-all duration-300"
        style={{ right: isSidebarVisible ? '336px' : '16px' }}
      >
         <NavigatorMap mapCenter={mapCenter} />
      </div>

      {/* ── Bottom Timeline Dock ── */}
      <div 
        className="absolute bottom-4 left-4 z-10 pointer-events-auto shadow-2xl transition-all duration-300"
        style={{ right: isSidebarVisible ? '544px' : '224px' }}
      >
        <TimelineDock 
          events={MOCK_TIMELINE} 
          onEventClick={handleTimelineClick} 
        />
      </div>

    </div>
  );
}
