import { ShieldAlert, Info, Download, AlertTriangle, ArrowUpRight } from 'lucide-react';

const MOCK_VIOLATIONS = [
  {
    id: 'VIO-2024-089',
    date: '2024-03-12',
    entity: 'Plant B (Vatva GIDC)',
    type: 'GPCB Standard Breach',
    metric: 'VOC Emissions',
    status: 'Under Review',
    severity: 'High',
    fine: '₹5,00,000'
  },
  {
    id: 'VIO-2024-088',
    date: '2024-03-10',
    entity: 'SG Highway Construction',
    type: 'Local Ordinance (Noise)',
    metric: 'dB Level > 85',
    status: 'Resolved',
    severity: 'Medium',
    fine: '₹50,000'
  },
  {
    id: 'VIO-2024-085',
    date: '2024-02-28',
    entity: 'City Logistics Fleet',
    type: 'AMC Idling Limits',
    metric: 'Idle Time > 15m',
    status: 'Appealed',
    severity: 'Low',
    fine: '₹10,000'
  },
  {
    id: 'VIO-2024-081',
    date: '2024-02-14',
    entity: 'Plant A (Naroda)',
    type: 'NAAQS Standard Breach',
    metric: 'PM10 Spike',
    status: 'Resolved',
    severity: 'High',
    fine: '₹12,50,000'
  }
];

export function ViolationsOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1C1E] rounded-xl border border-slate-200 dark:border-[#38383A] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Active Violations</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">4</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mt-2">
            <ArrowUpRight className="w-3 h-3" />
            <span>+2 from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] rounded-xl border border-slate-200 dark:border-[#38383A] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Pending Fines</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">₹5,10,000</p>
          <p className="text-xs font-semibold text-slate-400 mt-2">Awaiting appeal decisions</p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl flex gap-4">
        <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300">GPCB Annual Audit Approaching</h4>
          <p className="text-xs text-orange-700 dark:text-orange-400/80 mt-1 max-w-3xl leading-relaxed">
            The annual Gujarat Pollution Control Board (GPCB) compliance audit is scheduled for Q2. Ensure all 'Under Review' violations are resolved and documented prior to the data freeze on April 15th.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214] flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Violations Log</h2>
          <button className="text-xs font-bold text-[var(--color-ops-brand)] hover:underline">View All Records</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#38383A] text-xs font-bold text-slate-500 uppercase tracking-wider bg-white dark:bg-[#1C1C1E]">
                <th className="px-5 py-3 font-semibold">Violation ID</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Entity</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Potential Fine</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2C2E33]">
              {MOCK_VIOLATIONS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-[#25262B] transition-colors group">
                  <td className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white">{row.id}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{row.date}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{row.entity}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 flex flex-col">
                    <span>{row.type}</span>
                    <span className="text-[10px] text-red-500 font-bold">{row.metric}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      row.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      row.status === 'Appealed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-mono text-slate-500">{row.fine}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-[var(--color-ops-brand)] transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-[#38383A]">
                      <Download className="w-4 h-4" />
                    </button>
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
