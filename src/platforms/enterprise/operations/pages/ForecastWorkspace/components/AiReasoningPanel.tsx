import React from 'react';
import { aiReasoning } from '../mockData';
import { Brain, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AiReasoningPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Reasoning Text */}
      <div className="lg:col-span-2 bg-gradient-to-br from-[#1A2744] to-[#0E1524] p-6 rounded-xl border border-[var(--color-ops-brand)]/30 shadow-sm flex flex-col relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-ops-brand)] rounded-full mix-blend-screen opacity-10 blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-ops-brand)]/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-[var(--color-ops-brand)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-0.5">AI Forecast Reasoning</h3>
            <p className="text-sm text-[var(--color-ops-brand)] font-medium">Why is this happening?</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Primary Cause</span>
            <span className="text-slate-200 text-sm font-medium">{aiReasoning.primaryCause}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Secondary Cause</span>
            <span className="text-slate-200 text-sm font-medium">{aiReasoning.secondaryCause}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Expected Change</span>
            <span className="text-slate-200 text-sm font-medium">{aiReasoning.expectedChange}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Model Impact</span>
            <span className="text-slate-200 text-sm font-medium">{aiReasoning.modelImpact}</span>
          </div>
          <div className="col-span-2 flex flex-col mt-2 pt-4 border-t border-[var(--color-ops-brand)]/20">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Confidence</span>
            <span className="text-2xl font-bold text-white">{aiReasoning.confidenceValue}%</span>
          </div>
        </div>

        {/* Prediction Factors */}
        <div className="mt-auto relative z-10">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Primary Contributing Factors</h4>
          <div className="flex flex-wrap gap-2">
            {aiReasoning.factors.map((factor, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: factor.color }}></div>
                <span className="text-sm font-medium text-white">{factor.name}</span>
                <span className="text-sm font-bold" style={{ color: factor.color }}>{factor.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Metrics */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Model Confidence</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Model accuracy metrics</p>
        
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">Last Updated</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{aiReasoning.lastUpdated}</span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-ops-brand)] mb-1">Next Refresh</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{aiReasoning.nextRefresh}</span>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Weather Model</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{aiReasoning.confidence.weatherModel}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sensor Coverage</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{aiReasoning.confidence.sensorCoverage}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Historical Accuracy</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{aiReasoning.confidence.historicalAccuracy}%</span>
          </div>
        </div>

        {/* Missing Data Explanation */}
        <div className="mt-6 p-4 rounded-lg bg-[var(--color-ops-warning)]/10 border border-[var(--color-ops-warning)]/20 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--color-ops-warning)] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Missing Sensors ({aiReasoning.confidence.missingSensors}%)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Two industrial sensors are currently offline. The model is interpolating data using historical baselines and neighboring nodes, slightly reducing local confidence in the Industrial West zone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
