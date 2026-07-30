import React from 'react';
import type { Incident, ResponseTeam, SensorNode } from '../types';
import { AlertTriangle, Zap, Users, Activity, MapPin, Clock, Wifi, WifiOff, Activity as ActivityIcon, ChevronRight, ChevronLeft } from 'lucide-react';

interface OperationsDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  incidents: Incident[];
  teams: ResponseTeam[];
  sensors: SensorNode[];
  onIncidentClick: (incident: Incident) => void;
  onActionClick: (actionId: string) => void;
}

export function OperationsDrawer({ isOpen, onToggle, incidents, teams, sensors, onIncidentClick, onActionClick }: OperationsDrawerProps) {
  return (
    <div className={`absolute top-0 right-0 bottom-16 w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col z-10 pointer-events-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Toggle Button */}
      <button 
        onClick={onToggle}
        className="absolute top-4 -left-8 w-8 h-10 bg-white dark:bg-slate-900 border-y border-l border-slate-200 dark:border-slate-700 rounded-l-lg shadow-[-4px_0_10px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 shrink-0 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Operations Center
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Section 1: AI Assistant */}
        <section>
          <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[12px] font-bold text-indigo-900 dark:text-indigo-300">AI Operational Assistant</span>
            </div>
            <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">Industrial plume moving northeast.</span> Expected impact in Sector 5 within 35 minutes.
            </p>
            <div className="flex items-center justify-between text-[11px] mb-4 bg-white dark:bg-slate-800 rounded p-2 border border-indigo-100 dark:border-slate-700">
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase">Confidence</span>
                <span className="text-indigo-700 dark:text-indigo-400 font-bold text-[14px]">91%</span>
              </div>
              <div className="w-px h-8 bg-indigo-100 dark:bg-slate-700" />
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold uppercase">ETA to Sector 5</span>
                <span className="text-slate-900 dark:text-white font-bold text-[14px]">35 min</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onActionClick('evidence')} className="py-1.5 px-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded transition-colors shadow-sm">View Evidence</button>
              <button onClick={() => onActionClick('alert')} className="py-1.5 px-2 bg-red-600 hover:bg-red-700 border border-red-700 text-white text-[11px] font-bold rounded transition-colors shadow-sm">Broadcast Warning</button>
              <button onClick={() => onActionClick('assign')} className="py-1.5 px-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded transition-colors shadow-sm">Assign Team</button>
              <button onClick={() => onActionClick('forecast')} className="py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-700 text-white text-[11px] font-bold rounded transition-colors shadow-sm">Open Forecast</button>
            </div>
          </div>
        </section>

        {/* Section 2: Active Incidents */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Active Incidents
          </h3>
          <div className="flex flex-col gap-2">
            {incidents.slice(0, 3).map(inc => (
              <div key={inc.id} onClick={() => onIncidentClick(inc)} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer group shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    inc.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                    inc.severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                    'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800'
                  }`}>{inc.severity}</span>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{inc.duration}</span>
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{inc.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {inc.location}</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">{inc.assigned}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Response Teams */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> Response Teams
          </h3>
          <div className="flex flex-col gap-2">
            {teams.map(team => (
              <div key={team.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">{team.name}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    team.availability === 'Available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400' :
                    team.availability === 'Dispatched' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}>{team.availability}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="block text-slate-500 font-medium">Task</span>
                    <span className="text-slate-900 dark:text-white font-medium">{team.task}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-medium">ETA / Location</span>
                    <span className="text-slate-900 dark:text-white font-medium">{team.eta} • {team.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Sensor Network */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ActivityIcon className="w-3.5 h-3.5" /> Sensor Network
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-500" /> Online Nodes</span>
              <span className="text-[20px] font-bold text-slate-900 dark:text-white">1,204</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><WifiOff className="w-3 h-3 text-red-500" /> Offline</span>
              <span className="text-[20px] font-bold text-slate-900 dark:text-white">12</span>
            </div>
            <div className="col-span-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm flex justify-between items-center text-[12px]">
              <span className="text-slate-500 font-medium">MQTT Gateway</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">Connected <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /></span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
