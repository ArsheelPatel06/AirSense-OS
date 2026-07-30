import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

import { MOCK_ALERTS, type SystemAlert } from '../pages/AlertsCenter/mockData';
import { mockIncidents, type Incident } from '../pages/IncidentCenter/mockData';
import { MOCK_RESOURCES, type OperationsResource } from '../pages/ResponseResources/mockData';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface OpsState {
  currentAQI: number;
  alerts: SystemAlert[];
  incidents: Incident[];
  teams: OperationsResource[];
  trendData: { time: string, aqi: number }[];
}

interface OpsContextType {
  state: OpsState;
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  // Alert Actions
  acknowledgeAlert: (id: string) => void;
  snoozeAlert: (id: string) => void;
  closeAlert: (id: string) => void;
  escalateToIncident: (alertId: string) => void;
  // Incident Actions
  resolveIncident: (id: string) => void;
  assignTeamToIncident: (incidentId: string, teamId: string) => void;
  // Team Actions
  recallTeam: (teamId: string) => void;
}

const OpsContext = createContext<OpsContextType | undefined>(undefined);

const initialTrendData = [
  { time: '16:00', aqi: 59 }, { time: '17:00', aqi: 46 }, { time: '18:00', aqi: 42 }, { time: '19:00', aqi: 50 },
  { time: '20:00', aqi: 41 }, { time: '21:00', aqi: 52 }, { time: '22:00', aqi: 47 }, { time: '23:00', aqi: 53 },
  { time: '00:00', aqi: 56 }, { time: '01:00', aqi: 56 }, { time: '02:00', aqi: 50 }, { time: '03:00', aqi: 40 },
  { time: '04:00', aqi: 50 }, { time: '05:00', aqi: 41 }, { time: '06:00', aqi: 46 }, { time: '07:00', aqi: 41 },
  { time: '08:00', aqi: 53 }, { time: '09:00', aqi: 46 }, { time: '10:00', aqi: 56 }, { time: '11:00', aqi: 51 },
  { time: '12:00', aqi: 57 }, { time: '13:00', aqi: 47 }, { time: '14:00', aqi: 41 }, { time: '15:00', aqi: 54 },
];

export function OpsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpsState>({
    currentAQI: 55,
    alerts: [...MOCK_ALERTS],
    incidents: [...mockIncidents],
    teams: [...MOCK_RESOURCES],
    trendData: initialTrendData,
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, type === 'success' ? 2500 : 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const acknowledgeAlert = (id: string) => {
    setState(s => ({
      ...s,
      alerts: s.alerts.map(a => a.id === id ? { ...a, category: 'Acknowledged' } : a)
    }));
    showToast('Alert Acknowledged', 'success');
  };

  const snoozeAlert = (id: string) => {
    showToast('Alert Snoozed for 1 hour', 'info');
  };

  const closeAlert = (id: string) => {
    setState(s => ({
      ...s,
      alerts: s.alerts.map(a => a.id === id ? { ...a, category: 'Closed' } : a)
    }));
    showToast('Alert Closed', 'success');
  };

  const escalateToIncident = (alertId: string) => {
    setState(s => ({
      ...s,
      alerts: s.alerts.map(a => a.id === alertId ? { ...a, category: 'Escalated' } : a)
    }));
    showToast('Alert Escalated to Incident', 'warning');
  };

  const resolveIncident = (id: string) => {
    setState(s => ({
      ...s,
      incidents: s.incidents.map(inc => inc.id === id ? { ...inc, status: 'Resolved' } : inc)
    }));
    showToast('Incident Resolved', 'success');
  };

  const assignTeamToIncident = (incidentId: string, teamId: string) => {
    setState(s => {
      const team = s.teams.find(t => t.id === teamId);
      if (!team) return s;
      
      const newIncidents = s.incidents.map(inc => {
        if (inc.id === incidentId) {
          // Add a mock team object that fits the incident assignedTeam interface
          return {
            ...inc,
            assignedTeam: {
              name: team.name,
              members: team.members || 4,
              vehicle: team.vehicleAssigned || 'Van-01',
              eta: team.eta || '15 mins',
              currentPosition: team.locationDesc,
              status: 'En Route',
              radio: team.radioStatus || 'Connected'
            }
          };
        }
        return inc;
      });

      const newTeams = s.teams.map(t => t.id === teamId ? { ...t, status: 'En Route' as const, currentAssignment: incidentId } : t);

      return {
        ...s,
        incidents: newIncidents,
        teams: newTeams
      };
    });
    showToast('Team Dispatched', 'success');
  };

  const recallTeam = (teamId: string) => {
    setState(s => ({
      ...s,
      teams: s.teams.map(t => t.id === teamId ? { ...t, status: 'Returning' as const } : t)
    }));
    showToast('Team Recalled', 'info');
  };

  return (
    <OpsContext.Provider value={{ 
      state, showToast, removeToast, 
      acknowledgeAlert, snoozeAlert, closeAlert, escalateToIncident,
      resolveIncident, assignTeamToIncident, recallTeam
    }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border animate-in slide-in-from-right-8 fade-in duration-300 ${
              toast.type === 'success' ? 'bg-[#F0FDF4] border-[#BBF7D0]' :
              toast.type === 'warning' ? 'bg-[#FFFBEB] border-[#FEF3C7]' :
              toast.type === 'error' ? 'bg-[#FEF2F2] border-[#FECACA]' :
              'bg-[#EFF6FF] border-[#BFDBFE]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
            
            <span className={`text-[13px] font-bold ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'warning' ? 'text-amber-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {toast.message}
            </span>
            
            <button onClick={() => removeToast(toast.id)} className="ml-2 p-1 opacity-50 hover:opacity-100 transition-opacity">
              <X className={`w-3.5 h-3.5 ${toast.type === 'success' ? 'text-green-800' : toast.type === 'warning' ? 'text-amber-800' : toast.type === 'error' ? 'text-red-800' : 'text-blue-800'}`} />
            </button>
          </div>
        ))}
      </div>
    </OpsContext.Provider>
  );
}

export const useOpsStore = () => {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error('useOpsStore must be used within OpsProvider');
  return ctx;
};
