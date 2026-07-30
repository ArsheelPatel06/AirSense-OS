import { 
  Activity, AlertTriangle, CheckCircle2, ChevronRight, Clock, 
  FileText, Map, MessageSquare, ShieldCheck, Sparkles, TrendingUp, Users, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGovStore } from '../../context/GovContext';

export function ExecutiveDashboard() {
  const navigate = useNavigate();
  const { state, approveAction, showToast } = useGovStore();

  const activeAdvisories = state.advisories.filter(a => a.status === 'Sent' || a.status === 'Scheduled').length;
  const pendingApprovals = state.pendingActions.length;
  
  const latestSentAdvisory = state.advisories.find(a => a.status === 'Sent');

  const kpis = [
    { title: 'City AQI', value: '86', subtext: 'Moderate', icon: Activity, color: 'text-[var(--color-gov-warning)]', route: '/government/compliance?view=overview' },
    { title: 'Worst Performing', value: 'Ind. West', subtext: 'AQI 162', icon: AlertTriangle, color: 'text-[var(--color-gov-critical)]', route: '/government/compliance?zone=industrial-west' },
    { title: 'Exposed (Poor+)', value: '145K', subtext: 'High AQI Areas', icon: Users, color: 'text-[var(--color-gov-warning)]', route: '/government/compliance?filter=high-risk' },
    { title: 'Active Advisories', value: activeAdvisories.toString(), subtext: 'Currently Active', icon: FileText, color: 'text-[var(--color-gov-text-primary)]', route: '/government/communication?tab=sent' },
    { title: 'Compliance Status', value: '98%', subtext: 'Within CPCB Limits', icon: ShieldCheck, color: 'text-[var(--color-gov-success)]', route: '/government/compliance?section=score' },
    { title: 'Pending Approvals', value: pendingApprovals.toString(), subtext: 'Require Review', icon: Clock, color: 'text-[var(--color-gov-brand)]', route: '/government/communication?tab=drafts' },
  ];

  const handleApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent row click navigation
    approveAction(id);
    showToast('Action Approved', 'success');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full h-full flex flex-col gap-4 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-gov-text-primary)]">Executive Dashboard</h1>
        </div>
        <div className="text-[13px] text-[var(--color-gov-text-secondary)] font-medium flex items-center gap-2 bg-[var(--color-gov-surface)] px-3 py-1.5 rounded-lg border border-[var(--color-gov-border)]">
          <Clock className="w-4 h-4" /> Last Updated: Today, 09:42 AM
        </div>
      </div>

      {/* City Status (Hero Section) */}
      <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl p-6 shadow-sm">
        <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-4">City Status</h2>
        <div className="flex flex-wrap items-center gap-8 md:gap-16">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-[var(--color-gov-text-primary)]">86</span>
            <span className="text-[14px] font-bold text-[var(--color-gov-text-secondary)]">AQI</span>
          </div>
          
          <div className="flex flex-col gap-1 border-l border-[var(--color-gov-border)] pl-8">
            <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">Status</span>
            <span className="text-[16px] font-bold text-[var(--color-gov-success)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> GOOD
            </span>
          </div>
          
          <div className="flex flex-col gap-1 border-l border-[var(--color-gov-border)] pl-8">
            <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">Trend</span>
            <span className="text-[16px] font-bold text-[var(--color-gov-success)] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 rotate-180" /> Improving
            </span>
          </div>
          
          <div className="flex flex-col gap-1 border-l border-[var(--color-gov-border)] pl-8">
            <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">Emergency Level</span>
            <span className="text-[16px] font-bold text-[var(--color-gov-text-primary)]">None</span>
          </div>
          
          <div className="flex flex-col gap-1 border-l border-[var(--color-gov-border)] pl-8">
            <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase">Public Advisory</span>
            <span className="text-[16px] font-bold text-[var(--color-gov-text-primary)]">Not Required</span>
          </div>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => navigate(kpi.route)}
            className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl p-4 shadow-sm flex flex-col hover:border-[var(--color-gov-brand)] hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider line-clamp-1 group-hover:text-[var(--color-gov-brand)] transition-colors">{kpi.title}</span>
            </div>
            <div className="text-2xl font-bold text-[var(--color-gov-text-primary)]">{kpi.value}</div>
            <div className="text-[11px] mt-1 font-medium text-[var(--color-gov-text-muted)] line-clamp-1">{kpi.subtext}</div>
          </div>
        ))}
      </div>

      {/* AI Executive Brief */}
      <div 
        onClick={() => navigate('/government/reports?report=latest-executive')}
        className="bg-gradient-to-br from-[var(--color-gov-brand-surface)] to-[var(--color-gov-surface)] border border-[var(--color-gov-brand)]/30 rounded-xl p-6 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-[var(--color-gov-brand)] cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-gov-brand)]" />
          <h2 className="text-[13px] font-bold text-[var(--color-gov-brand)] uppercase tracking-wider">AI Executive Brief</h2>
        </div>
        <div className="text-[16px] font-medium text-[var(--color-gov-text-primary)] leading-relaxed max-w-4xl">
          "City air quality remains stable with an average AQI of 86. Industrial West continues to report elevated PM2.5 levels, but no emergency response is currently required. Operations recommends issuing a precautionary advisory for outdoor workers tomorrow morning if forecast conditions persist."
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-[12px] font-bold text-[var(--color-gov-text-secondary)] flex items-center gap-1.5">
            Confidence: <span className="text-[var(--color-gov-brand)] bg-[var(--color-gov-brand-surface)] px-2 py-0.5 rounded border border-[var(--color-gov-brand)]/20">94%</span>
          </div>
          <div className="text-[13px] font-bold text-[var(--color-gov-brand)] flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            View Report <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Pending Government Actions */}
        <div className="lg:col-span-2 bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-[var(--color-gov-border)] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Pending Government Actions</h2>
          </div>
          <div className="flex-1 overflow-x-auto p-2">
            {state.pendingActions.length > 0 ? (
              <div className="flex flex-col gap-1">
                {state.pendingActions.map((action) => (
                  <div 
                    key={action.id}
                    onClick={() => navigate(action.route)}
                    className="flex items-center justify-between p-3 hover:bg-[var(--color-gov-surface)] rounded-lg transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[var(--color-gov-text-primary)] group-hover:text-[var(--color-gov-brand)] transition-colors">{action.request}</span>
                        <span className="text-[11px] text-[var(--color-gov-text-secondary)]">From {action.from}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${action.priority === 'High' ? 'bg-[var(--color-gov-critical)]/10 text-[var(--color-gov-critical)]' : 'bg-[var(--color-gov-warning)]/10 text-[var(--color-gov-warning)]'}`}>
                        {action.priority}
                      </span>
                      <button
                        onClick={(e) => handleApprove(e, action.id)}
                        className="px-3 py-1.5 text-[12px] font-bold text-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand)] hover:text-white border border-[var(--color-gov-brand)] rounded-md transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-[13px] text-[var(--color-gov-text-secondary)] font-medium gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-gov-success)]" /> No approvals pending
              </div>
            )}
            
            {/* Completed Actions Audit Trail */}
            {state.completedActions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--color-gov-border)] border-dashed">
                <h3 className="text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider mb-2 px-2">Recently Completed</h3>
                <div className="flex flex-col gap-1 opacity-75">
                  {state.completedActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-2 px-3 rounded-lg bg-[var(--color-gov-surface)]">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-[var(--color-gov-text-secondary)] line-through decoration-[var(--color-gov-text-muted)]">{action.request}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[var(--color-gov-success)] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Citizen Communication Status */}
        <div className="lg:col-span-1 bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-4">Citizen Communication</h2>
            
            {latestSentAdvisory ? (
              <div 
                onClick={() => navigate('/government/communication?advisory=latest')}
                className="bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg p-4 hover:border-[var(--color-gov-brand)] cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block">Latest Advisory</span>
                  <ChevronRight className="w-4 h-4 text-[var(--color-gov-text-muted)] group-hover:text-[var(--color-gov-brand)] transition-colors" />
                </div>
                <div className="text-[14px] font-bold text-[var(--color-gov-text-primary)] group-hover:text-[var(--color-gov-brand)] transition-colors mb-4">{latestSentAdvisory.title}</div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--color-gov-text-secondary)]">Sent</span>
                    <span className="font-semibold text-[var(--color-gov-text-primary)]">{latestSentAdvisory.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--color-gov-text-secondary)]">Recipients</span>
                    <span className="font-semibold text-[var(--color-gov-text-primary)]">{latestSentAdvisory.recipients || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--color-gov-text-secondary)]">Delivery</span>
                    <span className="font-bold text-[var(--color-gov-success)]">{latestSentAdvisory.delivery || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-8 h-8 text-[var(--color-gov-text-muted)] mb-2" />
                <span className="text-[13px] font-medium text-[var(--color-gov-text-secondary)]">No recent advisories sent</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/government/communication?action=new')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white text-[13px] font-bold shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Create New Advisory
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-4">
        <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/government/communication?action=new')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] hover:border-[var(--color-gov-brand)] hover:shadow-md cursor-pointer transition-all group"
          >
            <MessageSquare className="w-5 h-5 text-[var(--color-gov-text-secondary)] group-hover:text-[var(--color-gov-brand)] transition-colors" />
            <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)] group-hover:text-[var(--color-gov-brand)] transition-colors">Create Advisory</span>
          </button>
          <button 
            onClick={() => navigate('/government/reports?action=generate')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] hover:border-[var(--color-gov-brand)] hover:shadow-md cursor-pointer transition-all group"
          >
            <FileText className="w-5 h-5 text-[var(--color-gov-text-secondary)] group-hover:text-[var(--color-gov-brand)] transition-colors" />
            <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)] group-hover:text-[var(--color-gov-brand)] transition-colors">Generate Report</span>
          </button>
          <button 
            onClick={() => navigate('/government/compliance')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] hover:border-[var(--color-gov-brand)] hover:shadow-md cursor-pointer transition-all group"
          >
            <ShieldCheck className="w-5 h-5 text-[var(--color-gov-text-secondary)] group-hover:text-[var(--color-gov-brand)] transition-colors" />
            <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)] group-hover:text-[var(--color-gov-brand)] transition-colors">Review Compliance</span>
          </button>
          <button 
            onClick={() => navigate('/government/projects')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-gov-border)] bg-[var(--color-gov-surface)] hover:border-[var(--color-gov-brand)] hover:shadow-md cursor-pointer transition-all group"
          >
            <Map className="w-5 h-5 text-[var(--color-gov-text-secondary)] group-hover:text-[var(--color-gov-brand)] transition-colors" />
            <span className="text-[12px] font-bold text-[var(--color-gov-text-primary)] group-hover:text-[var(--color-gov-brand)] transition-colors">View Projects</span>
          </button>
        </div>
      </div>

    </div>
  );
}
