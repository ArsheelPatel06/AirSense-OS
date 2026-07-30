import React from 'react';
import { Cloud, Droplets, Wind, Thermometer, Compass, Eye } from 'lucide-react';
import { MOCK_WEATHER } from '../mockData';

export function WeatherCorrelation() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Weather Correlation</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-[#25262B] rounded-lg text-slate-500">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Wind</div>
            <div className="text-sm font-bold">{MOCK_WEATHER.windSpeed} km/h</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-[#25262B] rounded-lg text-slate-500">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Direction</div>
            <div className="text-sm font-bold">{MOCK_WEATHER.windDirection}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-[#25262B] rounded-lg text-slate-500">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Humidity</div>
            <div className="text-sm font-bold">{MOCK_WEATHER.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-[#25262B] rounded-lg text-slate-500">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Temp</div>
            <div className="text-sm font-bold">{MOCK_WEATHER.temp}°C</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-[#25262B] rounded-lg text-slate-500">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Rain</div>
            <div className="text-sm font-bold">{MOCK_WEATHER.rain} mm</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 dark:bg-[#25262B] rounded-lg text-slate-500">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Visibility</div>
            <div className="text-sm font-bold">{MOCK_WEATHER.visibility} km</div>
          </div>
        </div>

      </div>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-[#25262B] rounded-lg border border-slate-100 dark:border-[#38383A]">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-white block mb-1">Why did AQI change?</strong>
          Low wind speed and high humidity during the early morning hours created conditions where pollutants were not dispersed efficiently.
        </p>
      </div>

    </div>
  );
}
