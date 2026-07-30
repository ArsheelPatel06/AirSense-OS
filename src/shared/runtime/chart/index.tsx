import React from 'react';
import { 
  LineChart as RechartsLineChart, 
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  Line, 
  Area, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export interface ChartBaseProps {
  data: any[];
  height?: number;
  xKey?: string;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
}

export interface LineChartProps extends ChartBaseProps {
  series: { key: string; name?: string; color?: string }[];
}

const DEFAULT_COLORS = ['var(--color-iot-brand)', 'var(--color-iot-blue)', 'var(--color-iot-warning)', 'var(--color-iot-critical)'];

const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[var(--color-iot-border)] rounded-md shadow-lg p-3 text-[12px]">
        <p className="font-semibold text-[var(--color-iot-text-primary)] mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[var(--color-iot-text-secondary)]">{entry.name}:</span>
            <span className="font-bold text-[var(--color-iot-text-primary)]">
              {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 300, 
  xKey = 'name', 
  series,
  showGrid = true,
  showLegend = false,
  valueFormatter
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-iot-border)" opacity={0.5} />}
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-iot-text-muted)', fontSize: 11 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-iot-text-muted)', fontSize: 11 }}
            tickFormatter={valueFormatter}
          />
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />}
          {series.map((s, idx) => (
            <Line 
              key={s.key}
              type="monotone" 
              dataKey={s.key} 
              name={s.name || s.key}
              stroke={s.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 300, 
  xKey = 'name', 
  series,
  showGrid = true,
  showLegend = false,
  valueFormatter
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s, idx) => {
              const color = s.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
              return (
                <linearGradient key={`color-${s.key}`} id={`color-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              )
            })}
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-iot-border)" opacity={0.5} />}
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-iot-text-muted)', fontSize: 11 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-iot-text-muted)', fontSize: 11 }}
            tickFormatter={valueFormatter}
          />
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />}
          {series.map((s, idx) => (
            <Area 
              key={s.key}
              type="monotone" 
              dataKey={s.key} 
              name={s.name || s.key}
              stroke={s.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]} 
              fillOpacity={1} 
              fill={`url(#color-${s.key})`}
              strokeWidth={2}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 300, 
  xKey = 'name', 
  series,
  showGrid = true,
  showLegend = false,
  valueFormatter
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-iot-border)" opacity={0.5} />}
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-iot-text-muted)', fontSize: 11 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-iot-text-muted)', fontSize: 11 }}
            tickFormatter={valueFormatter}
          />
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} cursor={{ fill: 'var(--color-iot-bg)' }} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />}
          {series.map((s, idx) => (
            <Bar 
              key={s.key}
              dataKey={s.key} 
              name={s.name || s.key}
              fill={s.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]} 
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
