import { Search, AlertTriangle, AlertCircle, Info, Filter, Cloud, Wind, Zap, Truck, Factory } from 'lucide-react';
import type { SystemAlert, AlertCategory, AlertSource, AlertPriority } from '../mockData';

interface AlertQueueProps {
  alerts: SystemAlert[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  selectedCategory: AlertCategory;
  onSelectCategory: (cat: AlertCategory) => void;
  selectedSource: AlertSource | 'All';
  onSelectSource: (src: AlertSource | 'All') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: AlertCategory[] = ['Active', 'Acknowledged', 'Escalated', 'Closed'];
const SOURCES: (AlertSource | 'All')[] = ['All', 'AQI', 'Weather', 'Sensors', 'Traffic', 'Industrial'];

export function AlertQueue({
  alerts,
  selectedId,
  onSelect,
  selectedCategory,
  onSelectCategory,
  selectedSource,
  onSelectSource,
  searchQuery,
  onSearchChange
}: AlertQueueProps) {

  const getPriorityColor = (priority: AlertPriority) => {
    switch(priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityIcon = (priority: AlertPriority) => {
    switch(priority) {
      case 'Critical': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'High': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Medium': return <Info className="w-3.5 h-3.5" />;
      case 'Low': return <Info className="w-3.5 h-3.5" />;
      default: return <Info className="w-3.5 h-3.5" />;
    }
  };

  const getSourceIcon = (source: AlertSource) => {
    switch(source) {
      case 'AQI': return <Cloud className="w-4 h-4" />;
      case 'Weather': return <Wind className="w-4 h-4" />;
      case 'Sensors': return <Zap className="w-4 h-4" />;
      case 'Traffic': return <Truck className="w-4 h-4" />;
      case 'Industrial': return <Factory className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C1C1E] border-r border-slate-200 dark:border-[#38383A] w-[380px] shrink-0">
      
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#121214]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Notification Queue
            <span className="text-xs font-bold px-2 py-0.5 bg-[var(--color-ops-brand)]/10 text-[var(--color-ops-brand)] rounded-full">
              {alerts.filter(a => a.category === 'Active').length} New
            </span>
          </h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white focus:outline-none focus:border-[var(--color-ops-brand)] transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col border-b border-slate-200 dark:border-[#38383A] bg-white dark:bg-[#1C1C1E]">
        {/* Category Tabs */}
        <div className="flex items-center gap-4 px-4 overflow-x-auto scrollbar-none border-b border-slate-100 dark:border-[#2C2E33]">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`py-3 text-xs font-bold uppercase tracking-wider relative whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'text-[var(--color-ops-brand)]' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {cat}
              {selectedCategory === cat && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ops-brand)] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Source Pills */}
        <div className="flex items-center gap-2 p-3 overflow-x-auto scrollbar-none bg-slate-50 dark:bg-[#121214]">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-2" />
          {SOURCES.map(src => (
            <button
              key={src}
              onClick={() => onSelectSource(src)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                selectedSource === src
                  ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#38383A] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">
            No alerts match your criteria.
          </div>
        ) : (
          <div className="flex flex-col">
            {alerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => onSelect(alert.id)}
                className={`flex flex-col p-4 border-b border-slate-100 dark:border-[#2C2E33] cursor-pointer transition-colors relative ${
                  selectedId === alert.id
                    ? 'bg-blue-50 dark:bg-[#25262B]'
                    : 'hover:bg-slate-50 dark:hover:bg-[#25262B]'
                }`}
              >
                {selectedId === alert.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-ops-brand)]"></div>
                )}
                
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-slate-100 dark:bg-[#2C2E33] text-slate-600 dark:text-slate-400">
                      {getSourceIcon(alert.source)}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{alert.title}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 shrink-0 mt-0.5">{alert.timestamp}</span>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 pr-2">
                  {alert.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(alert.priority)}`}>
                    {getPriorityIcon(alert.priority)} {alert.priority}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-[#2C2E33] px-2 py-0.5 rounded">
                    {alert.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
