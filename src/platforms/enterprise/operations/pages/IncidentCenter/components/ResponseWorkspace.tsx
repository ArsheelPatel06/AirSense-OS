import React from 'react';
import type { Incident } from '../mockData';
import { Users, Truck, Navigation, CheckCircle, Map, Radio, ShieldCheck, UserPlus, Send, Zap, ChevronRight, Hash, Clock, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOpsStore } from '../../../context/OpsContext';

export function ResponseWorkspace({ incident }: { incident: Incident }) {
  const navigate = useNavigate();
  const { resolveIncident, assignTeamToIncident, showToast } = useOpsStore();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C1C1E]">
      {/* Action Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex flex-wrap gap-2 items-center justify-end shrink-0">
        <button onClick={() => showToast('Team assignment modal opened')} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#38383A] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2C2E33] transition-colors flex items-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5" /> Assign
        </button>
        <button onClick={() => showToast('Broadcast modal opened')} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#38383A] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2C2E33] transition-colors flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" /> Broadcast
        </button>
        <button 
          onClick={() => navigate(`/operations/map?incident=${incident.id}`)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#38383A] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2C2E33] transition-colors flex items-center gap-1.5"
        >
          <Map className="w-3.5 h-3.5" /> Open Map
        </button>
        <button onClick={() => showToast('Escalated to external agencies', 'warning')} className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-1.5 ml-auto">
          <AlertOctagon className="w-4 h-4" /> Escalate
        </button>
        <button onClick={() => resolveIncident(incident.id)} className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Resolve
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin flex flex-col gap-8">
        
        {/* Operational Recommendation */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-ops-brand)]" />
            Operational Recommendation
          </h3>
          <div className="p-4 rounded-xl border border-[var(--color-ops-brand)]/30 bg-[var(--color-ops-brand)]/5 flex flex-col gap-4">
            <ul className="space-y-2">
              {incident.opRecommendation.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ops-brand)] mt-1.5 shrink-0"></div>
                  {pt}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-ops-brand)]/20">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[var(--color-ops-brand)]">Expected Outcome</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{incident.opRecommendation.expectedImprovement}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-[var(--color-ops-brand)]">Confidence</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{incident.opRecommendation.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Team */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Assigned Team</h3>
          {incident.assignedTeam ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-[#2C2E33] pb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-base font-bold text-slate-900 dark:text-white leading-none mb-1">{incident.assignedTeam.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ops-brand)] bg-[var(--color-ops-brand)]/10 px-1.5 py-0.5 rounded">{incident.assignedTeam.status}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Members</span>
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                    <Users className="w-4 h-4 text-slate-400" />
                    {incident.assignedTeam.members}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Vehicle</span>
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                    <Truck className="w-4 h-4 text-slate-400" />
                    {incident.assignedTeam.vehicle}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">ETA</span>
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {incident.assignedTeam.eta}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Radio</span>
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                    <Radio className={`w-4 h-4 ${incident.assignedTeam.radio === 'Connected' ? 'text-green-500' : 'text-slate-400'}`} />
                    {incident.assignedTeam.radio}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-[#38383A] bg-transparent flex flex-col items-center justify-center text-center">
              <Users className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">No team currently assigned</span>
              <button onClick={() => assignTeamToIncident(incident.id, 'TM-01')} className="px-4 py-2 rounded-lg bg-[var(--color-ops-brand)] text-white text-xs font-bold hover:bg-[var(--color-ops-brand-hover)] transition-colors">
                Assign Responder Team
              </button>
            </div>
          )}
        </div>

        {/* Recommended Actions */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Response Actions</h3>
          <div className="space-y-2">
            {incident.recommendedActions.map((action, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] hover:border-slate-300 dark:hover:border-[#505055] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded ${
                    action.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                    action.priority === 'medium' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-slate-500/10 text-slate-500 dark:text-slate-400'
                  }`}>
                    {action.priority}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{action.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Communication & Resources (2 cols) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> Comms Status
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Public Advisory</span>
                <span className="text-[10px] font-bold uppercase text-slate-500">Sent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Municipality</span>
                <span className="text-[10px] font-bold uppercase text-green-500">Ack</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Health Dept</span>
                <span className="text-[10px] font-bold uppercase text-orange-500">Pending</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Resources
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">Staff</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{incident.resources.staff}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">Vehicles</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{incident.resources.vehicle}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">Sensors</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{incident.resources.portableSensors}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">Drones</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{incident.resources.drone}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
