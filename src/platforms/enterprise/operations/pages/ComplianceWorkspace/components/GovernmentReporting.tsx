import { FileText, CheckCircle, Clock, AlertCircle, Plus, MoreVertical, Download } from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 'REP-2024-Q1',
    name: 'Form V Environmental Statement',
    period: 'Jan 1 - Mar 31, 2024',
    agency: 'GPCB (Gujarat Board)',
    dueDate: '2024-04-15',
    status: 'Draft',
    progress: 85,
  },
  {
    id: 'REP-2024-M03',
    name: 'March NCAP Compliance Summary',
    period: 'Mar 1 - Mar 31, 2024',
    agency: 'CPCB',
    dueDate: '2024-04-05',
    status: 'Submitted',
    progress: 100,
  },
  {
    id: 'REP-2024-M02',
    name: 'February NCAP Compliance Summary',
    period: 'Feb 1 - Feb 28, 2024',
    agency: 'CPCB',
    dueDate: '2024-03-05',
    status: 'Submitted',
    progress: 100,
  },
  {
    id: 'REP-2023-ANNUAL',
    name: '2023 Annual MoEFCC Filing',
    period: 'Jan 1 - Dec 31, 2023',
    agency: 'MoEFCC',
    dueDate: '2024-02-28',
    status: 'Overdue',
    progress: 95,
  }
];

export function GovernmentReporting() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Government Reporting</h2>
          <p className="text-sm text-slate-500">Manage and track regulatory submissions.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--color-ops-brand)] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[var(--color-ops-brand-hover)] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due This Month</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">2</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Submitted YTD</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">14</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] border border-red-200 dark:border-red-900/30 rounded-xl p-5 flex items-start justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-500">1</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active & Recent Filings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#38383A] text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white dark:bg-[#1C1C1E]">
                <th className="px-5 py-3">Report Name</th>
                <th className="px-5 py-3">Agency</th>
                <th className="px-5 py-3">Reporting Period</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2C2E33]">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-[#25262B] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{report.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">{report.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {report.agency}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {report.period}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {report.dueDate}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded w-max text-[10px] font-bold uppercase tracking-wider ${
                        report.status === 'Submitted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        report.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                      }`}>
                        {report.status}
                      </span>
                      {report.status !== 'Submitted' && (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-200 dark:bg-[#38383A] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${report.status === 'Overdue' ? 'bg-red-500' : 'bg-blue-500'}`}
                              style={{ width: `${report.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">{report.progress}%</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-[var(--color-ops-brand)] transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-[#38383A]" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-[#38383A]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
