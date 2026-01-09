import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="glass-card p-4 border border-white/20">
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-white/70">{entry.name}:</span>
          <span className="font-medium text-white">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function GrowthChart({ allMonthlyData }) {
  // Generate chart data for all 12 months
  const chartData = useMemo(() => {
    return allMonthlyData.map((m) => ({
      name: `M${m.month}`,
      month: m.month,
      revenue: m.revenue,
      totalCosts: m.totalCost,
      netProfit: m.profit,
    }));
  }, [allMonthlyData]);

  return (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        12-Month Financial Trajectory
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFF00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FFFF00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              interval={0}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              tickFormatter={(value) => {
                if (Math.abs(value) >= 1000000) {
                  return `R ${(value / 1000000).toFixed(1)}m`;
                }
                return `R ${(value / 1000).toFixed(0)}k`;
              }}
            />
            {/* Zero reference line */}
            <ReferenceLine
              y={0}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#00FFFF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="totalCosts"
              name="Total Costs"
              stroke="#FF6B6B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCosts)"
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="netProfit"
              name="Net Profit"
              stroke="#FFFF00"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
