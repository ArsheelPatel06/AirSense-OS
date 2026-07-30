import { Link, useLocation } from 'react-router-dom';
import {
  // IoT icons
  LayoutDashboard, Layers, Cpu, Activity, AlertCircle, Settings,
  // Operations icons
  Map, ShieldAlert, Wind, BarChart3, Truck, FileText,
  // Shared
  ChevronRight, Sun, Moon,
  MessageSquare, ShieldCheck
} from 'lucide-react';
import { PlatformSwitcher } from '../../features/navigation/PlatformSwitcher';
import { useOpsTheme } from '../../app/layouts/AppShell/AppShell';

interface AppSidebarProps {
  isOpen: boolean;
  isOps?: boolean;
  isGov?: boolean;
}

// ─── Nav Configs ─────────────────────────────────────────────────────────────

const IOT_NAV = [
  {
    section: 'Fleet',
    items: [
      { name: 'Fleet Overview', icon: LayoutDashboard, path: '/iot/fleets', exact: true },
      { name: 'Fleet Comparison', icon: Layers, path: '/iot/fleets/compare' },
    ],
  },
  {
    section: 'Devices',
    items: [
      { name: 'Device List', icon: Cpu, path: '/iot/devices' },
    ],
  },
  {
    section: 'System',
    items: [
      { name: 'Alerts & Incidents', icon: AlertCircle, path: '/iot/alerts', badge: '3' },
      { name: 'Analytics', icon: Activity, path: '/iot/analytics' },
      { name: 'Settings', icon: Settings, path: '/iot/settings' },
    ],
  },
];

const OPS_NAV = [
  {
    section: 'Mission Control',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/operations', exact: true },
      { name: 'Live Map', icon: Map, path: '/operations/map' },
      { name: 'Alerts', icon: AlertCircle, path: '/operations/alerts', badge: '12' },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { name: 'Environmental', icon: Wind, path: '/operations/environmental' },
      { name: 'Forecast', icon: BarChart3, path: '/operations/forecast' },
    ],
  },
  {
    section: 'Response',
    items: [
      { name: 'Incident Center', icon: ShieldAlert, path: '/operations/incidents', badge: '4' },
      { name: 'Response Resources', icon: Truck, path: '/operations/resources' },
    ],
  },
  {
    section: 'Compliance',
    items: [
      { name: 'Gov & Compliance', icon: FileText, path: '/operations/compliance' },
      { name: 'Settings', icon: Settings, path: '/operations/settings' },
    ],
  }
];

const GOV_NAV = [
  {
    section: 'City Management',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/government', exact: true },
      { name: 'Citizen Communication', icon: MessageSquare, path: '/government/communication' },
      { name: 'Reports', icon: FileText, path: '/government/reports' },
      { name: 'Compliance', icon: ShieldCheck, path: '/government/compliance' },
      { name: 'Projects & Planning', icon: Map, path: '/government/projects' },
      { name: 'Settings', icon: Settings, path: '/government/settings' },
    ],
  }
];

// ─── NavItem ─────────────────────────────────────────────────────────────────

