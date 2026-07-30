import React from 'react';
import type { Incident } from '../mockData';
import { Activity, MapPin, Users, Wind, Camera, Plane, History, Radio, FileSearch, CheckCircle2, Cloud, AlertTriangle, Building, FileText, ChevronRight } from 'lucide-react';

const FLOW_STEPS = ['Detected', 'Verified', 'Assigned', 'Dispatched', 'On Site', 'Mitigation', 'Monitoring', 'Resolved', 'Closed'];

export function IncidentDetails({ incident }: { incident: Incident }) {
  
  const currentStepIndex = FLOW_STEPS.indexOf(incident.status);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-blue-500 bg-blue-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'resolved': return 'text-slate-500 bg-slate-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C1C1E]">
      {/* STICKY HEADER */}
      <div className="flex flex-col shrink-0">
        <div className="p-6 pb-4 border-b border-slate-200 dark:border-[#38383A]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 font-semibold mb-1">{incident.id}</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{incident.title}</h2>
            </div>
            <div className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-md ${getSeverityColor(incident.severity)}`}>
              {incident.severity}
            </div>
          </div>
        </div>

        {/* Status Flow */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
          <div className="relative overflow-x-auto scrollbar-hide pb-2">
            <div className="min-w-[600px] relative mt-2">
              {/* Track */}
              <div className="absolute top-2.5 left-4 right-4 h-1 bg-slate-200 dark:bg-[#38383A] rounded-full"></div>
              {/* Active Track */}
              <div 
                className="absolute top-2.5 left-4 h-1 bg-[var(--color-ops-brand)] rounded-full transition-all duration-500"
                style={{ width: `calc(${(currentStepIndex / (FLOW_STEPS.length - 1)) * 100}% - 16px)` }}
              ></div>
              
              <div className="relative flex justify-between">
                {FLOW_STEPS.map((step, idx) => {
                  const isPast = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 z-10 w-20 group">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors relative ${
                        isPast ? 'bg-[var(--color-ops-brand)] border-[var(--color-ops-brand)]' :
                        isCurrent ? 'bg-white dark:bg-[#1C1C1E] border-[var(--color-ops-brand)] ring-4 ring-[var(--color-ops-brand)]/20' :
                        'bg-white dark:bg-[#1C1C1E] border-slate-300 dark:border-[#38383A]'
                      }`}>
                        {isPast && <CheckCircle2 className="w-4 h-4 text-white" />}
                        {isCurrent && <div className="w-2 h-2 rounded-full bg-[var(--color-ops-brand)] animate-pulse shadow-[0_0_8px_var(--color-ops-brand)]"></div>}
                      </div>
                      <span className={`text-[9px] font-bold uppercase text-center flex items-center justify-center w-full gap-1 ${
                        isCurrent ? 'text-[var(--color-ops-brand)] scale-110 origin-top transition-transform' :
                        isPast ? 'text-slate-700 dark:text-slate-300' :
                        'text-slate-400'
                      }`}>
                        {isCurrent && <span className="text-[10px]">▶</span>}
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 flex flex-col gap-12">
        
        {/* Description & Meta Details */}
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {incident.details.description}
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-4 gap-x-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Type</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Air Quality</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Priority</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{incident.severity}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Reported By</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={incident.details.reportedBy}>{incident.details.reportedBy}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pollutant</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{incident.pollutant}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Current AQI</span>
              <span className="text-sm font-bold text-red-500">{incident.details.currentAqi}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Peak Reading</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{incident.details.peakReading}</span>
            </div>
          </div>
        </div>

        {/* Incident Summary Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Environment Context</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/30 border border-slate-100 dark:border-[#38383A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{incident.location}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/30 border border-slate-100 dark:border-[#38383A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Impact Area</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Activity className="w-3 h-3 text-slate-400 shrink-0" />
                <span>R: {incident.details.affectedRadius}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/30 border border-slate-100 dark:border-[#38383A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Pop</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Users className="w-3 h-3 text-slate-400 shrink-0" />
                {incident.details.estimatedPopulation}
              </div>
            </div>
            
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/30 border border-slate-100 dark:border-[#38383A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Forecast Risk</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-500">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                {incident.details.forecastRisk}
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/30 border border-slate-100 dark:border-[#38383A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Wind</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Wind className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{incident.details.weather.wind}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/30 border border-slate-100 dark:border-[#38383A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weather</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Cloud className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{incident.details.weather.weather}</span>
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#2C2E33]/30 border border-slate-100 dark:border-[#38383A]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sensitive Areas</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Building className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{incident.details.sensitiveAreas.length > 0 ? incident.details.sensitiveAreas.join(', ') : 'None identified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Root Cause (Evidence -> Conclusion) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Investigation</h3>
          <div className="flex flex-col gap-4 p-4 rounded-xl border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Observed Evidence</span>
              <ul className="space-y-1">
                {incident.rootCause.evidence.map((ev, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <FileSearch className="w-3.5 h-3.5 text-slate-400" />
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-center my-1 text-slate-300 dark:text-[#38383A]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2C2E33]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[var(--color-ops-brand)] uppercase">Likely Source</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{incident.rootCause.likelyCause}</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{incident.rootCause.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

          {/* Evidence Assets */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Evidence Assets</h3>
            <div className="grid grid-cols-5 gap-3">
              {/* Mocked clickable evidence blocks */}
              <div className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 group ${incident.evidence.sensorReadings ? 'border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#2C2E33]/30 text-slate-900 dark:text-white shadow-sm' : 'border-dashed border-slate-200 dark:border-[#38383A] bg-transparent text-slate-400 opacity-50'}`}>
                <Radio className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase text-center">Sensors</span>
              </div>
              
              <div className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 group relative ${incident.evidence.photos > 0 ? 'border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#2C2E33]/30 text-slate-900 dark:text-white shadow-sm' : 'border-dashed border-slate-200 dark:border-[#38383A] bg-transparent text-slate-400 opacity-50'}`}>
                <Camera className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase text-center">Photos</span>
                {incident.evidence.photos > 0 && <span className="absolute -top-1 -right-1 text-[9px] bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">{incident.evidence.photos}</span>}
              </div>

              <div className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 group ${incident.evidence.droneImages ? 'border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#2C2E33]/30 text-slate-900 dark:text-white shadow-sm' : 'border-dashed border-slate-200 dark:border-[#38383A] bg-transparent text-slate-400 opacity-50'}`}>
                <Plane className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase text-center">Drone</span>
              </div>

              <div className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors cursor-pointer hover:border-[var(--color-ops-brand)] group relative ${incident.evidence.cameraFeed ? 'border-[var(--color-ops-brand)] bg-[var(--color-ops-brand)]/5 text-[var(--color-ops-brand)] shadow-sm' : 'border-dashed border-slate-200 dark:border-[#38383A] bg-transparent text-slate-400 opacity-50'}`}>
                <Camera className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase text-center">Live Feed</span>
                {incident.evidence.cameraFeed && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>}
              </div>

              <div className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 group ${incident.evidence.historicalReadings ? 'border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#2C2E33]/30 text-slate-900 dark:text-white shadow-sm' : 'border-dashed border-slate-200 dark:border-[#38383A] bg-transparent text-slate-400 opacity-50'}`}>
                <FileText className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase text-center">Logs</span>
              </div>
            </div>
          </div>

          {/* Related Incidents Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Related Incidents</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] hover:border-slate-300 dark:hover:border-[#505055] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-500">OPS-4812</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Traffic Emission</span>
                  <span className="text-xs text-slate-500">2 km away</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-orange-500/10 text-orange-500">Open</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] hover:border-slate-300 dark:hover:border-[#505055] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-500">OPS-4798</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dust Cloud</span>
                  <span className="text-xs text-slate-500">Yesterday</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-slate-500/10 text-slate-500">Resolved</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
