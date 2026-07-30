import { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, HardDrive, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Battery Critical',
      device: 'AN-1004',
      time: '12 min ago',
      icon: AlertCircle,
      color: 'var(--color-ops-critical)',
      bg: 'var(--color-ops-critical)',
      path: '/iot/devices/AN-1004/diagnostics',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Humidity Detected',
      device: 'AN-2045',
      time: '1 hour ago',
      icon: AlertCircle,
      color: 'var(--color-ops-warning)',
      bg: 'var(--color-ops-warning)',
      path: '/iot/devices/AN-2045/telemetry',
      read: false
    },
    {
      id: 3,
      type: 'firmware',
      title: 'Firmware Update Complete',
      device: 'Fleet: North Campus',
      time: '3 hours ago',
      icon: HardDrive,
      color: 'var(--color-ops-brand)',
      bg: 'var(--color-ops-brand)',
      path: '/iot/fleets/FLT-NC-9021',
      read: false
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Scheduled Maintenance Pending',
      device: 'Gateway-DT-01',
      time: '1 day ago',
      icon: Wrench,
      color: 'var(--color-ops-info)',
      bg: 'var(--color-ops-info)',
      path: '/iot/devices/Gateway-DT-01/history',
      read: true
    }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)] rounded-full transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--color-ops-critical)] border-2 border-[var(--color-ops-header)] rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--color-ops-card)] rounded-xl shadow-xl border border-[var(--color-ops-border)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[var(--color-ops-border)] bg-[var(--color-ops-surface)] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[var(--color-ops-text-primary)]">Notifications</h3>
            <button 
              className="text-[11px] font-medium text-[var(--color-ops-brand)] hover:underline"
              onClick={() => setUnreadCount(0)}
            >
              Mark all as read
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin divide-y divide-[var(--color-ops-border)]">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-4 hover:bg-[var(--color-ops-surface)] transition-colors cursor-pointer flex gap-3 ${!notif.read && unreadCount > 0 ? 'bg-[var(--color-ops-surface)]' : 'bg-[var(--color-ops-card)]'}`}
                onClick={() => handleNavigate(notif.path)}
              >
                <div className="mt-0.5 p-1.5 rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${notif.bg} 15%, transparent)`, color: notif.color }}>
                  <notif.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className={`text-[13px] leading-tight ${!notif.read && unreadCount > 0 ? 'font-bold text-[var(--color-ops-text-primary)]' : 'font-medium text-[var(--color-ops-text-secondary)]'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[11px] text-[var(--color-ops-text-muted)] whitespace-nowrap ml-2 font-mono">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--color-ops-text-secondary)] mb-2 font-mono">{notif.device}</p>
                  <button className="text-[11px] font-medium bg-[var(--color-ops-surface)] border border-[var(--color-ops-border)] text-[var(--color-ops-text-secondary)] px-2 py-1 rounded shadow-sm hover:border-[var(--color-ops-brand)] hover:text-[var(--color-ops-brand)] transition-colors">
                    View Details
                  </button>
                </div>
                {!notif.read && unreadCount > 0 && (
                  <div className="w-2 h-2 rounded-full bg-[var(--color-ops-brand)] mt-2"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-[var(--color-ops-border)] bg-[var(--color-ops-surface)] text-center">
            <button className="text-[12px] font-medium text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
