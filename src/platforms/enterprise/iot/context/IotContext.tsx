import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface IotIncident {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  device: string;
  issueType: string;
  duration: string;
}

export interface IotDevice {
  id: string;
  name: string;
  fleet: string;
  status: string;
  firmware: string;
  battery: number;
  signal: number;
  aqi: string | number;
  pm25: string | number;
  temp: string | number;
  humidity: string | number;
  lastSeen: string;
}

export interface IotState {
  activeIncidents: IotIncident[];
  devices: IotDevice[];
}

interface IotContextType {
  state: IotState;
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  resolveIncident: (id: string) => void;
  updateDeviceFirmware: (id: string) => void;
  restartDevice: (id: string) => void;
  deleteDevice: (id: string) => void;
}

const IotContext = createContext<IotContextType | undefined>(undefined);

const initialIncidents: IotIncident[] = [
  { id: 'INC-9821', severity: 'Critical', device: 'SA-East-Gateway-04', issueType: 'Connection Timeout', duration: '45m 12s' },
  { id: 'INC-9820', severity: 'Warning', device: 'EU-Central-SensorNode', issueType: 'Battery Level < 5%', duration: '2h 15m' },
  { id: 'INC-9815', severity: 'Warning', device: 'NA-East-Cluster (32 devs)', issueType: 'High Latency', duration: '4h 30m' },
];

const initialDevices: IotDevice[] = Array.from({ length: 15 }).map((_, i) => {
  const isCritical = i === 2 || i === 7;
  const isWarning = i === 5 || i === 12;
  const status = isCritical ? 'offline' : isWarning ? 'warning' : 'online';
  
  return {
    id: `AN-${1000 + i}`,
    name: `AirNode-${1000 + i}`,
    fleet: i < 5 ? 'North Campus' : i < 10 ? 'Downtown Hub' : 'Industrial Park',
    status,
    firmware: i % 4 === 0 ? 'v2.3.9' : 'v2.4.1',
    battery: isCritical ? 0 : isWarning ? 15 + (i * 2) : 80 + (i % 20),
    signal: isCritical ? 0 : -50 - (i % 30),
    aqi: isCritical ? '-' : 42 + (i % 20),
    pm25: isCritical ? '-' : 12 + (i % 10),
    temp: isCritical ? '-' : 22 + (i % 5),
    humidity: isCritical ? '-' : 45 + (i % 15),
    lastSeen: isCritical ? '2 hours ago' : '12 sec ago'
  };
});

export function IotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IotState>({
    activeIncidents: initialIncidents,
    devices: initialDevices,
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

  const resolveIncident = (id: string) => {
    setState(s => ({
      ...s,
      activeIncidents: s.activeIncidents.filter(inc => inc.id !== id)
    }));
    showToast('Incident Resolved', 'success');
  };

  const updateDeviceFirmware = (id: string) => {
    setState(s => ({
      ...s,
      devices: s.devices.map(d => d.id === id ? { ...d, firmware: 'v2.4.1 (Updating...)' } : d)
    }));
    showToast(`Firmware update started for ${id}`, 'info');
  };

  const restartDevice = (id: string) => {
    setState(s => ({
      ...s,
      devices: s.devices.map(d => d.id === id ? { ...d, status: 'offline', lastSeen: 'Restarting...' } : d)
    }));
    showToast(`Device ${id} is restarting...`, 'info');
    
    // Simulate coming back online
    setTimeout(() => {
      setState(s => ({
        ...s,
        devices: s.devices.map(d => d.id === id ? { ...d, status: 'online', lastSeen: 'Just now' } : d)
      }));
      showToast(`Device ${id} is back online`, 'success');
    }, 3000);
  };

  const deleteDevice = (id: string) => {
    setState(s => ({
      ...s,
      devices: s.devices.filter(d => d.id !== id)
    }));
    showToast(`Device ${id} deleted`, 'success');
  };

  return (
    <IotContext.Provider value={{ state, showToast, removeToast, resolveIncident, updateDeviceFirmware, restartDevice, deleteDevice }}>
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
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
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
    </IotContext.Provider>
  );
}

export const useIotStore = () => {
  const ctx = useContext(IotContext);
  if (!ctx) throw new Error('useIotStore must be used within IotProvider');
  return ctx;
};
