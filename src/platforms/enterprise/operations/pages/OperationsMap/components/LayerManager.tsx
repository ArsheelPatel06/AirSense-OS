import React from 'react';
import type { Layer, LayerCategory } from '../types';
import { X, Layers as LayersIcon, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface LayerManagerProps {
  layers: Layer[];
  onToggleLayer: (id: string) => void;
  onClose: () => void;
}

export function LayerManager({ layers, onToggleLayer, onClose }: LayerManagerProps) {
  
  // Group layers by category
  const groupedLayers = layers.reduce((acc, layer) => {
    if (!acc[layer.category]) acc[layer.category] = [];
    acc[layer.category].push(layer);
    return acc;
  }, {} as Record<string, Layer[]>);

  const categories: LayerCategory[] = ['Environmental', 'Weather', 'Operations', 'Infrastructure'];

  return (
    <div className="w-80 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur border border-slate-200 dark:border-[#38383A] rounded-xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-[#38383A] bg-slate-50 dark:bg-[#2C2C2E]/50">
        <h3 className="text-[12px] font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-wide uppercase">
          <LayersIcon className="w-4 h-4 text-[#0A84FF]" /> Layer Manager
        </h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-black/20">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer List */}
      <div className="p-3 flex flex-col gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {categories.map(category => (
          <div key={category} className="flex flex-col gap-1">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 mb-1">{category}</h4>
            <div className="flex flex-col bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-lg overflow-hidden">
              {groupedLayers[category]?.map((layer, idx) => (
                <div 
                  key={layer.id} 
                  className={`flex items-center justify-between p-2.5 hover:bg-slate-100 dark:hover:bg-[#38383A] transition-colors cursor-pointer ${idx !== 0 ? 'border-t border-slate-200 dark:border-[#38383A]/50' : ''}`}
                  onClick={() => onToggleLayer(layer.id)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full border ${layer.active ? 'border-transparent shadow-[0_0_8px_currentColor]' : 'border-slate-300 dark:border-slate-500 bg-transparent shadow-none'}`} 
                      style={{ backgroundColor: layer.active ? layer.color : 'transparent', color: layer.color }} 
                    />
                    <span className={`text-xs font-medium ${layer.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {layer.label}
                    </span>
                  </div>
                  <button className={`p-1 rounded-md ${layer.active ? 'text-[#0A84FF]' : 'text-slate-400 dark:text-slate-600'}`}>
                    {layer.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
