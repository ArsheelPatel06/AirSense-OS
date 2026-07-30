import React from 'react';
import type { Layer, Incident, ResponseTeam, SensorNode, SelectedEntity, Factory, Hospital } from '../types';
import { Truck, AlertTriangle, Activity, MapPin, Factory as FactoryIcon, Building2, Wind } from 'lucide-react';
import { MOCK_FACTORIES, MOCK_HOSPITALS } from '../mockData';

interface GISViewportProps {
  layers: Layer[];
  incidents: Incident[];
  teams: ResponseTeam[];
  sensors: SensorNode[];
  mapCenter: { x: number; y: number };
  mapZoom?: number;
  onEntityClick: (entity: SelectedEntity) => void;
  selectedEntity: SelectedEntity;
}

export function GISViewport({ layers, incidents, teams, sensors, mapCenter, mapZoom = 1.5, onEntityClick, selectedEntity }: GISViewportProps) {
  const isLayerActive = (id: string) => layers.find(l => l.id === id)?.active;

  // Safe clamping for the viewport panning
  const safeX = Math.max(10, Math.min(90, mapCenter.x));
  const safeY = Math.max(10, Math.min(90, mapCenter.y));

  return (
    <div className="absolute inset-0 bg-[#E5E7EB] dark:bg-[#0B101E] overflow-hidden select-none">
      
      {/* ── MAP CONTAINER ── */}
      <div 
        className="absolute w-[300vw] h-[300vh] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center"
        style={{ 
          top: '-100vh', left: '-100vw',
          transform: `translate(${50 - safeX}vw, ${50 - safeY}vh) scale(${mapZoom})` 
        }}
      >
        
        {/* ── 1. SVG CITY MAP ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* Water Bodies */}
          <path d="M 0 30 Q 20 40 40 20 T 80 40 T 100 20 L 100 0 L 0 0 Z" className="fill-[#93C5FD] dark:fill-[#1E3A8A]/30" />
          <path d="M 20 80 Q 40 70 60 90 T 100 80 L 100 100 L 0 100 L 0 80 Z" className="fill-[#93C5FD] dark:fill-[#1E3A8A]/30" />

          {/* Parks */}
          <path d="M 10 40 Q 25 35 30 50 T 15 65 Z" className="fill-[#BBF7D0] dark:fill-[#064E3B]/30" />
          <path d="M 70 60 Q 80 50 90 70 T 75 85 Z" className="fill-[#BBF7D0] dark:fill-[#064E3B]/30" />

          {/* Industrial Districts */}
          <path d="M 60 20 L 80 15 L 95 30 L 75 45 Z" className="fill-[#E2E8F0] dark:fill-[#334155]/40" />
          
          {/* Administrative / CBD */}
          <path d="M 40 40 L 60 40 L 65 60 L 35 60 Z" className="fill-[#CBD5E1] dark:fill-[#475569]/40" />

          {/* Roads & Highways */}
          <g className="stroke-[#94A3B8] dark:stroke-[#64748B]/50 fill-none" strokeWidth="0.2">
            <path d="M 0 50 L 100 50" />
            <path d="M 50 0 L 50 100" />
            <path d="M 20 0 L 20 100" />
            <path d="M 80 0 L 80 100" />
            <path d="M 0 30 L 100 30" />
            <path d="M 0 70 L 100 70" />
            {/* Minor streets */}
            <path d="M 35 30 L 35 70" strokeWidth="0.1" />
            <path d="M 65 30 L 65 70" strokeWidth="0.1" />
            <path d="M 20 40 L 80 40" strokeWidth="0.1" />
            <path d="M 20 60 L 80 60" strokeWidth="0.1" />
          </g>

          {/* Traffic Animations */}
          {isLayerActive('traffic') && (
            <g className="stroke-[#F59E0B] fill-none" strokeWidth="0.3" opacity="0.8">
              <path d="M 0 49.8 L 100 49.8" strokeDasharray="1 3" className="animate-[dash_5s_linear_infinite]" />
              <path d="M 100 50.2 L 0 50.2" strokeDasharray="1 3" className="animate-[dash_6s_linear_infinite_reverse]" />
              <path d="M 49.8 0 L 49.8 100" strokeDasharray="1 3" className="animate-[dash_4s_linear_infinite]" />
              <path d="M 80.2 100 L 80.2 0" strokeDasharray="1 3" className="animate-[dash_5s_linear_infinite_reverse]" />
            </g>
          )}

          {/* Wind Particles */}
          {isLayerActive('wind') && (
            <g className="stroke-[#60A5FA] fill-none" strokeWidth="0.1" opacity="0.4" strokeDasharray="2 4">
              <path d="M 10 10 Q 30 20 50 10 T 90 10" className="animate-[dash_10s_linear_infinite]" />
              <path d="M 0 30 Q 40 40 60 20 T 100 30" className="animate-[dash_8s_linear_infinite]" />
              <path d="M 10 50 Q 50 60 70 40 T 100 60" className="animate-[dash_12s_linear_infinite]" />
              <path d="M 0 80 Q 30 90 60 70 T 90 90" className="animate-[dash_9s_linear_infinite]" />
              <path d="M 20 100 Q 40 80 60 90 T 100 70" className="animate-[dash_11s_linear_infinite]" />
            </g>
          )}
        </svg>

        {/* ── 2. ORGANIC POLLUTION HEATMAP ── */}
        {isLayerActive('aqi') && (
          <div className="absolute inset-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70">
            {/* North Industrial Plume */}
            <div className="absolute w-[30vw] h-[25vh] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.6)_0%,rgba(245,158,11,0.3)_40%,transparent_70%)] blur-2xl top-[25%] left-[65%] animate-pulse" />
            {/* East Market Plume */}
            <div className="absolute w-[20vw] h-[20vh] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.5)_0%,transparent_60%)] blur-xl top-[55%] left-[40%]" />
            {/* Construction Dust */}
            <div className="absolute w-[15vw] h-[15vh] bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.4)_0%,transparent_70%)] blur-lg top-[70%] left-[50%]" />
          </div>
        )}

        {/* ── 3. MAP MARKERS (Factories, Hospitals, Sensors, Incidents, Teams) ── */}

        {/* Factories */}
        {MOCK_FACTORIES.map(factory => {
          const isSelected = selectedEntity?.type === 'factory' && selectedEntity.data.id === factory.id;
          return (
            <div 
              key={factory.id}
              onClick={() => onEntityClick({ type: 'factory', data: { ...factory, permitStatus: factory.permitStatus as 'Valid' | 'Expired' | 'Suspended' } })}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ top: `${factory.y}%`, left: `${factory.x}%` }}
            >
              {/* Animated Smoke Plume (if active) */}
              {factory.emissionTrend === 'Spiking' && (
                <div className="absolute -top-12 left-2 w-8 h-16 bg-gradient-to-t from-gray-500/50 to-transparent blur-md -skew-x-12 animate-pulse origin-bottom" />
              )}
              <div className={`p-2 rounded shadow-md border ${isSelected ? 'bg-slate-800 border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.5)] z-20' : 'bg-slate-700 border-slate-600 hover:border-slate-400'}`}>
                <FactoryIcon className={`w-4 h-4 ${isSelected ? 'text-[#0A84FF]' : 'text-slate-300'}`} />
              </div>
              <div className="absolute mt-1 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                {factory.name}
              </div>
            </div>
          );
        })}

        {/* Hospitals */}
        {MOCK_HOSPITALS.map(hospital => {
          const isSelected = selectedEntity?.type === 'hospital' && selectedEntity.data.id === hospital.id;
          return (
            <div key={hospital.id} className="absolute pointer-events-auto cursor-pointer group" style={{ left: `${hospital.x}%`, top: `${hospital.y}%`, transform: 'translate(-50%, -50%)' }} onClick={() => onEntityClick({ type: 'hospital', data: hospital })}>
              <div className={`p-2 rounded shadow-md border ${isSelected ? 'bg-slate-800 border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.5)] z-20' : 'bg-slate-700 border-slate-600 hover:border-slate-400'}`}>
                <Building2 className={`w-4 h-4 ${isSelected ? 'text-[#0A84FF]' : 'text-red-400'}`} />
              </div>
              <div className="absolute mt-1 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                {hospital.name}
              </div>
            </div>
          );
        })}

        {/* Sensors */}
        {isLayerActive('sensors') && sensors.map(sensor => {
          const isSelected = selectedEntity?.type === 'sensor' && selectedEntity.data.id === sensor.id;
          return (
            <div key={sensor.id} className="absolute pointer-events-auto cursor-pointer group" style={{ left: `${sensor.x}%`, top: `${sensor.y}%`, transform: 'translate(-50%, -50%)' }} onClick={() => onEntityClick({ type: 'sensor', data: sensor })}>
              <div className={`w-2 h-2 rounded-full border ${sensor.status === 'Online' ? 'bg-emerald-500 border-emerald-300' : 'bg-red-500 border-red-300'} ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 z-20 scale-150' : 'hover:scale-125'} transition-all`} />
              <div className="absolute mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded border border-slate-700 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                <div className="font-bold text-emerald-400">{sensor.id}</div>
                <div className="text-slate-400 text-[9px]">Last Sync: Just now</div>
              </div>
            </div>
          );
        })}

        {/* Incidents */}
        {isLayerActive('incidents') && incidents.map(incident => {
          const isSelected = selectedEntity?.type === 'incident' && selectedEntity.data.id === incident.id;
          const color = incident.severity === 'critical' ? 'text-red-500 bg-red-500/20 border-red-500/50' : incident.severity === 'warning' ? 'text-amber-500 bg-amber-500/20 border-amber-500/50' : 'text-blue-500 bg-blue-500/20 border-blue-500/50';
          
          return (
            <div key={incident.id} className="absolute pointer-events-auto cursor-pointer group" style={{ left: `${incident.x}%`, top: `${incident.y}%`, transform: 'translate(-50%, -100%)' }} onClick={() => onEntityClick({ type: 'incident', data: incident })}>
              <div className={`relative flex flex-col items-center ${isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-110'} transition-transform`}>
                <div className={`p-1.5 rounded-full border shadow-lg backdrop-blur ${color} ${isSelected ? 'ring-2 ring-white shadow-[0_0_20px_currentColor]' : ''}`}>
                  <AlertTriangle className="w-5 h-5 fill-current text-white/90" />
                </div>
                <div className="w-0.5 h-6 bg-gradient-to-b from-current to-transparent opacity-50" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/90 px-3 py-1.5 rounded border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <div className="font-bold text-white text-xs">{incident.title}</div>
                  <div className="text-slate-400 text-[10px]">{incident.location}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Response Teams */}
        {isLayerActive('teams') && teams.map(team => {
          const isSelected = selectedEntity?.type === 'team' && selectedEntity.data.id === team.id;
          return (
            <div key={team.id} className="absolute pointer-events-auto cursor-pointer group" style={{ left: `${team.x}%`, top: `${team.y}%`, transform: 'translate(-50%, -50%)' }} onClick={() => onEntityClick({ type: 'team', data: team })}>
              {/* Route Line (Mock) */}
              {team.availability === 'Dispatched' && (
                <svg className="absolute w-[20vw] h-[20vh] -top-[10vh] -left-[10vw] pointer-events-none origin-center" viewBox="0 0 100 100">
                  <path d="M 50 50 L 75 25" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite_reverse]" />
                </svg>
              )}
              <div className={`p-1.5 bg-indigo-500 rounded-md shadow-lg border border-indigo-300 text-white ${isSelected ? 'ring-2 ring-white z-30 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'z-20 hover:scale-110'} transition-transform`}>
                <Truck className="w-4 h-4" />
              </div>
              <div className="absolute mt-1 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                <span className="font-bold">{team.name}</span> • ETA: {team.eta}
              </div>
            </div>
          );
        })}

      </div>
      
      {/* Global Map Styles for SVG animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}} />
    </div>
  );
}
