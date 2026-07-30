import React from 'react';

interface NavigatorMapProps {
  mapCenter: { x: number; y: number };
}

export function NavigatorMap({ mapCenter }: NavigatorMapProps) {
  // Map mapCenter (0-100) to viewport bounds
  // We want the viewport rectangle to move around the mini-map.
  
  return (
    <div className="w-48 h-32 bg-[#060B14] rounded-lg border border-[#38383A] shadow-xl overflow-hidden relative pointer-events-none">
      {/* Background Mini Map SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M 0 30 Q 20 40 40 20 T 80 40 T 100 20 L 100 0 L 0 0 Z" fill="#3B82F6" />
        <path d="M 20 80 Q 40 70 60 90 T 100 80 L 100 100 L 0 100 L 0 80 Z" fill="#3B82F6" />
        <path d="M 10 40 Q 25 35 30 50 T 15 65 Z" fill="#10B981" />
        <path d="M 70 60 Q 80 50 90 70 T 75 85 Z" fill="#10B981" />
        <path d="M 60 20 L 80 15 L 95 30 L 75 45 Z" fill="#64748B" />
        <path d="M 40 40 L 60 40 L 65 60 L 35 60 Z" fill="#64748B" />
      </svg>
      
      {/* Viewport Box */}
      <div 
        className="absolute border-2 border-[#0A84FF] bg-[#0A84FF]/20 shadow-[0_0_10px_rgba(10,132,255,0.4)] transition-all duration-300" 
        style={{ 
          width: '40%', height: '40%',
          top: `${mapCenter.y}%`, left: `${mapCenter.x}%`, 
          transform: 'translate(-50%, -50%)' 
        }} 
      />
    </div>
  );
}
