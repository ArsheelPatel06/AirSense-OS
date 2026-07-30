import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

// --- Types ---
export type ToastType = 'success' | 'warning' | 'error';
export interface ToastMessage { id: string; message: string; type: ToastType; }

export interface Advisory { id: string; title: string; status: 'Draft' | 'Scheduled' | 'Sent' | 'Template'; time: string; type: string; recipients?: string; delivery?: string; }
export interface Report { id: string; name: string; type: string; generated: string; status: string; }
export interface Project { 
  id: string; 
  name: string; 
  department: string; 
  status: string; 
  progress: number; 
  budget: string;
  startDate?: string;
  targetCompletion?: string;
  objectives?: string[];
  impact?: { aqiImprovement: string; population: string; targetAreas: string; };
  milestones?: { date: string; milestone: string; completed: boolean; }[];
  stages?: { name: string; status: 'completed' | 'in_progress' | 'pending'; }[];
  summary?: string;
}
export interface GovAction { id: string; request: string; from: string; priority: string; status: string; route: string; type: 'advisory' | 'compliance'; }
export interface GovNotification { id: string; title: string; time: string; read: boolean; route: string; }

export interface GovProfile { name: string; role: string; department: string; email: string; }
export interface GovPreferences {
  theme: string;
  notifications: Record<string, boolean>;
  language: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  reportExportFormat: string;
}

interface GovState {
  advisories: Advisory[];
  reports: Report[];
  projects: Project[];
  pendingActions: GovAction[];
  notifications: GovNotification[];
  completedActions: GovAction[];
  profile: GovProfile;
  preferences: GovPreferences;
}

interface GovContextType {
  state: GovState;
  showToast: (message: string, type?: ToastType) => void;
  // Actions
  addAdvisory: (advisory: Advisory) => void;
  updateAdvisory: (id: string, updates: Partial<Advisory>) => void;
  deleteAdvisory: (id: string) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  addProject: (project: Project) => void;
  updateProjectProgress: (id: string, progress: number) => void;
  approveAction: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateProfile: (profile: GovProfile) => void;
  updatePreferences: (prefs: Partial<GovPreferences>) => void;
  resetPreferences: () => void;
}

const GovContext = createContext<GovContextType | undefined>(undefined);

// --- Initial Data ---
const initialAdvisories: Advisory[] = [
  { id: '1', title: 'Poor AQI Advisory', status: 'Draft', time: 'Edited 10 mins ago', type: 'drafts' },
  { id: '2', title: 'Heat Wave Warning', status: 'Draft', time: 'Edited 1 hour ago', type: 'drafts' },
  { id: '3', title: 'Rain Alert', status: 'Scheduled', time: 'Today 5:00 PM', type: 'scheduled' },
  { id: '4', title: 'School Closure Notice', status: 'Sent', time: 'Yesterday 08:15 AM', type: 'sent', recipients: '42,000', delivery: '99%' },
  { id: '5', title: 'Industrial Emission Alert', status: 'Template', time: '', type: 'templates' },
];

const initialReports: Report[] = [
  { id: '1', name: 'Daily AQI Report', type: 'Daily', generated: 'Today', status: 'Ready' },
  { id: '2', name: 'Weekly Summary', type: 'Weekly', generated: 'Monday', status: 'Ready' },
  { id: '3', name: 'Monthly AQI', type: 'Monthly', generated: 'Jun 30', status: 'Ready' },
  { id: '4', name: 'Compliance Report', type: 'Monthly', generated: 'Jun 30', status: 'Pending Review' },
];

