import React, { useState } from 'react';
import { Layers, MousePointer2, Move, Ruler, Hexagon, Image as ImageIcon, Download, Share2, Megaphone, Users, CloudRain } from 'lucide-react';

interface MapToolbarProps {
  onToggleLayers: () => void;
  isLayerManagerOpen: boolean;
}

export function MapToolbar({ onToggleLayers, isLayerManagerOpen }: MapToolbarProps) {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="flex bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur border border-slate-200 dark:border-[#38383A] rounded-xl shadow-2xl overflow-hidden text-sm">
      
      <div className="flex divide-x divide-slate-200 dark:divide-[#38383A]">
        
        {/* Navigation Group */}
        <div className="flex items-center gap-1 p-1">
          <ToolButton icon={MousePointer2} label="Select" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
          <ToolButton icon={Move} label="Pan" active={activeTool === 'pan'} onClick={() => setActiveTool('pan')} />
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-1 p-1">
          <ToolButton icon={Megaphone} label="Broadcast Alert" primary onClick={() => alert('Broadcast Alert Mode Activated')} />
          <ToolButton icon={Users} label="Assign Team" active={activeTool === 'assign'} onClick={() => setActiveTool('assign')} />
          <ToolButton icon={CloudRain} label="Weather Forecast" active={activeTool === 'weather'} onClick={() => setActiveTool('weather')} />
        </div>

        {/* Tools Group */}
        <div className="flex items-center gap-1 p-1">
          <ToolButton icon={Ruler} label="Measure" active={activeTool === 'measure'} onClick={() => setActiveTool('measure')} />
          <ToolButton icon={Hexagon} label="Draw Area" active={activeTool === 'draw'} onClick={() => setActiveTool('draw')} />
          <ToolButton icon={ImageIcon} label="Snapshot" onClick={() => alert('Snapshot Saved')} />
          <ToolButton icon={Download} label="Export Map" onClick={() => alert('Exporting Map...')} />
          <ToolButton icon={Share2} label="Share Location" onClick={() => alert('Share Link Copied!')} />
        </div>

        {/* Layer Group */}
        <div className="flex items-center p-1 bg-slate-50 dark:bg-[#2C2C2E]/30">
          <button 
            onClick={onToggleLayers}
            title="Manage Layers"
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${isLayerManagerOpen ? 'bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#38383A] border border-transparent'}`}
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, label, active = false, primary = false, onClick }: { icon: any, label: string, active?: boolean, primary?: boolean, onClick?: () => void }) {
  return (
    <button 
      title={label}
      onClick={onClick}
      className={`flex items-center justify-center p-2 rounded-lg transition-all 
        ${active ? 'bg-slate-200 dark:bg-[#38383A] text-slate-900 dark:text-white shadow-inner' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#38383A]/50'}
        ${primary ? 'text-[#0A84FF] hover:text-[#5E5CE6]' : ''}
      `}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
