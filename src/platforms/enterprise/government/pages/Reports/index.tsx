import { 
  BarChart2, Calendar, Clock, Download, FileSpreadsheet, 
  FileText, Filter, Mail, Plus, Printer, Search, 
  Settings, ShieldCheck, File, Sparkles, CheckCircle2, ChevronLeft,
  Trash2, ChevronDown, Send
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGovStore } from '../../context/GovContext';
import { Modal } from '../../../../../shared/ui/Modal';
import { ConfirmationDialog } from '../../../../../shared/ui/ConfirmationDialog';

export function Reports() {
  const { state, addReport, updateReport, deleteReport, showToast } = useGovStore();
  const [searchParams] = useSearchParams();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Daily', 'Weekly', 'Monthly', 'Compliance', 'Executive'];

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  // Modals
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Forms
  const [genType, setGenType] = useState('Daily AQI Report');
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [reportToModify, setReportToModify] = useState<string | null>(null);

  // Deep linking logic
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'generate') setIsGenerateOpen(true);
    
    const reportQ = searchParams.get('report');
    if (reportQ === 'latest-executive') {
      const exec = state.reports.find(r => r.name.includes('Executive'));
      if (exec) setSelectedReportId(exec.id);
    }
  }, [searchParams, state.reports]);

  const displayedReports = activeFilter === 'All' 
    ? state.reports 
    : state.reports.filter(r => r.type.includes(activeFilter) || r.name.includes(activeFilter));
    
  const selectedReport = state.reports.find(r => r.id === selectedReportId) || state.reports[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newId = Math.random().toString(36).substr(2, 9);
      addReport({
        id: newId,
        name: genType,
        type: genType.split(' ')[0], // simple hack for mock data
        generated: 'Just now',
        status: 'Ready'
      });
      setIsGenerating(false);
      setIsGenerateOpen(false);
      showToast('Report generated successfully', 'success');
      setSelectedReportId(newId);
    }, 1500);
  };

  const handleEmail = () => {
    if (reportToModify && emailRecipient) {
      updateReport(reportToModify, { status: 'Sent' });
      showToast(`Report emailed to ${emailRecipient}`, 'success');
      setIsEmailOpen(false);
      setEmailRecipient('');
    }
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setReportToModify(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (reportToModify) {
      deleteReport(reportToModify);
      showToast('Report deleted', 'success');
      if (selectedReportId === reportToModify) setSelectedReportId(null);
    }
  };

  const openEmailModal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setReportToModify(id);
    setIsEmailOpen(true);
  };

  const categories = [
    { title: 'Daily AQI Report', time: 'Today • 08:00 AM' },
    { title: 'Weekly Summary', time: 'Monday • 09:00 AM' },
    { title: 'Monthly Report', time: 'Jun 30 • 10:00 AM' },
    { title: 'Compliance Report', time: 'Jun 30 • 11:00 AM' },
    { title: 'Executive Summary', time: 'Yesterday • 05:00 PM' },
    { title: 'Incident Summary', time: 'Jul 15 • 02:00 PM' },
  ];

  const scheduledReports = [
    { name: 'Daily AQI', frequency: 'Daily', recipients: 'Commissioner' },
    { name: 'Weekly Summary', frequency: 'Weekly', recipients: 'Health Dept' },
    { name: 'Monthly Compliance', frequency: 'Monthly', recipients: 'CPCB' },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full h-full flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <Link to="/government" className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-gov-text-muted)] hover:text-[var(--color-gov-brand)] uppercase tracking-wider mb-2 transition-colors">
            <ChevronLeft className="w-3 h-3" /> Executive Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-gov-text-primary)]">Reports</h1>
          <p className="text-[13px] text-[var(--color-gov-text-secondary)] mt-1">Generate and manage official environmental reports.</p>
        </div>
        <button 
          onClick={() => setIsGenerateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white rounded-lg font-bold text-[13px] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Generate Report
        </button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 shrink-0">
        {categories.map((cat, i) => (
          <div key={i} className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl p-4 shadow-sm flex flex-col gap-3 group hover:border-[var(--color-gov-brand)] transition-colors">
            <div>
              <div className="text-[13px] font-bold text-[var(--color-gov-text-primary)] line-clamp-1">{cat.title}</div>
              <div className="text-[11px] text-[var(--color-gov-text-secondary)] mt-0.5">Last Generated</div>
              <div className="text-[11px] font-bold text-[var(--color-gov-text-muted)]">{cat.time}</div>
            </div>
            <button 
              onClick={() => { setGenType(cat.title); setIsGenerateOpen(true); }}
              className="w-full mt-auto bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-brand)] hover:border-[var(--color-gov-brand)] hover:text-white text-[12px] font-bold text-[var(--color-gov-text-primary)] py-1.5 rounded transition-colors"
            >
              Generate
            </button>
          </div>
        ))}
      </div>

      {/* Main Split Area */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[800px] shrink-0">
        
        {/* Left Panel - Report List */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          
          {/* Filters & Search */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-md border transition-colors ${
                    activeFilter === f 
                      ? 'bg-[var(--color-gov-brand)]/10 border-[var(--color-gov-brand)] text-[var(--color-gov-brand)]' 
                      : 'bg-[var(--color-gov-surface)] border-[var(--color-gov-border)] text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)] hover:border-[var(--color-gov-text-muted)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--color-gov-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg pl-9 pr-3 py-2 text-[13px] text-[var(--color-gov-text-primary)] focus:outline-none focus:border-[var(--color-gov-brand)]"
              />
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-[var(--color-gov-border)] flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Recent Reports</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-gov-surface)]">
                    <th className="px-4 py-2.5 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider border-b border-[var(--color-gov-border)]">Report</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider border-b border-[var(--color-gov-border)]">Generated</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider border-b border-[var(--color-gov-border)] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-gov-border)]">
                  {displayedReports.map((report) => {
                    const isSelected = selectedReportId === report.id || (!selectedReportId && selectedReport?.id === report.id);
                    return (
                      <tr 
                        key={report.id} 
                        onClick={() => setSelectedReportId(report.id)}
                        className={`cursor-pointer transition-colors relative group ${isSelected ? 'bg-[var(--color-gov-brand)]/5' : 'hover:bg-[var(--color-gov-surface)]'}`}
                      >
                        <td className="px-4 py-4 relative">
                          {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-gov-brand)]"></div>}
                          <div className="flex items-center gap-3">
                            <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--color-gov-brand)]' : 'text-[var(--color-gov-text-muted)]'}`} />
                            <div className="flex flex-col">
                              <span className="font-bold text-[13px] text-[var(--color-gov-text-primary)]">{report.name}</span>
                              
                              {/* Hover actions */}
                              <div className="flex items-center gap-2 mt-1 h-0 overflow-hidden group-hover:h-5 transition-all opacity-0 group-hover:opacity-100">
                                <button onClick={(e) => openEmailModal(e, report.id)} className="text-[10px] font-bold text-[var(--color-gov-brand)] flex items-center gap-1 hover:underline">
                                  <Mail className="w-3 h-3" /> Email
                                </button>
                                <span className="text-[var(--color-gov-border)]">|</span>
                                <button onClick={(e) => confirmDelete(e, report.id)} className="text-[10px] font-bold text-[var(--color-gov-critical)] flex items-center gap-1 hover:underline">
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[var(--color-gov-text-secondary)]">
                          {report.generated}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            report.status === 'Ready' || report.status === 'Sent'
                              ? 'bg-[var(--color-gov-success)]/10 text-[var(--color-gov-success)]' 
                              : 'bg-[var(--color-gov-warning)]/10 text-[var(--color-gov-warning)]'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {displayedReports.length === 0 && (
                     <tr>
                       <td colSpan={3} className="px-4 py-8 text-center text-[13px] font-medium text-[var(--color-gov-text-muted)]">No reports found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Report Preview */}
        <div className="xl:col-span-7 flex flex-col gap-4 min-h-0">
          
          {selectedReport ? (
            <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
              
              {/* Preview Header / Details */}
              <div className="p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-[var(--color-gov-text-primary)]">{selectedReport.name}</h2>
                  <div className="text-[12px] text-[var(--color-gov-text-secondary)] mt-1">Generated: {selectedReport.generated} • Version 1.0</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">Generated By</span>
                  <span className="text-[12px] font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> AirSense AI
                  </span>
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase ml-2">Status</span>
                  <span className={`text-[12px] font-bold flex items-center gap-1 ${selectedReport.status === 'Ready' || selectedReport.status === 'Sent' ? 'text-[var(--color-gov-success)]' : 'text-[var(--color-gov-warning)]'}`}>
                    <CheckCircle2 className="w-3 h-3" /> {selectedReport.status}
                  </span>
                </div>
              </div>

              {/* Document Viewer */}
              <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-gov-background)]">
                <div className="max-w-[800px] mx-auto bg-white dark:bg-[#1A1A1A] border border-[var(--color-gov-border)] rounded shadow-sm p-8 min-h-[600px] flex flex-col gap-6">
                  
                  {/* Document Header */}
                  <div className="border-b-2 border-gray-200 dark:border-gray-800 pb-4 mb-4">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Official {selectedReport.type} Report</h1>
                    <div className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Ahmedabad Municipal Corporation</div>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Executive Summary</h3>
                    <p className="text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                      Data analysis for {selectedReport.name} indicates conditions are within expected operational bounds. No emergency measures were required, though continued monitoring is recommended.
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded p-4">
                      <div className="text-[11px] font-bold text-gray-500 uppercase">Average AQI</div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">86</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded p-4">
                      <div className="text-[11px] font-bold text-gray-500 uppercase">Highest AQI</div>
                      <div className="text-3xl font-black text-amber-500 mt-1">162 <span className="text-[14px] text-gray-500">Ind. West</span></div>
                    </div>
                  </div>

                  {/* Key Observations */}
                  <div>
                    <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Key Observations</h3>
                    <ul className="list-disc pl-5 text-[13px] text-gray-800 dark:text-gray-300 leading-relaxed space-y-2">
                      <li>PM10 levels remained strictly under 100 µg/m³ for 90% of the city.</li>
                      <li>Traffic emissions peaked around 09:00 AM at major junctions.</li>
                      <li>Wind dispersion significantly improved air quality post 18:00 PM.</li>
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Recommendations</h3>
                    <p className="text-[13px] text-gray-800 dark:text-gray-300 leading-relaxed">
                      Maintain standard monitoring protocols. Inform health departments to keep school advisories on standby if Industrial West trends upward tomorrow.
                    </p>
                  </div>

                </div>
              </div>

              {/* Export & Share Toolbar */}
              <div className="p-4 border-t border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] flex flex-wrap gap-3 items-center justify-center">
                <button 
                  onClick={() => showToast('Report downloaded to device', 'success')}
                  className="px-4 py-2 bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-brand-surface)] hover:text-[var(--color-gov-brand)] hover:border-[var(--color-gov-brand)]/50 rounded-lg text-[13px] font-bold text-[var(--color-gov-text-primary)] transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button 
                  onClick={() => showToast('Spreadsheet exported', 'success')}
                  className="px-4 py-2 bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-brand-surface)] hover:text-[var(--color-gov-brand)] hover:border-[var(--color-gov-brand)]/50 rounded-lg text-[13px] font-bold text-[var(--color-gov-text-primary)] transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export Excel
                </button>
                <button className="px-4 py-2 bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-brand-surface)] hover:text-[var(--color-gov-brand)] hover:border-[var(--color-gov-brand)]/50 rounded-lg text-[13px] font-bold text-[var(--color-gov-text-primary)] transition-all flex items-center gap-2">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button 
                  onClick={(e) => openEmailModal(e, selectedReport.id)}
                  className="px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white rounded-lg text-[13px] font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Email Report
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-xl shadow-sm flex flex-col items-center justify-center flex-1 min-h-0 text-[var(--color-gov-text-muted)]">
              <FileText className="w-12 h-12 mb-4" />
              <p className="text-[14px] font-medium">Select a report to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled Reports Footer */}
      <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-4 shrink-0 flex items-center gap-6 overflow-x-auto justify-between">
        <div className="flex items-center gap-6">
          <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider shrink-0 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Scheduled Reports
          </span>
          <div className="w-px h-6 bg-[var(--color-gov-border)] shrink-0"></div>
          <div className="flex items-center gap-6 shrink-0">
            {scheduledReports.map((sr, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-[var(--color-gov-text-primary)]">{sr.name}</span>
                <span className="text-[11px] font-bold text-[var(--color-gov-brand)] bg-[var(--color-gov-brand)]/10 px-2 py-0.5 rounded border border-[var(--color-gov-brand)]/20">{sr.frequency}</span>
                <span className="text-[12px] font-medium text-[var(--color-gov-text-secondary)]">{sr.recipients}</span>
                {i < scheduledReports.length - 1 && <div className="w-1 h-1 rounded-full bg-[var(--color-gov-border)] ml-3"></div>}
              </div>
            ))}
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-gov-border)] rounded bg-[var(--color-gov-surface)] text-[11px] font-bold text-[var(--color-gov-text-secondary)] hover:text-[var(--color-gov-text-primary)] transition-colors">
          <Settings className="w-3.5 h-3.5" /> Manage Schedule
        </button>
      </div>

      {/* Modals */}
      <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} title="Generate Report">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-8 h-8 border-4 border-[var(--color-gov-brand)]/30 border-t-[var(--color-gov-brand)] rounded-full animate-spin"></div>
            <div className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">Compiling Report Data...</div>
            <div className="text-[12px] text-[var(--color-gov-text-secondary)]">Analyzing historical inputs from IoT sensors</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Report Template</label>
              <div className="relative">
                <select 
                  value={genType}
                  onChange={(e) => setGenType(e.target.value)}
                  className="w-full appearance-none bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg pl-3 pr-8 py-2 text-[13px] font-medium text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none cursor-pointer"
                >
                  <option>Daily AQI Report</option>
                  <option>Weekly Summary</option>
                  <option>Monthly Compliance</option>
                  <option>Executive Brief</option>
                  <option>Incident Log</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[var(--color-gov-text-muted)] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button onClick={handleGenerate} className="px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white font-bold rounded-lg text-[13px] flex items-center gap-2 transition-colors">
                <Sparkles className="w-4 h-4" /> Generate Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} title="Email Report">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Recipient Email(s)</label>
            <input 
              type="text" 
              value={emailRecipient}
              onChange={(e) => setEmailRecipient(e.target.value)}
              placeholder="e.g. commissioner@city.gov"
              className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none" 
            />
            <div className="text-[11px] text-[var(--color-gov-text-muted)]">Separate multiple emails with commas.</div>
          </div>
          <div className="flex justify-end mt-2">
            <button onClick={handleEmail} disabled={!emailRecipient} className="px-4 py-2 bg-[var(--color-gov-brand)] text-white font-bold rounded-lg text-[13px] flex items-center gap-2 disabled:opacity-50">
              <Send className="w-4 h-4" /> Send Email
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Report"
        message="Are you sure you want to permanently delete this report from the archive?"
        confirmText="Delete"
        type="danger"
      />

    </div>
  );
}