function NavItem({ name, icon: Icon, path, badge, exact = false, isOps, isGov }: {
  name: string; icon: any; path: string; badge?: string; exact?: boolean; isOps: boolean; isGov: boolean;
}) {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === path
    : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const activeText = isGov ? 'text-[var(--color-gov-brand)]' : isOps ? 'text-[var(--color-ops-brand)]' : 'text-[var(--color-iot-brand)]';
  const activeBg = isGov ? 'bg-[var(--color-gov-brand-surface)]' : isOps ? 'bg-[var(--color-ops-brand-surface)]' : 'bg-[var(--color-iot-brand-surface)]';
  const inactiveText = isGov ? 'text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)] hover:bg-[var(--color-gov-surface)]' : isOps ? 'text-[var(--color-ops-text-secondary)] hover:text-[var(--color-ops-text-primary)] hover:bg-[var(--color-ops-surface)]' : 'text-[var(--color-iot-text-secondary)] hover:text-[var(--color-iot-text-primary)] hover:bg-[#F1F5F9]';
  const iconActive = isGov ? 'text-[var(--color-gov-brand)]' : isOps ? 'text-[var(--color-ops-brand)]' : 'text-[var(--color-iot-brand)]';
  const iconInactive = isGov ? 'text-[var(--color-gov-text-muted)]' : isOps ? 'text-[var(--color-ops-text-muted)]' : 'text-[var(--color-iot-text-muted)]';
  const borderColor = isGov ? 'bg-[var(--color-gov-border)]' : isOps ? 'bg-[var(--color-ops-border)]' : 'bg-[var(--color-iot-border)]';
  const badgeActive = isGov ? 'bg-[var(--color-gov-brand)]/10 text-[var(--color-gov-brand)]' : isOps ? 'bg-[var(--color-ops-brand)]/10 text-[var(--color-ops-brand)]' : 'bg-[var(--color-iot-brand)]/10 text-[var(--color-iot-brand)]';
  const badgeInactive = isGov ? 'bg-[var(--color-gov-critical)]/10 text-[var(--color-gov-critical)]' : isOps ? 'bg-[var(--color-ops-critical)]/10 text-[var(--color-ops-critical)]' : 'bg-[var(--color-iot-critical)]/10 text-[var(--color-iot-critical)]';

  return (
    <Link
      to={path}
      className={`group flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors relative ${isActive ? `${activeText} ${activeBg}` : inactiveText}`}
    >
      <div className={`absolute left-[-12px] top-[15px] w-[12px] h-px ${borderColor} group-hover:opacity-60 transition-opacity`}></div>
      <div className="flex items-center gap-3 w-full relative z-10">
        <Icon className={`w-4 h-4 transition-colors ${isActive ? iconActive : `${iconInactive} group-hover:opacity-80`}`} />
        <span>{name}</span>
        {badge && (
          <span className={`ml-auto px-1.5 py-0.5 text-[10px] rounded-full font-medium ${isActive ? badgeActive : badgeInactive}`}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function AppSidebar({ isOpen, isOps = false, isGov = false }: AppSidebarProps) {
  const { theme, toggle } = useOpsTheme();
  const nav = isGov ? GOV_NAV : isOps ? OPS_NAV : IOT_NAV;

  const sidebarBg = isGov ? 'bg-[var(--color-gov-sidebar)]' : isOps ? 'bg-[var(--color-ops-sidebar)]' : 'bg-[var(--color-iot-sidebar)]';
  const borderColor = isGov ? 'border-[var(--color-gov-border)]' : isOps ? 'border-[var(--color-ops-border)]' : 'border-[var(--color-iot-border)]';
  const brandColor = isGov ? 'bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)]' : isOps ? 'bg-[var(--color-ops-brand)] hover:bg-[var(--color-ops-brand-hover)]' : 'bg-[var(--color-iot-brand)] hover:bg-[var(--color-iot-brand-hover)]';
  const textPrimary = isGov ? 'text-[var(--color-gov-text-primary)] hover:text-[var(--color-gov-brand)]' : isOps ? 'text-[var(--color-ops-text-primary)] hover:text-[var(--color-ops-brand)]' : 'text-[var(--color-iot-text-primary)] hover:text-[var(--color-iot-brand)]';
  const sectionLabel = isGov ? 'text-[var(--color-gov-text-disabled)]' : isOps ? 'text-[var(--color-ops-text-disabled)]' : 'text-[var(--color-iot-text-disabled)]';
  const sectionDot = isGov ? 'bg-[var(--color-gov-border)]' : isOps ? 'bg-[var(--color-ops-border)]' : 'bg-[var(--color-iot-border)]';
  const treeLine = isGov ? 'from-[var(--color-gov-border)]' : isOps ? 'from-[var(--color-ops-border)]' : 'from-[var(--color-iot-border)]';
  const successColor = isGov ? 'bg-[var(--color-gov-success)]' : isOps ? 'bg-[var(--color-ops-success)]' : 'bg-[var(--color-iot-success)]';
  const textSecondary = isGov ? 'text-[var(--color-gov-text-secondary)]' : isOps ? 'text-[var(--color-ops-text-secondary)]' : 'text-[var(--color-iot-text-secondary)]';
  const textMuted = isGov ? 'text-[var(--color-gov-text-muted)]' : isOps ? 'text-[var(--color-ops-text-muted)]' : 'text-[var(--color-iot-text-muted)]';

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-[228px] ${sidebarBg} border-r ${borderColor} flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

      {/* Brand Header */}
      <div className={`flex flex-col gap-3 px-4 pt-5 pb-4 border-b ${borderColor} ${sidebarBg} relative z-10`}>
        <Link to={isGov ? '/government' : isOps ? '/operations' : '/iot/fleets'} className="flex items-center gap-2.5 group">
          <div className={`w-8 h-8 ${brandColor} rounded-lg flex items-center justify-center shadow-sm transition-colors shrink-0`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span className={`text-[17px] font-bold tracking-tight transition-colors ${textPrimary}`}>AirSense</span>
        </Link>
        <PlatformSwitcher isOps={isOps} isGov={isGov} />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-6 pb-12 px-4 scrollbar-thin">
        {nav.map((group, gi) => (
          <div key={group.section} className={`${gi < nav.length - 1 ? 'mb-8' : ''} relative`}>
            <div className={`absolute left-[11px] top-7 bottom-2 w-px bg-gradient-to-b ${treeLine} to-transparent`}></div>
            <div className={`px-2 mb-3 text-[11px] font-bold ${sectionLabel} uppercase tracking-widest flex items-center gap-2`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sectionDot}`}></span>
              {group.section}
            </div>
            <div className="space-y-1 relative pl-3">
              {group.items.map(item => (
                <NavItem key={item.path} {...item} isOps={isOps} isGov={isGov} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${borderColor} ${sidebarBg}`}>
        {isGov ? (
          <div className="flex flex-col mb-4">
            <span className={`text-[10px] font-bold ${textSecondary} uppercase tracking-wider mb-3`}>City Management</span>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${successColor} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${successColor}`}></span>
              </span>
              <span className={`text-[12px] font-bold ${textPrimary}`}>System Online</span>
            </div>
            
            <div className={`flex flex-col gap-1.5 text-[11px] ${textMuted}`}>
              <div className="flex justify-between">
                <span>Active Advisories</span>
                <span className={`font-semibold ${textSecondary}`}>2</span>
              </div>
              <div className="flex justify-between">
                <span>AQI Status</span>
                <span className={`font-semibold text-[var(--color-gov-warning)]`}>Moderate</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className={`font-semibold ${textSecondary}`}>Just now</span>
              </div>
            </div>
          </div>
        ) : isOps ? (
          <div className="flex flex-col mb-4">
            <span className={`text-[10px] font-bold ${textSecondary} uppercase tracking-wider mb-3`}>Operations Status</span>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${successColor} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${successColor}`}></span>
              </span>
              <span className={`text-[12px] font-bold ${textPrimary}`}>Live Feed Connected</span>
            </div>
            
            <div className={`flex flex-col gap-1.5 text-[11px] ${textMuted}`}>
              <div className="flex justify-between">
                <span>Sensors Reporting</span>
                <span className={`font-semibold ${textSecondary}`}>1,248</span>
              </div>
              <div className="flex justify-between">
                <span>City Coverage</span>
                <span className={`font-semibold ${textSecondary}`}>98%</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync</span>
                <span className={`font-semibold ${textSecondary}`}>15 sec ago</span>
              </div>
            </div>
            
            <div className={`mt-3 pt-3 border-t ${borderColor} flex flex-col gap-1 text-[10px] ${textMuted}`}>
              <span className={`font-bold ${textSecondary}`}>Morning Shift</span>
              <span>Ahmedabad Operations Center</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${successColor} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${successColor}`}></span>
              </span>
              <span className={`text-xs font-medium ${textSecondary}`}>Connected</span>
            </div>
            <div className={`flex flex-col gap-1 text-[10px] ${textMuted} font-mono mb-3`}>
              <span>Version 2.4.1</span>
              <span>Region: US-East (Ohio)</span>
            </div>
          </>
        )}

        {/* Cross-platform switcher — always visible */}
        <div className="space-y-1.5">
          <p className={`text-[9px] font-semibold uppercase tracking-widest mb-1 ${textMuted} opacity-60`}>Switch Platform</p>
          <Link
            to="/iot/fleets"
            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-md border text-[11px] font-semibold transition-all group
              ${isGov || isOps
                ? `${sidebarBg} border-${borderColor} ${textMuted} hover:${textSecondary}`
                : `bg-[var(--color-iot-brand)]/10 border-[var(--color-iot-brand)]/30 text-[var(--color-iot-brand)]`
              }`}
          >
            <Cpu className="w-3 h-3 flex-shrink-0" />
            IoT Platform
            <ChevronRight className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-70" />
          </Link>
          <Link
            to="/operations"
            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-md border text-[11px] font-semibold transition-all group
              ${isOps
                ? `bg-[var(--color-ops-brand)]/10 border-[var(--color-ops-brand)]/30 text-[var(--color-ops-brand)]`
                : `${sidebarBg} border-${borderColor} ${textMuted} hover:${textSecondary}`
              }`}
          >
            <ShieldAlert className="w-3 h-3 flex-shrink-0" />
            Operations
            <ChevronRight className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-70" />
          </Link>
          <Link
            to="/government"
            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-md border text-[11px] font-semibold transition-all group
              ${isGov
                ? `bg-[var(--color-gov-brand)]/10 border-[var(--color-gov-brand)]/30 text-[var(--color-gov-brand)]`
                : `bg-[#060C18] border-[#1A2744] text-slate-400 hover:text-white hover:bg-[#0A1020]`
              }`}
          >
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400"></span>
            </span>
            Government Center
            <ChevronRight className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-70" />
          </Link>
        </div>

      </div>
    </aside>
  );
}
