import React from 'react';
import { scenarioComparisons } from '../mockData';
import { LayoutTemplate, CloudRain, Factory, Car } from 'lucide-react';

export function ScenarioComparison() {
  const getIcon = (name: string, color: string) => {
    if (name.includes('Rain')) return <CloudRain className="w-5 h-5" style={{ color }} />;
    if (name.includes('Industrial')) return <Factory className="w-5 h-5" style={{ color }} />;
    if (name.includes('Traffic')) return <Car className="w-5 h-5" style={{ color }} />;
    return <LayoutTemplate className="w-5 h-5" style={{ color }} />;
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-xl border border-slate-200 dark:border-[#38383A] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Scenario Comparison</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Evaluate impact of different operational and environmental conditions on AQI</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scenarioComparisons.map((scenario, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-xl border transition-all ${
              scenario.selected 
                ? 'border-[var(--color-ops-brand)] bg-[var(--color-ops-brand)]/5 shadow-sm' 
                : 'border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#2C2E33]/30 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1C1C1E] flex items-center justify-center shadow-sm">
                {getIcon(scenario.name, scenario.color)}
              </div>
              <span className={`text-sm font-semibold flex-1 leading-tight ${scenario.selected ? 'text-[var(--color-ops-brand)]' : 'text-slate-700 dark:text-slate-200'}`}>
                {scenario.name}
              </span>
            </div>
            
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {scenario.aqi}
              </span>
              {scenario.delta && (
                <span className="text-sm font-bold mb-1" style={{ color: scenario.color }}>
                  ({scenario.delta})
                </span>
              )}
              {!scenario.delta && (
                <span className="text-xs font-bold uppercase mb-1 text-slate-400">
                  Predicted
                </span>
              )}
            </div>
            
            {scenario.selected && (
              <div className="mt-3 text-[10px] uppercase font-bold text-[var(--color-ops-brand)] tracking-wider flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ops-brand)] animate-pulse"></div>
                Active Prediction
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
