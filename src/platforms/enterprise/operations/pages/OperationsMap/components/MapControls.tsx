import React from 'react';
import { Plus, Minus, Compass, MapPin, Maximize, Layers, Move } from 'lucide-react';

interface MapControlsProps {
  onAction?: (action: string) => void;
  isLayerManagerOpen?: boolean;
}

export function MapControls({ onAction, isLayerManagerOpen }: MapControlsProps) {
  const controls = [
    { icon: Plus, label: 'Zoom In', id: 'zoom-in' },
    { icon: Minus, label: 'Zoom Out', id: 'zoom-out' },
    { icon: Move, label: 'Pan', id: 'pan' },
    { icon: Compass, label: 'Reset Bearing', id: 'reset' },
    { icon: MapPin, label: 'My Location', id: 'location' },
    { icon: Maximize, label: 'Fullscreen', id: 'fullscreen' },
    { icon: Layers, label: 'Manage Layers', id: 'layers', active: isLayerManagerOpen },
  ];

  return (
    <div className="flex flex-col gap-2">
      {controls.map((ctrl, i) => (
        <button 
          key={i}
          onClick={() => onAction?.(ctrl.id)}
          className={`w-10 h-10 backdrop-blur border rounded-md shadow-lg flex items-center justify-center transition-colors
            ${ctrl.active 
              ? 'bg-[#0A84FF]/10 border-[#0A84FF]/30 text-[#0A84FF]' 
              : 'bg-white/90 dark:bg-[#1C1C1E]/90 border-slate-200 dark:border-[#38383A] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2C2C2E]'}
          `}
          title={ctrl.label}
        >
          <ctrl.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
}
