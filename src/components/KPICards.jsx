import { useState } from 'react';
import { TrendingUp, Target, Clock, Calculator, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function KPICard({ icon: Icon, title, value, subtitle, isPositive, variant = 'default' }) {
  const variantStyles = {
    default: 'glass-card',
    digital: 'glass-card border-cyan/30',
    allIn: 'glass-card border-yellow/30',
  };

  const accentColor = variant === 'allIn' ? 'text-yellow' : 'text-cyan';
  const bgColor = variant === 'allIn' ? 'bg-yellow/10' : 'bg-cyan/10';

  return (
    <div className={`${variantStyles[variant]} p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-4 h-4 ${accentColor}`} />
        </div>
        {typeof isPositive === 'boolean' && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isPositive ? 'Positive' : 'Negative'}
          </span>
        )}
      </div>
      <h4 className={`text-sm font-bold mb-1 ${accentColor}`}>{title}</h4>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {subtitle && (
        <p className="text-xs text-white/40 mt-2">{subtitle}</p>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-bold text-white uppercase tracking-wide">{children}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
    </div>
  );
}

export function KPICards({ kpis }) {
  const [viewMode, setViewMode] = useState('cumulative');
  
  const {
    netProfit30Day,
    netProfit90Day,
    netProfit1Year,
    monthlyProfit30Day,
    monthlyProfit90Day,
    monthlyProfit1Year,
    digitalNCAC,
    allInNCAC,
    digitalPayback,
    allInPayback,
  } = kpis;

  // Select values based on view mode
  const isCumulative = viewMode === 'cumulative';
  const profit30 = isCumulative ? netProfit30Day : monthlyProfit30Day;
  const profit90 = isCumulative ? netProfit90Day : monthlyProfit90Day;
  const profit1Y = isCumulative ? netProfit1Year : monthlyProfit1Year;

  return (
    <div className="space-y-6 mb-6">
      {/* Profit Row - 3 columns */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Net Profit</h3>
          {/* Toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'monthly'
                  ? 'bg-cyan/20 text-cyan'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode('cumulative')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'cumulative'
                  ? 'bg-cyan/20 text-cyan'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              Cumulative
            </button>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <KPICard
            icon={TrendingUp}
            title="30-Day"
            value={formatCurrency(profit30)}
            subtitle={isCumulative ? "Month 1 profit" : "Month 1 only"}
            isPositive={profit30 >= 0}
          />
          <KPICard
            icon={TrendingUp}
            title="90-Day"
            value={formatCurrency(profit90)}
            subtitle={isCumulative ? "Months 1-3 cumulative" : "Month 3 only"}
            isPositive={profit90 >= 0}
          />
          <KPICard
            icon={TrendingUp}
            title="1-Year"
            value={formatCurrency(profit1Y)}
            subtitle={isCumulative ? "12 months cumulative" : "Month 12 only"}
            isPositive={profit1Y >= 0}
          />
        </div>
      </div>

      {/* nCAC Row - 2 columns */}
      <div>
        <SectionLabel>Customer Acquisition Cost (nCAC)</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <KPICard
            icon={Target}
            title="Digital nCAC"
            value={formatCurrency(digitalNCAC)}
            subtitle="Spend ÷ New Users (excludes agency)"
            variant="digital"
          />
          <KPICard
            icon={Calculator}
            title="All-In nCAC"
            value={formatCurrency(allInNCAC)}
            subtitle="(Spend + R75k Agency) ÷ New Users"
            variant="allIn"
          />
        </div>
      </div>

      {/* Payback Row - 2 columns */}
      <div>
        <SectionLabel>Payback Period</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <KPICard
            icon={Clock}
            title="Digital Payback"
            value={digitalPayback}
            subtitle="How long until ad spend pays for itself"
            isPositive={digitalPayback !== 'No payback in 1 year'}
            variant="digital"
          />
          <KPICard
            icon={DollarSign}
            title="All-In Payback"
            value={allInPayback}
            subtitle="How long until all costs pay for themselves"
            isPositive={allInPayback !== 'No payback in 1 year'}
            variant="allIn"
          />
        </div>
      </div>
    </div>
  );
}
