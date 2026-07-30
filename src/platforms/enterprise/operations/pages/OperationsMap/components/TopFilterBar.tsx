import React, { useState } from 'react';
import { Factory, HardHat, Car, Flame, Search } from 'lucide-react';

const FILTERS = [
  { id: 'industrial', label: 'Industrial', icon: Factory, color: 'text-amber-500' },
  { id: 'construction', label: 'Construction', icon: HardHat, color: 'text-yellow-600' },
  { id: 'traffic', label: 'Traffic', icon: Car, color: 'text-red-500' },
  { id: 'biomass', label: 'Biomass', icon: Flame, color: 'text-orange-500' }
];

export function TopFilterBar() {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['industrial', 'traffic', 'biomass']));

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="absolute top-4 left-4 z-40 pointer-events-auto flex items-center gap-2 max-w-[calc(100vw-400px)] overflow-x-auto custom-scrollbar pb-2">
      {FILTERS.map(filter => {
        const isActive = activeFilters.has(filter.id);
        const Icon = filter.icon;
        
        return (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${
              isActive 
                ? 'bg-slate-800 border-slate-600 text-white shadow-md' 
                : 'bg-white/90 dark:bg-[#1C1C1E]/80 border-slate-200 dark:border-[#38383A] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2C2C2E]'
            } backdrop-blur`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? filter.color : 'text-slate-500'}`} />
            {filter.label}
          </button>
        );
      })}

      <div className="flex items-center gap-2 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur border border-slate-200 dark:border-[#38383A] rounded-full shadow-md px-3 py-1.5 w-64 ml-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input 
          type="text" 
          placeholder="Search locations, factories, teams..." 
          className="bg-transparent border-none text-slate-900 dark:text-white text-xs font-medium outline-none w-full placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
