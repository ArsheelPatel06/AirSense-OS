import { useState } from 'react';
import { User, Bell, Palette, Globe, FileText, Check, ChevronDown, Monitor, Moon, Sun, Save, RotateCcw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGovStore } from '../../context/GovContext';
import { Modal } from '../../../../../shared/ui/Modal';

export function Settings() {
  const { state, showToast, updateProfile, updatePreferences, resetPreferences } = useGovStore();
  
  // Local state for edits that aren't saved yet
  const [theme, setTheme] = useState(state.preferences.theme);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...state.profile });

  // Notifications checkboxes (local until saved)
  const [notifications, setNotifications] = useState({ ...state.preferences.notifications });

  // Region and Report prefs (local until saved)
  const [language, setLanguage] = useState(state.preferences.language);
  const [timeZone, setTimeZone] = useState(state.preferences.timeZone);
  const [dateFormat, setDateFormat] = useState(state.preferences.dateFormat);
  const [timeFormat, setTimeFormat] = useState(state.preferences.timeFormat);
  const [exportFormat, setExportFormat] = useState(state.preferences.reportExportFormat);



  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditProfileOpen(false);
    showToast('Profile updated successfully', 'success');
  };

  const handleSaveChanges = () => {
    updatePreferences({
      theme,
      notifications,
      language,
      timeZone,
      dateFormat,
      timeFormat,
      reportExportFormat: exportFormat
    });
    showToast('Settings saved successfully', 'success');
  };

  const handleReset = () => {
    resetPreferences();
    setTheme('light');
    setNotifications({
      approvals: true, compliance: true, daily: true, weekly: true,
      milestones: true, citizen: false, email: true, inApp: true, sms: true
    });
    setLanguage('English');
    setTimeZone('Asia/Kolkata (IST)');
    setDateFormat('DD/MM/YYYY');
    setTimeFormat('24 Hour');
    setExportFormat('PDF Document (.pdf)');
    showToast('Settings reset to default', 'warning');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Checkbox = ({ label, checked, onChange }: { label: string, checked?: boolean, onChange?: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); onChange && onChange(); }}>
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
        checked 
          ? 'bg-[var(--color-gov-brand)] border-[var(--color-gov-brand)] text-white' 
          : 'border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] group-hover:border-[var(--color-gov-brand)] text-transparent'
      }`}>
        <Check className="w-3.5 h-3.5" />
      </div>
      <span className="text-[13px] text-[var(--color-gov-text-primary)] select-none">{label}</span>
    </label>
  );

  const Select = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange?: (val: string) => void }) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-bold text-[var(--color-gov-text-secondary)]">{label}</span>
      <div className="relative">
        <select value={value} onChange={e => onChange && onChange(e.target.value)} className="w-full appearance-none bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[13px] text-[var(--color-gov-text-primary)] outline-none focus:border-[var(--color-gov-brand)] cursor-pointer">
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gov-text-secondary)] pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="relative h-full flex flex-col bg-[var(--color-gov-bg)] overflow-hidden">
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto w-full p-6 pb-24 flex flex-col gap-6">
          
          {/* Header */}
          <div>
            <Link to="/government" className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-gov-text-muted)] hover:text-[var(--color-gov-brand)] uppercase tracking-wider mb-2 transition-colors">
              <ChevronLeft className="w-3 h-3" /> Executive Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[var(--color-gov-text-primary)]">Settings</h1>
            <p className="text-[13px] text-[var(--color-gov-text-secondary)] mt-1">Manage your Government Platform preferences.</p>
          </div>

          {/* Profile */}
          <section className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]/50">
              <User className="w-4 h-4 text-[var(--color-gov-brand)]" />
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-primary)] uppercase tracking-wider">Profile</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block mb-1">Name</span>
                  <span className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">{state.profile.name}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block mb-1">Role</span>
                  <span className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">{state.profile.role}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block mb-1">Department</span>
                  <span className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">{state.profile.department}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block mb-1">Email</span>
                  <span className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">{state.profile.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setEditForm({ ...state.profile });
                    setIsEditProfileOpen(true);
                  }}
                  className="px-4 py-2 bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-border)] text-[var(--color-gov-text-primary)] rounded-lg font-bold text-[13px] transition-colors"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => showToast('Password reset email sent', 'success')}
                  className="px-4 py-2 bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-border)] text-[var(--color-gov-text-primary)] rounded-lg font-bold text-[13px] transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]/50">
              <Bell className="w-4 h-4 text-[var(--color-gov-brand)]" />
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-primary)] uppercase tracking-wider">Notifications</h2>
            </div>
            <div className="p-5 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox label="Approval Requests" checked={notifications.approvals} onChange={() => toggleNotification('approvals')} />
                <Checkbox label="Compliance Updates" checked={notifications.compliance} onChange={() => toggleNotification('compliance')} />
                <Checkbox label="Daily AQI Summary" checked={notifications.daily} onChange={() => toggleNotification('daily')} />
                <Checkbox label="Weekly Executive Report" checked={notifications.weekly} onChange={() => toggleNotification('weekly')} />
                <Checkbox label="Project Milestones" checked={notifications.milestones} onChange={() => toggleNotification('milestones')} />
                <Checkbox label="Citizen Communication Status" checked={notifications.citizen} onChange={() => toggleNotification('citizen')} />
              </div>
              <div className="pt-4 border-t border-[var(--color-gov-border)]">
                <span className="text-[12px] font-bold text-[var(--color-gov-text-secondary)] block mb-3">Delivery Methods</span>
                <div className="flex flex-wrap items-center gap-4">
                  <Checkbox label="Email" checked={notifications.email} onChange={() => toggleNotification('email')} />
                  <Checkbox label="In-App" checked={notifications.inApp} onChange={() => toggleNotification('inApp')} />
                  <Checkbox label="SMS (Critical Alerts Only)" checked={notifications.sms} onChange={() => toggleNotification('sms')} />
                </div>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]/50">
              <Palette className="w-4 h-4 text-[var(--color-gov-brand)]" />
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-primary)] uppercase tracking-wider">Appearance</h2>
            </div>
            <div className="p-5">
              <span className="text-[12px] font-bold text-[var(--color-gov-text-secondary)] block mb-3">Theme</span>
              <div className="flex bg-[var(--color-gov-surface)] p-1 rounded-lg border border-[var(--color-gov-border)] w-fit">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${theme === 'light' ? 'bg-white shadow-sm text-[var(--color-gov-brand)]' : 'text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)]'}`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${theme === 'dark' ? 'bg-[var(--color-gov-card)] shadow-sm text-[var(--color-gov-brand)]' : 'text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)]'}`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${theme === 'system' ? 'bg-[var(--color-gov-card)] shadow-sm text-[var(--color-gov-brand)]' : 'text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)]'}`}
                >
                  <Monitor className="w-4 h-4" /> System
                </button>
              </div>
            </div>
          </section>

          {/* Language & Region */}
          <section className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]/50">
              <Globe className="w-4 h-4 text-[var(--color-gov-brand)]" />
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-primary)] uppercase tracking-wider">Language & Region</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select label="Language" value={language} onChange={setLanguage} options={['English', 'Hindi', 'Gujarati', 'Marathi']} />
              <Select label="Time Zone" value={timeZone} onChange={setTimeZone} options={['Asia/Kolkata (IST)', 'UTC']} />
              <Select label="Date Format" value={dateFormat} onChange={setDateFormat} options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
              <Select label="Time Format" value={timeFormat} onChange={setTimeFormat} options={['24 Hour', '12 Hour']} />
            </div>
          </section>

          {/* Report Preferences */}
          <section className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]/50">
              <FileText className="w-4 h-4 text-[var(--color-gov-brand)]" />
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-primary)] uppercase tracking-wider">Report Preferences</h2>
            </div>
            <div className="p-5 flex flex-col gap-6">
              
              <div className="w-full sm:w-1/2">
                <Select label="Default Export Format" value={exportFormat} onChange={setExportFormat} options={['PDF Document (.pdf)', 'Excel Spreadsheet (.xlsx)', 'CSV (.csv)']} />
              </div>

              <div>
                <span className="text-[12px] font-bold text-[var(--color-gov-text-secondary)] block mb-3">Include in Exports</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Checkbox label="Executive Summary" checked={true} />
                  <Checkbox label="Charts & Graphs" checked={true} />
                  <Checkbox label="Recommendations" checked={true} />
                  <Checkbox label="Department Logo" checked={true} />
                  <Checkbox label="Digital Signature" checked={true} />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] -mx-5 -mb-5 p-5">
                <span className="text-[12px] font-bold text-[var(--color-gov-text-secondary)] block mb-2">Scheduled Reports</span>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] px-3 py-1.5 rounded-md flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)]">Daily AQI</span>
                    <span className="text-[12px] text-[var(--color-gov-text-secondary)]">08:00 AM</span>
                  </div>
                  <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] px-3 py-1.5 rounded-md flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)]">Weekly Summary</span>
                    <span className="text-[12px] text-[var(--color-gov-text-secondary)]">Monday</span>
                  </div>
                  <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] px-3 py-1.5 rounded-md flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)]">Monthly Report</span>
                    <span className="text-[12px] text-[var(--color-gov-text-secondary)]">1st of Month</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--color-gov-card)] border-t border-[var(--color-gov-border)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20 flex justify-end">
        <div className="max-w-[800px] w-full mx-auto flex justify-end gap-3 px-2">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-border)] text-[var(--color-gov-text-primary)] rounded-lg font-bold text-[13px] transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white rounded-lg font-bold text-[13px] transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Profile">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              value={editForm.name}
              onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Role</label>
            <input 
              type="text" 
              value={editForm.role}
              onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
              className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Department</label>
            <input 
              type="text" 
              value={editForm.department}
              onChange={e => setEditForm(prev => ({ ...prev, department: e.target.value }))}
              className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={editForm.email}
              onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleSaveProfile} className="px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white font-bold rounded-lg text-[13px] transition-colors">
              Save Profile
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