const initialProjects: Project[] = [
  { 
    id: '1', name: 'Green Corridor Phase II', department: 'Urban Planning', status: 'In Progress', progress: 65, budget: '₹3.5 Cr',
    startDate: '12 May 2026', targetCompletion: '30 Sep 2026',
    objectives: ['Plant 12,000 trees', 'Develop roadside green belts', 'Improve air quality along Ring Road'],
    impact: { aqiImprovement: '+8%', population: '420,000', targetAreas: 'Industrial West, North Ring Road' },
    milestones: [
      { date: 'Jul 15', milestone: 'Install 10 Monitoring Stations', completed: true },
      { date: 'Aug 05', milestone: 'Complete Tree Plantation', completed: true },
      { date: 'Sep 01', milestone: 'Mid-Project Review', completed: false },
      { date: 'Sep 30', milestone: 'Project Completion', completed: false },
    ],
    stages: [
      { name: 'Planning', status: 'completed' },
      { name: 'Procurement', status: 'completed' },
      { name: 'Execution', status: 'completed' },
      { name: 'Monitoring', status: 'in_progress' },
      { name: 'Completed', status: 'pending' },
    ],
    summary: 'Green Corridor Phase II remains on schedule and is expected to improve air quality along the western transport corridor.'
  },
  { 
    id: '2', name: 'New AQ Monitoring Stations', department: 'Environment', status: 'Planning', progress: 20, budget: '₹1.2 Cr',
    startDate: '01 Jun 2026', targetCompletion: '30 Nov 2026',
    objectives: ['Install 50 new IoT sensors', 'Integrate with central platform'],
    impact: { aqiImprovement: 'N/A', population: 'City-wide', targetAreas: 'All Zones' },
    milestones: [
      { date: 'Jun 15', milestone: 'Vendor Selection', completed: true },
      { date: 'Aug 01', milestone: 'Sensor Delivery', completed: false },
      { date: 'Nov 30', milestone: 'Full Integration', completed: false },
    ],
    stages: [
      { name: 'Planning', status: 'in_progress' },
      { name: 'Procurement', status: 'pending' },
      { name: 'Execution', status: 'pending' },
      { name: 'Monitoring', status: 'pending' },
      { name: 'Completed', status: 'pending' },
    ],
    summary: 'Project is currently in the planning phase. Vendor selection has been finalized, pending procurement approval.'
  },
  { 
    id: '3', name: 'Industrial Emission Audit', department: 'Pollution Board', status: 'In Progress', progress: 45, budget: '₹0.5 Cr',
    startDate: '01 Mar 2026', targetCompletion: '30 Aug 2026',
    objectives: ['Audit 150 top polluters', 'Issue compliance guidelines'],
    impact: { aqiImprovement: '+5%', population: '800,000', targetAreas: 'Industrial West' },
    milestones: [
      { date: 'Apr 01', milestone: 'Phase 1 Audit Complete', completed: true },
      { date: 'Jul 15', milestone: 'Phase 2 Audit Complete', completed: false },
      { date: 'Aug 30', milestone: 'Final Report Submission', completed: false },
    ],
    stages: [
      { name: 'Planning', status: 'completed' },
      { name: 'Procurement', status: 'completed' },
      { name: 'Execution', status: 'in_progress' },
      { name: 'Monitoring', status: 'pending' },
      { name: 'Completed', status: 'pending' },
    ],
    summary: 'Audits are progressing well in the Industrial West zone. Expecting to issue 25 non-compliance notices next week.'
  },
  {
    id: '4', name: 'School Clean Air Program', department: 'Health', status: 'Completed', progress: 100, budget: '₹2.8 Cr',
    startDate: '10 Jan 2026', targetCompletion: '15 Apr 2026',
    objectives: ['Install indoor purifiers in 200 schools', 'Conduct awareness campaigns'],
    impact: { aqiImprovement: 'Indoor < 15µg', population: '150,000', targetAreas: 'City-wide' },
    milestones: [
      { date: 'Feb 01', milestone: 'Purifier Installation Phase 1', completed: true },
      { date: 'Mar 15', milestone: 'Awareness Campaign', completed: true },
      { date: 'Apr 15', milestone: 'Final Inspection', completed: true },
    ],
    stages: [
      { name: 'Planning', status: 'completed' },
      { name: 'Procurement', status: 'completed' },
      { name: 'Execution', status: 'completed' },
      { name: 'Monitoring', status: 'completed' },
      { name: 'Completed', status: 'completed' },
    ],
    summary: 'The School Clean Air Program has been completed successfully across all 200 targeted institutions.'
  }
];

const initialActions: GovAction[] = [
  { id: 'a1', request: 'Outdoor Worker Advisory', from: 'Operations', priority: 'High', status: 'Review', route: '/government/communication?draft=advisory-201', type: 'advisory' },
  { id: 'a2', request: 'School Advisory', from: 'Health Dept', priority: 'Medium', status: 'Pending', route: '/government/communication?draft=advisory-202', type: 'advisory' },
  { id: 'a3', request: 'Industrial Inspection', from: 'Pollution Board', priority: 'Medium', status: 'Pending', route: '/government/compliance?zone=industrial-west', type: 'compliance' },
];

const initialNotifications: GovNotification[] = [
  { id: 'n1', title: 'Compliance report ready', time: '10m ago', read: false, route: '/government/reports' },
  { id: 'n2', title: 'Citizen advisory awaiting approval', time: '1h ago', read: false, route: '/government/communication' },
  { id: 'n3', title: 'Industrial West exceeded limit', time: '2h ago', read: true, route: '/government/compliance' },
];

