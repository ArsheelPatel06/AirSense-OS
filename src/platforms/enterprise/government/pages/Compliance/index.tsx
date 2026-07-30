import { ShieldCheck, Target, AlertTriangle, FileText, CheckCircle2, AlertCircle, Sparkles, FileSpreadsheet, FolderOpen, Eye, Check, Plus, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useGovStore } from '../../context/GovContext';
import { ConfirmationDialog } from '../../../../../shared/ui/ConfirmationDialog';

export function Compliance() {
  const { state, approveAction, showToast } = useGovStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [actionToApprove, setActionToApprove] = useState<string | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  useEffect(() => {
    const zone = searchParams.get('zone');
    if (zone) setSelectedZone(zone);
    else setSelectedZone(null);
  }, [searchParams]);

  const overviewCards = [
    { title: 'Compliance Score', value: '96%' },
    { title: 'Zones Compliant', value: '18 / 20' },
    { title: 'Requiring Attention', value: '2' },
    { title: 'Exceeded Days', value: '5 Days' },
    { title: 'Pending Filings', value: '1 Pending' },
    { title: 'Open Notices', value: '2 Open' },
  ];

  const zoneCompliance = [
    { id: 'north', zone: 'North', aqiStatus: 'Good', compliance: 'Compliant', action: 'None', pm25: '35 µg/m³', pm10: '60 µg/m³' },
    { id: 'south', zone: 'South', aqiStatus: 'Moderate', compliance: 'Compliant', action: 'None', pm25: '45 µg/m³', pm10: '85 µg/m³' },
    { id: 'industrial-west', zone: 'Industrial West', aqiStatus: 'Poor', compliance: 'Review', action: 'Inspection Recommended', pm25: '142 µg/m³', pm10: '190 µg/m³' },
    { id: 'east', zone: 'East', aqiStatus: 'Moderate', compliance: 'Compliant', action: 'None', pm25: '50 µg/m³', pm10: '92 µg/m³' },
  ];

  const activeZoneData = zoneCompliance.find(z => z.id === selectedZone);

  const standards = [
    { standard: 'CPCB Daily AQI', status: 'Meeting' },
    { standard: 'PM2.5 Limit', status: 'Exceeded' },
    { standard: 'PM10 Limit', status: 'Meeting' },
    { standard: 'NO₂ Limit', status: 'Meeting' },
    { standard: 'O₃ Limit', status: 'Meeting' },
  ];

  const trendData = [
    { month: 'Jan', score: 91 },
    { month: 'Feb', score: 93 },
    { month: 'Mar', score: 95 },
    { month: 'Apr', score: 96 },
    { month: 'May', score: 94 },
    { month: 'Jun', score: 96 },
  ];

  const pendingActions = state.pendingActions;
  const completedActions = state.completedActions;

  const confirmApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActionToApprove(id);
    setIsApproveOpen(true);
  };

  const handleApprove = () => {
    if (actionToApprove) {
      approveAction(actionToApprove);
      showToast('Action approved and added to audit trail', 'success');
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 overflow-hidden h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <Link to="/government" className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-gov-text-muted)] hover:text-[var(--color-gov-brand)] uppercase tracking-wider mb-2 transition-colors">
            <ChevronLeft className="w-3 h-3" /> Executive Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-gov-text-primary)]">Compliance</h1>
          <p className="text-[13px] text-[var(--color-gov-text-secondary)] mt-1">Monitor environmental compliance across the city.</p>
        </div>
        <Link 
          to="/government/reports?action=generate"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white rounded-lg font-bold text-[13px] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Generate Report
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 shrink-0">
        {overviewCards.map((card, i) => (
          <div key={i} className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl p-4 shadow-sm flex flex-col">
            <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-2">{card.title}</span>
            <span className="text-2xl font-black text-[var(--color-gov-text-primary)]">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0 shrink-0">
        
        {/* Left Column (xl:col-span-8) */}
        <div className="xl:col-span-8 flex flex-col gap-6 min-h-0">
          
          {/* Compliance by Zone / Zone Details */}
          <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px]">
            {selectedZone && activeZoneData ? (
              // Zone Details View
              <div className="flex flex-col h-full bg-[var(--color-gov-surface)]">
                <div className="p-4 border-b border-[var(--color-gov-border)] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => navigate('/government/compliance')}
                      className="p-1.5 hover:bg-[var(--color-gov-border)] rounded text-[var(--color-gov-text-secondary)] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h2 className="text-[16px] font-bold text-[var(--color-gov-text-primary)]">{activeZoneData.zone} Zone Overview</h2>
                  </div>
                  {activeZoneData.compliance === 'Compliant' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-gov-success)]/10 border border-[var(--color-gov-success)]/20 text-[12px] font-bold text-[var(--color-gov-success)] rounded-full">
                      <CheckCircle2 className="w-4 h-4" /> Fully Compliant
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-gov-warning)]/10 border border-[var(--color-gov-warning)]/20 text-[12px] font-bold text-[var(--color-gov-warning)] rounded-full">
                      <AlertTriangle className="w-4 h-4" /> Review Required
                    </span>
                  )}
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-lg p-4">
                      <div className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">Current AQI Status</div>
                      <div className={`text-2xl font-black mt-1 ${activeZoneData.aqiStatus === 'Good' ? 'text-[var(--color-gov-success)]' : activeZoneData.aqiStatus === 'Moderate' ? 'text-yellow-600' : 'text-red-500'}`}>
                        {activeZoneData.aqiStatus}
                      </div>
                    </div>
                    <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-lg p-4">
                      <div className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">Recommended Action</div>
                      <div className="text-[14px] font-bold text-[var(--color-gov-text-primary)] mt-1">{activeZoneData.action}</div>
                    </div>
                  </div>

                  <h3 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-3">Key Pollutants</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-lg p-4 flex justify-between items-center">
                      <div className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">PM2.5</div>
                      <div className="text-[14px] font-bold text-[var(--color-gov-text-secondary)]">{activeZoneData.pm25}</div>
                    </div>
                    <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-lg p-4 flex justify-between items-center">
                      <div className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">PM10</div>
                      <div className="text-[14px] font-bold text-[var(--color-gov-text-secondary)]">{activeZoneData.pm10}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Zone List View
              <>
                <div className="p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]">
                  <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Compliance by Zone</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[var(--color-gov-surface)] border-b border-[var(--color-gov-border)] z-10">
                      <tr>
                        <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider">Zone</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider">AQI Status</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider">Compliance</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-gov-border)] bg-[var(--color-gov-card)]">
                      {zoneCompliance.map((row) => (
                        <tr 
                          key={row.id} 
                          onClick={() => navigate(`/government/compliance?zone=${row.id}`)}
                          className="hover:bg-[var(--color-gov-surface)] transition-colors cursor-pointer group"
                        >
                          <td className="px-4 py-4 text-[13px] font-bold text-[var(--color-gov-text-primary)] group-hover:text-[var(--color-gov-brand)] transition-colors">{row.zone}</td>
                          <td className="px-4 py-4 text-[13px] text-[var(--color-gov-text-secondary)]">{row.aqiStatus}</td>
                          <td className="px-4 py-4">
                            {row.compliance === 'Compliant' ? (
                              <span className="flex items-center gap-1.5 w-max text-[12px] font-bold text-[var(--color-gov-success)]">
                                <CheckCircle2 className="w-4 h-4" /> Compliant
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 w-max text-[12px] font-bold text-[var(--color-gov-warning)]">
                                <AlertTriangle className="w-4 h-4" /> Review
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                             <ArrowRight className="w-4 h-4 text-[var(--color-gov-text-muted)] inline-block group-hover:text-[var(--color-gov-brand)] transition-colors" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Compliance Trend Chart */}
          <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-5 flex flex-col shrink-0 h-[220px]">
            <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-6">Compliance Trend (Monthly Score)</h2>
            <div className="flex-1 flex items-end justify-around gap-2 px-6 mt-auto">
              {trendData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-full max-w-[60px] group cursor-default">
                  {/* Bar container */}
                  <div className="w-full relative flex items-end justify-center h-[100px] bg-[var(--color-gov-surface)] rounded-t overflow-hidden">
                    <div 
                      className="w-full bg-[var(--color-gov-brand)] rounded-t transition-all group-hover:opacity-80"
                      style={{ height: `${d.score}%` }}
                    ></div>
                    {/* Tooltip */}
                    <span className="absolute -top-7 text-[11px] font-bold text-[var(--color-gov-text-primary)] bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.score}%
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-6 min-h-0 overflow-y-auto pr-1 pb-1">
          
          {/* AI Compliance Summary */}
          <div className="bg-gradient-to-br from-[var(--color-gov-brand-surface)] to-[var(--color-gov-surface)] border border-[var(--color-gov-brand)]/30 rounded-xl p-5 shadow-sm shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[var(--color-gov-brand)]" />
              <h2 className="text-[14px] font-bold text-[var(--color-gov-brand)] uppercase tracking-wider">AI Compliance Summary</h2>
            </div>
            <div className="text-[13px] text-[var(--color-gov-text-primary)] leading-relaxed">
              Overall compliance remains strong, with <strong>18 of 20 zones</strong> meeting current standards. Industrial West requires additional monitoring after repeated PM2.5 exceedances. A monthly compliance report is due tomorrow.
            </div>
          </div>

          {/* Standards Overview */}
          <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm flex flex-col shrink-0">
            <div className="p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]">
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Standards Overview</h2>
            </div>
            <div className="flex flex-col divide-y divide-[var(--color-gov-border)]">
              {standards.map((s, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-[var(--color-gov-surface)] transition-colors">
                  <span className="text-[13px] font-bold text-[var(--color-gov-text-primary)]">{s.standard}</span>
                  {s.status === 'Meeting' ? (
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-gov-success)] bg-[var(--color-gov-success)]/10 px-2.5 py-1 rounded">
                      <Check className="w-3.5 h-3.5" /> Meeting
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-gov-warning)] bg-[var(--color-gov-warning)]/10 px-2.5 py-1 rounded">
                      <AlertTriangle className="w-3.5 h-3.5" /> Exceeded
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Government Actions */}
          <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm flex flex-col shrink-0 flex-1 min-h-0">
            <div className="p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]">
              <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Required Regulatory Actions</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="p-4 border border-[var(--color-gov-border)] rounded-xl hover:border-[var(--color-gov-brand)]/50 transition-colors flex flex-col gap-3 bg-[var(--color-gov-surface)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[13px] font-bold text-[var(--color-gov-text-primary)] leading-tight">{action.title}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                      action.priority === 'High' ? 'bg-[var(--color-gov-critical)]/10 text-[var(--color-gov-critical)]' :
                      action.priority === 'Medium' ? 'bg-[var(--color-gov-warning)]/10 text-[var(--color-gov-warning)]' :
                      'bg-[var(--color-gov-brand)]/10 text-[var(--color-gov-brand)]'
                    }`}>
                      {action.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">{action.source}</span>
                    <button 
                      onClick={(e) => confirmApprove(e, action.id)}
                      className="px-4 py-1.5 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white text-[11px] font-bold rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              {pendingActions.length === 0 && (
                <div className="text-center py-6 text-[13px] text-[var(--color-gov-text-muted)] font-medium">
                  No pending actions.
                </div>
              )}

              {/* Audit Trail (Completed Actions) */}
              {completedActions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--color-gov-border)] border-dashed">
                  <h3 className="text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider mb-3">Recently Completed (Audit Trail)</h3>
                  <div className="flex flex-col gap-2 opacity-60 hover:opacity-100 transition-opacity">
                    {completedActions.map(action => (
                      <div key={action.id} className="flex items-center justify-between p-2 rounded bg-[var(--color-gov-background)] border border-[var(--color-gov-border)]">
                        <span className="text-[12px] font-medium text-[var(--color-gov-text-secondary)] line-clamp-1">{action.title}</span>
                        <span className="text-[10px] font-bold text-[var(--color-gov-success)] flex items-center gap-1 shrink-0"><CheckCircle2 className="w-3 h-3" /> Approved</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <ConfirmationDialog 
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Regulatory Action"
        message="Are you sure you want to approve this action? This will be recorded in the official audit trail."
        confirmText="Approve Action"
        type="info"
      />

    </div>
  );
}
