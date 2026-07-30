import { ShieldCheck, Share, BellOff, XCircle, MapPin, Clock, Activity, Cloud, Wind, Zap, Truck, Factory, AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import type { SystemAlert, AlertPriority, AlertSource } from '../mockData';
import { useOpsStore } from '../../../context/OpsContext';

interface AlertDetailProps {
  alert: SystemAlert | null;
}

export function AlertDetail({ alert }: AlertDetailProps) {
  const { acknowledgeAlert, snoozeAlert, closeAlert, escalateToIncident } = useOpsStore();

  if (!alert) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121214] text-slate-500">
        <BellOff className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-semibold">Select an alert to view details</p>
      </div>
    );
  }

  const getPriorityColor = (priority: AlertPriority) => {
    switch(priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityIcon = (priority: AlertPriority) => {
    switch(priority) {
      case 'Critical': return <AlertTriangle className="w-4 h-4" />;
      case 'High': return <AlertCircle className="w-4 h-4" />;
      case 'Medium': return <Info className="w-4 h-4" />;
      case 'Low': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSourceIcon = (source: AlertSource) => {
    switch(source) {
      case 'AQI': return <Cloud className="w-5 h-5" />;
      case 'Weather': return <Wind className="w-5 h-5" />;
      case 'Sensors': return <Zap className="w-5 h-5" />;
      case 'Traffic': return <Truck className="w-5 h-5" />;
      case 'Industrial': return <Factory className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1C1C1E] overflow-hidden">
      
      {/* Action Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#38383A] shrink-0 bg-slate-50 dark:bg-[#121214] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white dark:bg-[#1C1C1E] px-2 py-1 rounded border border-slate-200 dark:border-[#38383A]">
            {alert.id}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {alert.timestamp}
          </span>
        </div>
        
        {/* Triage Actions */}
        <div className="flex items-center gap-2">
          {alert.category === 'Active' && (
            <>
              <button 
                onClick={() => snoozeAlert(alert.id)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#2C2E33] transition-colors flex items-center gap-1.5">
                <BellOff className="w-3.5 h-3.5 text-slate-400" />
                Snooze
              </button>
              <button 
                onClick={() => acknowledgeAlert(alert.id)}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-ops-brand)] text-white text-xs font-bold hover:bg-[var(--color-ops-brand-hover)] transition-colors flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Acknowledge
              </button>
            </>
          )}
          {(alert.category === 'Active' || alert.category === 'Acknowledged') && (
            <button 
              onClick={() => escalateToIncident(alert.id)}
              className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
              <Share className="w-3.5 h-3.5" />
              Escalate to Incident
            </button>
          )}
          {alert.category !== 'Closed' && (
            <button 
              onClick={() => closeAlert(alert.id)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#2C2E33] transition-colors flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Close
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Main Title & Context */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 rounded flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider border ${getPriorityColor(alert.priority)}`}>
                {getPriorityIcon(alert.priority)} {alert.priority}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#2C2E33] text-slate-600 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                {getSourceIcon(alert.source)} {alert.source}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#2C2E33] text-slate-600 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {alert.location}
              </span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              {alert.title}
            </h1>
            
            <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
              {alert.description}
            </p>
          </div>

          {/* Metric Telemetry if available */}
          {alert.metric && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Trigger Metric
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metric</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{alert.metric.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Value</span>
                  <span className="text-lg font-bold text-red-500">{alert.metric.value}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Threshold</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{alert.metric.threshold}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions Log */}
          {alert.actionsTaken && alert.actionsTaken.length > 0 && (
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Action Log
              </h3>
              <div className="space-y-3">
                {alert.actionsTaken.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <ChevronRight className="w-4 h-4 text-[var(--color-ops-brand)]" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
