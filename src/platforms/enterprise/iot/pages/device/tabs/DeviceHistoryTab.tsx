import { Clock, ShieldCheck, AlertTriangle, Settings, User } from 'lucide-react';

export function DeviceHistoryTab() {
  const events = [
    {
      id: 1,
      type: 'warning',
      title: 'Humidity Threshold Exceeded',
      description: 'Humidity recorded at 68%, exceeding the recommended max threshold of 60%.',
      timestamp: 'Today, 14:35 PM',
      icon: AlertTriangle,
      user: 'System'
    },
    {
      id: 2,
      type: 'config',
      title: 'Telemetry Interval Updated',
      description: 'Reporting interval changed from 60s to 30s.',
      timestamp: 'Yesterday, 09:12 AM',
      icon: Settings,
      user: 'Admin User'
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Firmware Update',
      description: 'System updated from v2.3.8 to v2.3.9.',
      timestamp: 'May 12, 2026, 02:00 AM',
      icon: ShieldCheck,
      user: 'Automated Policy'
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)] flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-iot-text-secondary)]" /> Event Log
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm">
              Filter Events
            </button>
            <button className="px-3 py-1.5 bg-white border border-[var(--color-iot-border)] text-[var(--color-iot-text-primary)] text-[12px] font-medium rounded hover:bg-[#F1F5F9] transition-colors shadow-sm">
              Export Logs
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-[var(--color-iot-border)]">
          {events.map((event) => (
            <div key={event.id} className="p-5 hover:bg-[#F1F5F9] transition-colors flex gap-4">
              <div className={`
                p-2 rounded mt-0.5
                ${event.type === 'warning' ? 'bg-[var(--color-iot-warning)]/10 text-[var(--color-iot-warning)]' : ''}
                ${event.type === 'config' ? 'bg-[var(--color-iot-blue)]/10 text-[var(--color-iot-blue)]' : ''}
                ${event.type === 'maintenance' ? 'bg-[var(--color-iot-brand)]/10 text-[var(--color-iot-brand)]' : ''}
              `}>
                <event.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[14px] font-bold text-[var(--color-iot-text-primary)] leading-tight">{event.title}</p>
                  <span className="text-[12px] text-[var(--color-iot-text-muted)] font-mono whitespace-nowrap ml-4">{event.timestamp}</span>
                </div>
                <p className="text-[13px] text-[var(--color-iot-text-secondary)] mb-2">{event.description}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-iot-text-muted)] font-medium">
                  <User className="w-3.5 h-3.5" /> Triggered by: {event.user}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
