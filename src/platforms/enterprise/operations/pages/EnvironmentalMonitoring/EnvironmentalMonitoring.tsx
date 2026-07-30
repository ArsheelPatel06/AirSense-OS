import React from 'react';
import { PollutantOverview } from './components/PollutantOverview';
import { RegionalComparison } from './components/RegionalComparison';
import { TrendAnalysis } from './components/TrendAnalysis';
import { WeatherCorrelation } from './components/WeatherCorrelation';
import { PollutionSources } from './components/PollutionSources';
import { AiAnalysis } from './components/AiAnalysis';
import { RegionalMap } from './components/RegionalMap';
import { EnvironmentalKPIs } from './components/EnvironmentalKPIs';
import { ThresholdViolations } from './components/ThresholdViolations';
import { HistoricalComparison } from './components/HistoricalComparison';
import { EnvironmentalDataQuality } from './components/EnvironmentalDataQuality';
import { EnvironmentalConfidence } from './components/EnvironmentalConfidence';
import { AirQualityStandards } from './components/AirQualityStandards';
export function EnvironmentalMonitoring() {
  return (
    <div className="h-full w-full bg-slate-50 dark:bg-[#0E0F12] text-slate-900 dark:text-white p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Environmental Monitoring</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific analysis and environmental telemetry.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2C2E33] rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2C2E33] transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* High-Level KPIs */}
        <EnvironmentalKPIs />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (Main Charts & Tables) */}
          <div className="lg:col-span-8 space-y-6">
            <PollutantOverview />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrendAnalysis />
              <RegionalComparison />
            </div>

            <ThresholdViolations />
          </div>

          {/* Right Column (Side Panels & Context) */}
          <div className="lg:col-span-4 space-y-6">
            <AiAnalysis />
            <RegionalMap />
            <WeatherCorrelation />
            <PollutionSources />
            <HistoricalComparison />
            <EnvironmentalDataQuality />
            <EnvironmentalConfidence />
            <AirQualityStandards />
          </div>

        </div>
      </div>
    </div>
  );
}
