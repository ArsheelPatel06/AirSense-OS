import React from 'react';
import { PredictionSummary } from './components/PredictionSummary';
import { AqiForecastChart } from './components/AqiForecastChart';
import { GranularForecasts } from './components/GranularForecasts';
import { PredictionTimeline } from './components/PredictionTimeline';
import { ActionCenter } from './components/ActionCenter';
import { ScenarioComparison } from './components/ScenarioComparison';
import { AiReasoningPanel } from './components/AiReasoningPanel';

export function ForecastWorkspace() {
  return (
    <div className="h-full w-full bg-slate-50 dark:bg-[#0E0F12] text-slate-900 dark:text-white p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Forecast & Prediction</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Future-oriented environmental intelligence and decision support.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2C2E33] rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2C2E33] transition-colors">
              Export Forecast
            </button>
            <button className="px-4 py-2 bg-[var(--color-ops-brand)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
              Run New Simulation
            </button>
          </div>
        </div>

        {/* Top: Prediction Summary */}
        <PredictionSummary />

        {/* Main: AQI Forecast Chart */}
        <AqiForecastChart />

        {/* Row 3: Granular Forecasts (Pollutants, Weather, Dispersion) */}
        <GranularForecasts />

        {/* Row 4: Timeline */}
        <PredictionTimeline />

        {/* Row 5: Actions (Risk Zones & Recommendations) */}
        <ActionCenter />

        {/* Row 6: Scenario Comparison */}
        <ScenarioComparison />

        {/* Row 7: AI Reasoning & Confidence */}
        <AiReasoningPanel />

      </div>
    </div>
  );
}