const initialProfile: GovProfile = {
  name: 'Jane Doe',
  role: 'Municipal Commissioner',
  department: 'Smart City Mission',
  email: 'jane.doe@city.gov.in'
};

const defaultPreferences: GovPreferences = {
  theme: 'light',
  notifications: {
    approvals: true, compliance: true, daily: true, weekly: true,
    milestones: true, citizen: false, email: true, inApp: true, sms: true
  },
  language: 'English',
  timeZone: 'Asia/Kolkata (IST)',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24 Hour',
  reportExportFormat: 'PDF Document (.pdf)'
};

// --- Provider ---
export function GovProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GovState>({
    advisories: initialAdvisories,
    reports: initialReports,
    projects: initialProjects,
    pendingActions: initialActions,
    completedActions: [],
    notifications: initialNotifications,
    profile: initialProfile,
    preferences: defaultPreferences
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    const duration = type === 'success' ? 2500 : type === 'warning' ? 3000 : 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Actions
  const addAdvisory = (adv: Advisory) => setState(s => ({ ...s, advisories: [adv, ...s.advisories] }));
  const updateAdvisory = (id: string, updates: Partial<Advisory>) => 
    setState(s => ({ ...s, advisories: s.advisories.map(a => a.id === id ? { ...a, ...updates } : a) }));
  const deleteAdvisory = (id: string) => setState(s => ({ ...s, advisories: s.advisories.filter(a => a.id !== id) }));
  
  const addReport = (rep: Report) => setState(s => ({ ...s, reports: [rep, ...s.reports] }));
  const updateReport = (id: string, updates: Partial<Report>) => 
    setState(s => ({ ...s, reports: s.reports.map(r => r.id === id ? { ...r, ...updates } : r) }));
  const deleteReport = (id: string) => setState(s => ({ ...s, reports: s.reports.filter(r => r.id !== id) }));
  
  const addProject = (proj: Project) => setState(s => ({ ...s, projects: [proj, ...s.projects] }));
  const updateProjectProgress = (id: string, progress: number) => 
    setState(s => ({ ...s, projects: s.projects.map(p => p.id === id ? { ...p, progress } : p) }));
  
  const approveAction = (id: string) => {
    setState(s => {
      const action = s.pendingActions.find(a => a.id === id);
      if (!action) return s;
      return {
        ...s,
        pendingActions: s.pendingActions.filter(a => a.id !== id),
        completedActions: [{ ...action, status: 'Approved' }, ...s.completedActions]
      };
    });
  };

  const markNotificationRead = (id: string) => 
    setState(s => ({ ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  
  const clearAllNotifications = () => setState(s => ({ ...s, notifications: [] }));

  const updateProfile = (profile: GovProfile) => setState(s => ({ ...s, profile }));
  const updatePreferences = (prefs: Partial<GovPreferences>) => setState(s => ({ ...s, preferences: { ...s.preferences, ...prefs } }));
  const resetPreferences = () => setState(s => ({ ...s, preferences: defaultPreferences }));

  // Apply theme dynamically when preferences change
  useEffect(() => {
    if (state.preferences.theme === 'dark') {
      document.body.classList.add('theme-gov-dark');
      document.body.classList.remove('theme-gov-light');
    } else {
      document.body.classList.add('theme-gov-light');
      document.body.classList.remove('theme-gov-dark');
    }
  }, [state.preferences.theme]);

  return (
    <GovContext.Provider value={{
      state, showToast, addAdvisory, updateAdvisory, deleteAdvisory,
      addReport, updateReport, deleteReport, addProject, updateProjectProgress, approveAction,
      markNotificationRead, clearAllNotifications, updateProfile, updatePreferences, resetPreferences
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
              'bg-[#FEF2F2] border-[#FECACA]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
            
            <span className={`text-[13px] font-bold ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'warning' ? 'text-amber-800' :
              'text-red-800'
            }`}>
              {toast.message}
            </span>
            
            <button onClick={() => removeToast(toast.id)} className="ml-2 p-1 opacity-50 hover:opacity-100 transition-opacity">
              <X className={`w-3.5 h-3.5 ${toast.type === 'success' ? 'text-green-800' : toast.type === 'warning' ? 'text-amber-800' : 'text-red-800'}`} />
            </button>
          </div>
        ))}
      </div>
    </GovContext.Provider>
  );
}

export const useGovStore = () => {
  const ctx = useContext(GovContext);
  if (!ctx) throw new Error('useGovStore must be used within GovProvider');
  return ctx;
};
