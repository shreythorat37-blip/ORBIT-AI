import React from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendPoint } from '../../types';

interface TrendChartProps {
  data: TrendPoint[];
  currentSeverity: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value as number;
    return (
      <div className="glass-panel-light rounded-lg px-3 py-2 text-xs">
        <p className="text-slate-400 font-mono">{label}</p>
        <p className="text-blue-300 font-semibold">Severity: {val.toFixed(1)}</p>
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({ data, currentSeverity }) => {
  if (!data || data.length === 0) return null;

  const lastVal = data[data.length - 1]?.severity ?? currentSeverity;
  const firstVal = data[0]?.severity ?? currentSeverity;
  const trend = lastVal > firstVal + 0.3 ? 'up' : lastVal < firstVal - 0.3 ? 'down' : 'flat';
  const lineColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#3b82f6';

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-mono uppercase tracking-wide">
          12-Month Severity Trend
        </span>
        <span className="text-xs font-mono" style={{ color: lineColor }}>
          {trend === 'up' ? '↑ Rising' : trend === 'down' ? '↓ Falling' : '→ Stable'}
        </span>
      </div>
      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <XAxis
              dataKey="month"
              tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              domain={[0, 5.5]}
              tick={{ fill: '#475569', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              ticks={[1, 2, 3, 4, 5]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="severity"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
