import { useState } from 'react';
import { Users, Truck, Radio, Layers, ChevronDown, ChevronRight } from 'lucide-react';

interface ResourceDirectoryProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

const STATUS_FILTERS = ['All', 'Available', 'Assigned', 'En Route', 'On Site', 'Returning', 'Maintenance', 'Offline'];

const DIRECTORY = [
  {
    section: 'Personnel',
    icon: Users,
    items: ['All Personnel', 'Hazmat', 'Traffic', 'Environmental', 'Command', 'Medical']
  },
  {
    section: 'Vehicles',
    icon: Truck,
    items: ['All Vehicles', 'Command Vans', 'Mobile Labs', 'Sensor Vans']
  },
  {
    section: 'Equipment',
    icon: Radio,
    items: ['All Equipment', 'Portable Sensors', 'Drones', 'Gateways', 'Communications']
  }
];

export function ResourceDirectory({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus
}: ResourceDirectoryProps) {
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Personnel': true,
    'Vehicles': true,
    'Equipment': true
  });

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Top Title */}
      <div className="p-4 border-b border-slate-200 dark:border-[#38383A] shrink-0 bg-slate-50 dark:bg-[#121214]">
        <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--color-ops-brand)]" />
          Resource Directory
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col">
        
        {/* Status Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-[#38383A] shrink-0">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Status</h3>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => onSelectStatus(f)}
                className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors ${
                  selectedStatus === f 
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' 
                    : 'bg-slate-100 dark:bg-[#2C2E33] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#38383A]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Categories */}
        <div className="p-2 space-y-4 flex-1 mt-2">
          {DIRECTORY.map((group, idx) => {
            const isExpanded = expanded[group.section];
            return (
              <div key={idx} className="flex flex-col">
                <button 
                  onClick={() => toggleSection(group.section)}
                  className="px-3 py-2 flex items-center justify-between text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#2C2E33] rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <group.icon className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">{group.section}</h3>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>
                
                {isExpanded && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {group.items.map(item => {
                      const val = item.startsWith('All ') ? group.section : item;
                      return (
                        <button
                          key={item}
                          onClick={() => onSelectCategory(val)}
                          className={`text-left pl-9 pr-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                            selectedCategory === val
                              ? 'bg-[var(--color-ops-brand)]/10 text-[var(--color-ops-brand)]'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2C2E33] hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="mt-4 px-2">
            <button
              onClick={() => onSelectCategory('All')}
              className={`w-full text-left px-3 py-2 text-sm font-bold rounded-lg transition-colors border border-dashed ${
                selectedCategory === 'All'
                  ? 'border-[var(--color-ops-brand)] bg-[var(--color-ops-brand)]/5 text-[var(--color-ops-brand)]'
                  : 'border-slate-300 dark:border-[#38383A] text-slate-500 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Clear Category Filter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
