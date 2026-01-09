import { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Settings,
  Info,
} from 'lucide-react';
import { SLIDER_CONFIG, FIXED_AGENCY_FEE, TRANS_FEE_RATE, STEP_SIZE } from '../constants/config';
import { formatSliderValue, formatCurrency, formatPercent } from '../utils/formatters';

function SliderInput({ id, value, onChange, config, helperText, info }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1">
          <label htmlFor={id} className="text-sm text-white/80">
            {config.label}
          </label>
          {info && <InfoTooltip text={info} />}
        </div>
        <span className="text-sm font-semibold text-cyan">
          {formatSliderValue(value, config.format)}
        </span>
      </div>
      {helperText && (
        <p className="text-xs text-white/40 mb-2">{helperText}</p>
      )}
      <input
        type="range"
        id={id}
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={(e) => onChange(id, Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function InfoTooltip({ text }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - 280),
    });
    setIsVisible(true);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          if (!isVisible) handleMouseEnter(e);
          else setIsVisible(false);
        }}
      >
        <Info className="w-3.5 h-3.5 text-white/40 hover:text-cyan transition-colors" />
      </button>
      {isVisible && (
        <div 
          className="fixed z-[9999] w-64 p-3 bg-navy border border-cyan/30 rounded-lg shadow-xl shadow-black/50"
          style={{ top: position.top, left: position.left }}
        >
          <p className="text-xs text-white/80 leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, info }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-5 first:mt-0">
      <Icon className="w-4 h-4 text-cyan" />
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
        {title}
      </h3>
      {info && <InfoTooltip text={info} />}
    </div>
  );
}

export function Sidebar({ inputs, onInputChange }) {
  const [assumptionsExpanded, setAssumptionsExpanded] = useState(false);

  return (
    <aside className="lg:px-6 lg:py-3 p-0">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-0.5">Growth Parameters</h2>
        <p className="text-xs text-white/50">Adjust inputs to simulate scenarios</p>
      </div>

      {/* Fixed Assumptions - Collapsible at top */}
      <div className="mb-5 pb-5 border-b border-white/10">
        <button
          onClick={() => setAssumptionsExpanded(!assumptionsExpanded)}
          className="w-full flex items-center justify-between py-1 group"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-yellow" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Fixed Assumptions
            </h3>
          </div>
          {assumptionsExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
          )}
        </button>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            assumptionsExpanded ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1.5 px-3 bg-white/5 rounded-lg">
              <span className="text-white/60">Agency Fee</span>
              <span className="text-yellow font-medium">{formatCurrency(FIXED_AGENCY_FEE)}/month</span>
            </div>
            <div className="py-1.5 px-3 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Transaction Fee</span>
                <span className="text-yellow font-medium">{formatPercent(TRANS_FEE_RATE * 100)}</span>
              </div>
              <p className="text-xs text-white/40 mt-1">Payment processing fee on all revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Usage */}
      <SectionHeader icon={Calendar} title="Product Usage" />
      <SliderInput
        id="pricePerDay"
        value={inputs.pricePerDay}
        onChange={onInputChange}
        config={SLIDER_CONFIG.pricePerDay}
      />
      <SliderInput
        id="usageDays"
        value={inputs.usageDays}
        onChange={onInputChange}
        config={SLIDER_CONFIG.usageDays}
      />
      <div className="flex justify-between items-center py-1.5 px-3 bg-cyan/5 rounded-lg -mt-2 mb-4 border border-cyan/20">
        <span className="text-white/50 text-xs">Monthly ARPU</span>
        <span className="text-cyan font-semibold text-sm">{formatCurrency(inputs.usageDays * inputs.pricePerDay)}/user</span>
      </div>

      {/* Spend & Acquisition */}
      <SectionHeader icon={DollarSign} title="Spend & Acquisition" />
      <SliderInput
        id="monthlySpend"
        value={inputs.monthlySpend}
        onChange={onInputChange}
        config={SLIDER_CONFIG.monthlySpend}
      />
      <SliderInput
        id="baseCPL"
        value={inputs.baseCPL}
        onChange={onInputChange}
        config={SLIDER_CONFIG.baseCPL}
        info="Cost Per Lead (CPL): The baseline cost to generate one lead before any scaling penalties are applied."
      />
      <SliderInput
        id="conversionRate"
        value={inputs.conversionRate}
        onChange={onInputChange}
        config={SLIDER_CONFIG.conversionRate}
      />
      <SliderInput
        id="cplPenalty"
        value={inputs.cplPenalty}
        onChange={onInputChange}
        config={SLIDER_CONFIG.cplPenalty}
        helperText="% increase to CPL for every R30k in spend"
      />
      {(() => {
        const steps = Math.max(0, Math.floor(inputs.monthlySpend / STEP_SIZE));
        const adjCPL = inputs.baseCPL * (1 + (inputs.cplPenalty / 100) * steps);
        const nCAC = adjCPL / (inputs.conversionRate / 100);
        return (
          <div className="flex justify-between items-center py-1.5 px-3 bg-cyan/5 rounded-lg -mt-2 mb-4 border border-cyan/20">
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-xs">nCAC</span>
              <InfoTooltip text="Net Customer Acquisition Cost (nCAC): The true cost to acquire one paying customer. Calculated as Adjusted CPL ÷ Conversion Rate. This accounts for both the cost per lead and how many leads convert to customers." />
            </div>
            <span className="text-cyan font-semibold text-sm">{formatCurrency(nCAC)}/user</span>
          </div>
        );
      })()}

      {/* Retention */}
      <SectionHeader icon={Users} title="Retention" info="Monthly retention rate: The percentage of users who continue using the service each month. Higher retention creates compounding growth." />
      <SliderInput
        id="retention"
        value={inputs.retention}
        onChange={onInputChange}
        config={SLIDER_CONFIG.retention}
      />
    </aside>
  );
}
