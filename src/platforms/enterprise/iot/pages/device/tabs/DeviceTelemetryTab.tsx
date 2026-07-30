import { useState } from 'react';
import { LineChart, AreaChart } from '../../../../../../shared/runtime/chart';
import { Activity, Thermometer, Droplets, CloudRain } from 'lucide-react';

const mockTelemetryData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  pm25: 12 + Math.random() * 8 + (i > 14 && i < 17 ? 15 : 0), // Spike between 3-5 PM
  aqi: 40 + Math.random() * 15 + (i > 14 && i < 17 ? 30 : 0),
  temp: 20 + Math.sin(i / 4) * 5 + Math.random(),
  humidity: 45 + Math.cos(i / 4) * 20 + Math.random() * 5,
}));

export function DeviceTelemetryTab() {
  const [timeRange, setTimeRange] = useState('24H');

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[var(--color-iot-text-primary)]">Telemetry Data</h2>
        <div className="flex items-center gap-2 p-1 bg-[var(--color-iot-surface)] border border-[var(--color-iot-border)] rounded-md">
          {['1H', '24H', '7D', '30D'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${
                timeRange === range 
                  ? 'bg-white text-[var(--color-iot-brand)] shadow-sm' 
                  : 'text-[var(--color-iot-text-secondary)] hover:text-[var(--color-iot-text-primary)]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PM2.5 Chart */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> PM2.5 Levels
            </h3>
            <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">Avg: 14.2 µg/m³</span>
          </div>
          <AreaChart 
            data={mockTelemetryData} 
            xKey="time" 
            height={250}
            series={[
              { key: 'pm25', name: 'PM2.5', color: 'var(--color-iot-brand)' }
            ]}
          />
        </div>

        {/* AQI Chart */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Air Quality Index (AQI)
            </h3>
            <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">Avg: 45 Index</span>
          </div>
          <LineChart 
            data={mockTelemetryData} 
            xKey="time" 
            height={250}
            series={[
              { key: 'aqi', name: 'AQI', color: 'var(--color-iot-blue)' }
            ]}
          />
        </div>

        {/* Temperature Chart */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Temperature
            </h3>
            <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">Range: 18-25 °C</span>
          </div>
          <LineChart 
            data={mockTelemetryData} 
            xKey="time" 
            height={250}
            series={[
              { key: 'temp', name: 'Temperature', color: 'var(--color-iot-warning)' }
            ]}
          />
        </div>

        {/* Humidity Chart */}
        <div className="bg-[var(--color-iot-card)] rounded-lg border border-[var(--color-iot-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold text-[var(--color-iot-text-primary)] flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[var(--color-iot-text-muted)]" /> Humidity
            </h3>
            <span className="text-[12px] font-mono text-[var(--color-iot-text-secondary)]">Range: 25-68 %</span>
          </div>
          <AreaChart 
            data={mockTelemetryData} 
            xKey="time" 
            height={250}
            series={[
              { key: 'humidity', name: 'Humidity', color: '#10B981' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
