import { 
  CheckCircle2, Clock, FileEdit, Filter, MessageSquare, 
  Phone, Plus, Search, Send, Smartphone, Mail, Globe, 
  ChevronDown, Users, ChevronLeft, Trash2, Copy, Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGovStore } from '../../context/GovContext';
import { Modal } from '../../../../../shared/ui/Modal';
import { ConfirmationDialog } from '../../../../../shared/ui/ConfirmationDialog';

export function CitizenCommunication() {
  const { state, addAdvisory, updateAdvisory, deleteAdvisory, showToast } = useGovStore();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('drafts');
  
  // Composer State
  const [composerMode, setComposerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('Poor AQI Advisory');
  const [category, setCategory] = useState('AQI Advisory');
  const [message, setMessage] = useState('Air quality is expected to worsen this afternoon.\n\nLimit outdoor activities.\n\nWear a mask if necessary.');
  
  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState<string | null>(null);

  // Sync with URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
    const action = searchParams.get('action');
    if (action === 'new') handleNewAdvisory();
  }, [searchParams]);

  const tabs = [
    { id: 'drafts', label: 'Drafts', count: state.advisories.filter(a => a.type === 'drafts').length },
    { id: 'scheduled', label: 'Scheduled', count: state.advisories.filter(a => a.type === 'scheduled').length },
    { id: 'sent', label: 'Sent', count: state.advisories.filter(a => a.type === 'sent').length },
    { id: 'templates', label: 'Templates', count: state.advisories.filter(a => a.type === 'templates').length },
  ];

  const activeMessages = state.advisories.filter(m => m.type === activeTab);

  const handleNewAdvisory = () => {
    setComposerMode('create');
    setSelectedMsgId(null);
    setTitle('');
    setMessage('');
  };

  const handleSelectMessage = (msg: any) => {
    setSelectedMsgId(msg.id);
    setTitle(msg.title);
    setMessage(msg.title === 'Poor AQI Advisory' ? 'Air quality is expected to worsen this afternoon.\n\nLimit outdoor activities.\n\nWear a mask if necessary.' : 'Sample message for ' + msg.title);
    setComposerMode(msg.status === 'Sent' ? 'view' : 'edit');
  };

  const handleSaveDraft = () => {
    if (composerMode === 'create') {
      addAdvisory({
        id: Math.random().toString(36).substr(2, 9),
        title: title || 'Untitled Draft',
        status: 'Draft',
        time: 'Just now',
        type: 'drafts'
      });
    } else if (selectedMsgId) {
      updateAdvisory(selectedMsgId, { title: title || 'Untitled Draft', time: 'Just now' });
    }
    showToast('Draft saved successfully', 'success');
  };

  const handleSendNow = () => {
    if (composerMode === 'create') {
      addAdvisory({
        id: Math.random().toString(36).substr(2, 9),
        title: title || 'Untitled Advisory',
        status: 'Sent',
        time: 'Just now',
        type: 'sent',
        recipients: '42,000',
        delivery: '99%'
      });
    } else if (selectedMsgId) {
      updateAdvisory(selectedMsgId, { status: 'Sent', type: 'sent', time: 'Just now', recipients: '42,000', delivery: '99%' });
    }
    showToast('Advisory sent successfully to all channels', 'success');
    setActiveTab('sent');
    handleNewAdvisory();
  };

  const handleSchedule = () => {
    if (composerMode === 'create') {
      addAdvisory({
        id: Math.random().toString(36).substr(2, 9),
        title: title || 'Untitled Advisory',
        status: 'Scheduled',
        time: 'Tomorrow, 09:00 AM',
        type: 'scheduled'
      });
    } else if (selectedMsgId) {
      updateAdvisory(selectedMsgId, { status: 'Scheduled', type: 'scheduled', time: 'Tomorrow, 09:00 AM' });
    }
    showToast('Advisory scheduled for Tomorrow, 09:00 AM', 'success');
    setIsScheduleOpen(false);
    setActiveTab('scheduled');
    handleNewAdvisory();
  };

  const handleDuplicate = (e: React.MouseEvent, msg: any) => {
    e.stopPropagation();
    addAdvisory({
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      title: `${msg.title} (Copy)`,
      status: 'Draft',
      type: 'drafts',
      time: 'Just now'
    });
    showToast('Advisory duplicated to Drafts', 'info');
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMsgToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (msgToDelete) {
      deleteAdvisory(msgToDelete);
      showToast('Advisory deleted', 'success');
      if (selectedMsgId === msgToDelete) handleNewAdvisory();
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full h-full flex flex-col gap-4 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 mb-2">
        <div>
          <Link to="/government" className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-gov-text-muted)] hover:text-[var(--color-gov-brand)] uppercase tracking-wider mb-2 transition-colors">
            <ChevronLeft className="w-3 h-3" /> Executive Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-gov-text-primary)]">Citizen Communication</h1>
          <p className="text-[13px] text-[var(--color-gov-text-secondary)] mt-1">Manage official advisories, alerts and public announcements.</p>
        </div>
        <button 
          onClick={handleNewAdvisory}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white rounded-lg font-bold text-[13px] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Advisory
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--color-gov-border)] shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-[var(--color-gov-brand)] text-[var(--color-gov-brand)]'
                : 'border-transparent text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)] hover:border-[var(--color-gov-border)]'
            }`}
          >
            {tab.label}
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id 
                ? 'bg-[var(--color-gov-brand)]/10 text-[var(--color-gov-brand)]' 
                : 'bg-[var(--color-gov-surface)] text-[var(--color-gov-text-muted)]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        
        {/* Left Panel - Communication List */}
        <div className="w-[320px] shrink-0 flex flex-col bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] flex flex-col gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--color-gov-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[var(--color-gov-background)] border border-[var(--color-gov-border)] rounded-md pl-9 pr-3 py-1.5 text-[13px] text-[var(--color-gov-text-primary)] focus:outline-none focus:border-[var(--color-gov-brand)] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-gov-background)] border border-[var(--color-gov-border)] rounded-md py-1 text-[11px] font-bold text-[var(--color-gov-text-secondary)] hover:bg-[var(--color-gov-surface)]">
                <Filter className="w-3 h-3" /> Status
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-gov-background)] border border-[var(--color-gov-border)] rounded-md py-1 text-[11px] font-bold text-[var(--color-gov-text-secondary)] hover:bg-[var(--color-gov-surface)]">
                <Users className="w-3 h-3" /> Audience
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {activeMessages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectMessage(msg)}
                className={`group w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col ${selectedMsgId === msg.id ? 'bg-[var(--color-gov-brand-surface)] border-[var(--color-gov-brand)]/30' : 'bg-transparent border-transparent hover:bg-[var(--color-gov-surface)]'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-[13px] text-[var(--color-gov-text-primary)] truncate pr-2">{msg.title}</div>
                  
                  {/* Hover Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleDuplicate(e, msg)} className="p-1 hover:bg-[var(--color-gov-border)] rounded text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)]">
                      <Copy className="w-3 h-3" />
                    </button>
                    {(msg.type === 'drafts' || msg.type === 'scheduled') && (
                      <button onClick={(e) => confirmDelete(e, msg.id)} className="p-1 hover:bg-[var(--color-gov-critical)]/10 rounded text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-critical)]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-bold ${
                    msg.status === 'Draft' ? 'text-[var(--color-gov-warning)]' :
                    msg.status === 'Scheduled' ? 'text-[var(--color-gov-brand)]' :
                    msg.status === 'Sent' ? 'text-[var(--color-gov-success)]' :
                    'text-[var(--color-gov-text-secondary)]'
                  }`}>{msg.status}</span>
                  <span className="text-[var(--color-gov-text-muted)] font-medium">{msg.time}</span>
                </div>
              </div>
            ))}
            {activeMessages.length === 0 && (
              <div className="text-center p-8 text-[13px] text-[var(--color-gov-text-muted)] font-medium">
                No {activeTab} found.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Compose / View */}
        <div className="flex-1 flex flex-col bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] flex justify-between items-center shrink-0">
             <h2 className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">
               {composerMode === 'create' ? 'Create New Advisory' : composerMode === 'view' ? 'View Sent Advisory' : 'Edit Advisory'}
             </h2>
             {composerMode === 'view' && (
               <span className="text-[12px] font-bold px-2 py-1 bg-[var(--color-gov-success)]/10 text-[var(--color-gov-success)] rounded border border-[var(--color-gov-success)]/20">Sent Successfully</span>
             )}
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* Row 1: Title & Category */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={composerMode === 'view'}
                  placeholder="e.g. Poor AQI Alert"
                  className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] font-semibold text-[var(--color-gov-text-primary)] focus:outline-none focus:border-[var(--color-gov-brand)] disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Category</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={composerMode === 'view'}
                    className="w-full appearance-none bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg pl-3 pr-8 py-2 text-[13px] font-medium text-[var(--color-gov-text-primary)] focus:outline-none focus:border-[var(--color-gov-brand)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option>AQI Advisory</option>
                    <option>Weather</option>
                    <option>Health</option>
                    <option>Traffic</option>
                    <option>Public Notice</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[var(--color-gov-text-muted)] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Message & Audience/Channels (Split) */}
            <div className="flex gap-6">
              
              {/* Message Editor */}
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Message</label>
                <div className="flex-1 flex flex-col border border-[var(--color-gov-border)] rounded-lg overflow-hidden bg-[var(--color-gov-surface)]">
                  {composerMode !== 'view' && (
                    <div className="flex items-center gap-2 p-2 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-background)]">
                      <button className="px-2 py-1 text-[13px] font-bold hover:bg-[var(--color-gov-surface)] rounded text-[var(--color-gov-text-primary)]">B</button>
                      <button className="px-2 py-1 text-[13px] font-bold hover:bg-[var(--color-gov-surface)] rounded text-[var(--color-gov-text-primary)] italic">I</button>
                      <div className="w-px h-4 bg-[var(--color-gov-border)] mx-1"></div>
                      <button className="px-2 py-1 text-[13px] hover:bg-[var(--color-gov-surface)] rounded text-[var(--color-gov-text-primary)]">• List</button>
                    </div>
                  )}
                  <textarea 
                    className="w-full flex-1 p-3 bg-transparent resize-none text-[13px] text-[var(--color-gov-text-primary)] focus:outline-none leading-relaxed min-h-[150px] disabled:opacity-70"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={composerMode === 'view'}
                  />
                </div>
              </div>

              {/* Side Config (Audience, Channels, Schedule) */}
              <div className="w-[280px] shrink-0 flex flex-col gap-6">
                
                {/* Audience */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Audience</label>
                  <div className="flex flex-wrap gap-2">
                    {['Entire City', 'North Zone', 'Schools'].map((aud, i) => (
                      <button key={i} disabled={composerMode === 'view'} className={`px-2.5 py-1 text-[11px] font-bold rounded-md border transition-colors ${i === 0 ? 'bg-[var(--color-gov-brand)]/10 border-[var(--color-gov-brand)] text-[var(--color-gov-brand)]' : 'bg-[var(--color-gov-surface)] border-[var(--color-gov-border)] text-[var(--color-gov-text-secondary)] hover:border-[var(--color-gov-text-muted)]'} disabled:opacity-50`}>
                        {aud}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Channels */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Delivery Channels</label>
                  <div className="flex flex-col gap-2 bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg p-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked disabled={composerMode === 'view'} className="accent-[var(--color-gov-brand)] w-3.5 h-3.5" />
                      <Smartphone className="w-3.5 h-3.5 text-[var(--color-gov-text-muted)]" />
                      <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)]">Mobile App</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked disabled={composerMode === 'view'} className="accent-[var(--color-gov-brand)] w-3.5 h-3.5" />
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--color-gov-text-muted)]" />
                      <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)]">SMS</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked disabled={composerMode === 'view'} className="accent-[var(--color-gov-brand)] w-3.5 h-3.5" />
                      <Globe className="w-3.5 h-3.5 text-[var(--color-gov-text-muted)]" />
                      <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)]">Website</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Live Preview Toggle button */}
            <div className="bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg p-4 flex items-start gap-4">
               <Phone className="w-5 h-5 text-[var(--color-gov-text-muted)] shrink-0 mt-0.5" />
               <div className="flex-1">
                 <div className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-2">Live Mobile Preview</div>
                 <div className="bg-white dark:bg-[#1A1A1A] border border-[var(--color-gov-border)] rounded-[20px] p-4 max-w-[300px] shadow-sm">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                       <span className="text-white text-[10px] font-bold">A</span>
                     </div>
                     <span className="text-[12px] font-bold text-gray-900 dark:text-white">AirSense Alert</span>
                   </div>
                   <div className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">{title || 'Message Title'}</div>
                   <div className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                     {message || 'Your message will appear here...'}
                   </div>
                 </div>
               </div>
            </div>

          </div>

          {/* Bottom Action Bar */}
          {composerMode !== 'view' && (
            <div className="p-4 border-t border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] flex items-center justify-between shrink-0">
              <button 
                onClick={handleNewAdvisory}
                className="px-4 py-2 text-[13px] font-bold text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)] transition-colors"
              >
                Discard
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSaveDraft}
                  className="px-4 py-2 border border-[var(--color-gov-border)] bg-[var(--color-gov-background)] hover:bg-[var(--color-gov-surface)] rounded-lg text-[13px] font-bold text-[var(--color-gov-text-primary)] transition-colors"
                >
                  Save Draft
                </button>
                <button 
                  onClick={() => setIsScheduleOpen(true)}
                  className="px-4 py-2 border border-[var(--color-gov-border)] bg-[var(--color-gov-background)] hover:bg-[var(--color-gov-surface)] rounded-lg text-[13px] font-bold text-[var(--color-gov-text-primary)] transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Schedule
                </button>
                <button 
                  onClick={() => setIsSendConfirmOpen(true)}
                  className="px-6 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Status Footer (shows sent metrics if any) */}
      <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-4 shrink-0 flex items-center gap-6 overflow-x-auto">
        <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider shrink-0">Recent Delivery Status</span>
        <div className="w-px h-6 bg-[var(--color-gov-border)] shrink-0"></div>
        <div className="flex items-center gap-8 shrink-0">
          {state.advisories.filter(a => a.status === 'Sent' || a.status === 'Scheduled').slice(0, 3).map((a, i) => (
            <div key={a.id} className={`flex items-center gap-4 ${i > 0 ? 'opacity-60' : ''}`}>
              <span className="text-[13px] font-bold text-[var(--color-gov-text-primary)]">{a.title}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${a.status === 'Sent' ? 'text-[var(--color-gov-success)] bg-[var(--color-gov-success)]/10' : 'text-[var(--color-gov-brand)] bg-[var(--color-gov-brand)]/10'}`}>{a.status}</span>
              <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)]">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ConfirmationDialog 
        isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        onConfirm={handleSendNow}
        title="Confirm Send Advisory"
        message={`Are you sure you want to send "${title}" to all selected channels? This action cannot be undone.`}
        confirmText="Send Now"
        type="info"
      />

      <ConfirmationDialog 
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Draft"
        message="Are you sure you want to delete this draft? It cannot be recovered."
        confirmText="Delete"
        type="danger"
      />

      <Modal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Schedule Advisory">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[var(--color-gov-text-secondary)]">Select Date & Time</label>
            <input type="datetime-local" className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none" />
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleSchedule} className="px-4 py-2 bg-[var(--color-gov-brand)] text-white font-bold rounded-lg text-[13px]">
              Confirm Schedule
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
