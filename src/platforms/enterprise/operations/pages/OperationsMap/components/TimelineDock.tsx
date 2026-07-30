import React from 'react';
import type { TimelineEvent } from '../types';
import { Play, Pause } from 'lucide-react';

interface TimelineDockProps {
  events: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

export function TimelineDock({ events, onEventClick }: TimelineDockProps) {
  return (
    <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur border border-slate-200 dark:border-[#38383A] rounded-xl px-4 py-3 flex items-center gap-4">
      
      <button className="flex-shrink-0 w-10 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-[#2C2C2E] dark:hover:bg-[#38383A] text-slate-700 dark:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
        <Play className="w-4 h-4 ml-0.5" />
      </button>

      <div className="flex-1 overflow-x-auto no-scrollbar relative flex items-center h-12">
        {/* Timeline track line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 dark:bg-[#38383A] -translate-y-1/2" />
        
        {/* Playhead indicator (mocked) */}
        <div className="absolute top-1/2 left-1/3 w-[2px] h-full bg-[#0A84FF] -translate-y-1/2 z-10 shadow-[0_0_10px_rgba(10,132,255,0.8)]" />

        <div className="flex items-center gap-8 px-4 relative z-0 min-w-max">
          {events.map((event, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => onEventClick(event)}
            >
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute -top-4">
                {event.time}
              </div>
              
              <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-[#1C1C1E] z-10 transition-transform group-hover:scale-150 ${
                event.type === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' :
                event.type === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]' :
                'bg-[#0A84FF]'
              }`} />
              
              <div className="text-[10px] font-bold text-slate-900 dark:text-white mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute -bottom-4">
                {event.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
