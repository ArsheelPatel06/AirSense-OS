import { useState } from 'react';
import { Breadcrumb } from '../../../../shared/ui/Breadcrumbs/Breadcrumb';
import { Settings, Save, Shield, HardDrive, Bell, Activity, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useIotStore } from '../context/IotContext';

export function SettingsWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useIotStore();
  const activeTab = searchParams.get('tab') || 'general';

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'telemetry', name: 'Telemetry', icon: Activity },
    { id: 'firmware', name: 'Firmware', icon: HardDrive },
    { id: 'alerts', name: 'Alerts & Routing', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'access', name: 'Access Control', icon: Users },
  ];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500 pb-8">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">Platform Settings</h1>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Configure global policies, telemetry rules, and fleet-wide behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('Settings saved successfully', 'success')} className="px-4 py-2 bg-[var(--color-iot-brand)] text-white text-[13px] font-medium rounded hover:bg-[var(--color-iot-brand-hover)] transition-colors shadow-sm flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-56 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors w-full text-left
                  ${activeTab === tab.id 
                    ? 'bg-[var(--color-iot-brand)]/10 text-[var(--color-iot-brand)]' 
                    : 'text-[var(--color-iot-text-secondary)] hover:text-[var(--color-iot-text-primary)] hover:bg-[#F1F5F9]'
                  }
                `}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[var(--color-iot-brand)]' : 'text-[var(--color-iot-text-muted)]'}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content area */}
        <div className="flex-1 bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
          
          {activeTab === 'general' && (
            <div>
              <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
                <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)]">General Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Organization Name</label>
                  <input type="text" defaultValue="Acme Corp" className="w-full max-w-md px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded focus:border-[var(--color-iot-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-iot-brand)] shadow-sm" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Default Timezone</label>
                  <select className="w-full max-w-md px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]">
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST" selected>EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'firmware' && (
            <div>
              <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
                <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)]">Firmware Update Policies</h3>
              </div>
              <div className="p-6 space-y-6">
                
                <div className="bg-[#F8FAFC] border border-[var(--color-iot-border)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">Automated Fleet Rollouts</h4>
                    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle-rollout" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ top: '2px', left: '2px', borderColor: 'var(--color-iot-brand)', backgroundColor: 'var(--color-iot-brand)' }}/>
                      <label htmlFor="toggle-rollout" className="toggle-label block overflow-hidden h-6 rounded-full bg-[var(--color-iot-brand)]/20 cursor-pointer"></label>
                    </div>
                  </div>
                  <p className="text-[12px] text-[var(--color-iot-text-secondary)]">Automatically apply stable firmware releases to devices based on fleet policies.</p>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Maintenance Window</label>
                  <div className="flex gap-4 items-center">
                    <select className="w-32 px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]">
                      <option value="00">00:00</option>
                      <option value="01">01:00</option>
                      <option value="02" selected>02:00</option>
                    </select>
                    <span className="text-[13px] text-[var(--color-iot-text-secondary)]">to</span>
                    <select className="w-32 px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]">
                      <option value="04">04:00</option>
                      <option value="05" selected>05:00</option>
                      <option value="06">06:00</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-[var(--color-iot-text-muted)] mt-2">Updates will only occur during this window (Local Time).</p>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
                <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)]">Alerts & Routing</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Notification Channels</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[13px] text-[var(--color-iot-text-primary)]">
                      <input type="checkbox" defaultChecked className="rounded border-[var(--color-iot-border)] text-[var(--color-iot-brand)] focus:ring-[var(--color-iot-brand)]" />
                      Email Alerts (System Admins)
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-[var(--color-iot-text-primary)]">
                      <input type="checkbox" defaultChecked className="rounded border-[var(--color-iot-border)] text-[var(--color-iot-brand)] focus:ring-[var(--color-iot-brand)]" />
                      Slack Integration (Ops Channel)
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-[var(--color-iot-text-primary)]">
                      <input type="checkbox" className="rounded border-[var(--color-iot-border)] text-[var(--color-iot-brand)] focus:ring-[var(--color-iot-brand)]" />
                      PagerDuty (Critical Only)
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Default Incident Assignee</label>
                  <select className="w-full max-w-md px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]">
                    <option value="unassigned">Unassigned (Round Robin)</option>
                    <option value="tier1">Tier 1 Support Queue</option>
                    <option value="tier2">Tier 2 Escalation</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div>
              <div className="p-4 border-b border-[var(--color-iot-border)] bg-[var(--color-iot-surface)]">
                <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)]">Telemetry Configuration</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-iot-text-primary)] mb-2">Global Data Retention</label>
                  <select className="w-full max-w-md px-3 py-2 text-[13px] bg-white border border-[var(--color-iot-border)] rounded shadow-sm focus:outline-none focus:border-[var(--color-iot-brand)] focus:ring-1 focus:ring-[var(--color-iot-brand)]">
                    <option value="30">30 Days (Standard)</option>
                    <option value="90" selected>90 Days (Compliance)</option>
                    <option value="365">1 Year (Cold Storage)</option>
                  </select>
                </div>
                <div className="bg-[#F8FAFC] border border-[var(--color-iot-border)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] font-bold text-[var(--color-iot-text-primary)]">High-Frequency Sampling</h4>
                    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle-sampling" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ top: '2px', left: '2px', borderColor: 'var(--color-iot-border)', backgroundColor: 'var(--color-iot-border)' }}/>
                      <label htmlFor="toggle-sampling" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"></label>
                    </div>
                  </div>
                  <p className="text-[12px] text-[var(--color-iot-text-secondary)]">Increase polling rate to 1s for critical fleets. Warning: This will significantly increase data ingest costs.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'firmware' && activeTab !== 'alerts' && activeTab !== 'telemetry' && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Settings className="w-8 h-8 text-[var(--color-iot-text-disabled)] mb-4" />
              <h3 className="text-[15px] font-bold text-[var(--color-iot-text-primary)] mb-2">Settings module under construction</h3>
              <p className="text-[13px] text-[var(--color-iot-text-secondary)] max-w-sm">The {tabs.find(t => t.id === activeTab)?.name} section is currently being migrated to the new configuration engine.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
