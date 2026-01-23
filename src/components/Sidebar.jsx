import { useState } from 'react';
import {
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  Settings,
  Info,
  Users,
  Plus,
  Minus,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { SLIDER_CONFIG, FIXED_AGENCY_FEE, AGENCY_FEE_THRESHOLD, AGENCY_FEE_PERCENTAGE, TRANS_FEE_RATE } from '../constants/config';
import { formatSliderValue, formatCurrency, formatPercent } from '../utils/formatters';
import { SavedSettings } from './SavedSettings';

function SliderInput({ id, value, onChange, config, helperText, info, onDragStart, onDragEnd, onClick }) {
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
        onClick={onClick}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
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

export function Sidebar({ 
  inputs, 
  onInputChange,
  onLoadSettings,
  calculatedNCAC, 
  newUsersPerMonth, 
  retentionExpanded, 
  setRetentionExpanded,
  retentionSectionRef,
  onScrollToCohortTable,
  onScrollToGrowthChart,
  onScrollToPLTable,
  onSliderDragStart,
  onSliderDragEnd,
  onSliderClick
}) {
  const [productUsageExpanded, setProductUsageExpanded] = useState(true);
  const [spendAcquisitionExpanded, setSpendAcquisitionExpanded] = useState(false);
  const [scalingExpanded, setScalingExpanded] = useState(false);
  const [assumptionsExpanded, setAssumptionsExpanded] = useState(false);

  return (
    <aside className="lg:px-6 lg:py-3 p-0">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-0.5">Growth Parameters</h2>
        <p className="text-xs text-white/50">Adjust inputs to simulate scenarios</p>
      </div>

      {/* Product Usage - Collapsible */}
      <div>
        <button
          onClick={() => setProductUsageExpanded(!productUsageExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-yellow/20 via-yellow/10 to-transparent border-l-2 border-yellow group"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Product Usage
            </h3>
          </div>
          {productUsageExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            productUsageExpanded ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          {/* See Impact Button */}
          <button
            onClick={onScrollToGrowthChart}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-4 btn-gradient-flow border border-cyan/40 rounded-lg text-cyan text-xs font-semibold shadow-lg"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            See Impact?
          </button>

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
          <div className="flex justify-between items-center gap-2 py-1.5 px-3 bg-yellow/5 rounded-lg -mt-2 mb-4 border border-yellow/20">
            <span className="text-white/50 text-[11px] whitespace-nowrap">Revenue per User per Month</span>
            <span className="text-yellow font-semibold text-sm whitespace-nowrap flex-shrink-0">{formatCurrency(inputs.usageDays * inputs.pricePerDay)}/user</span>
          </div>
        </div>
      </div>

      {/* Retention - Collapsible */}
      <div ref={retentionSectionRef} className="mt-5">
        <button
          onClick={() => setRetentionExpanded(!retentionExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-yellow/20 via-yellow/10 to-transparent border-l-2 border-yellow group"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-yellow flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Retention
            </h3>
          </div>
          {retentionExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            retentionExpanded ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          {/* See Impact Button */}
          <button
            onClick={onScrollToCohortTable}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-4 btn-gradient-flow border border-cyan/40 rounded-lg text-cyan text-xs font-semibold shadow-lg"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            See Impact?
          </button>

          {/* Global Adjustment Buttons */}
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60 font-medium">Global Adjustment</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  // Decrease all retention rates by 5%
                  for (let i = 2; i <= 12; i++) {
                    const key = `retentionMonth${i}`;
                    const newValue = Math.max(0, inputs[key] - 5);
                    onInputChange(key, newValue);
                  }
                }}
                className="flex items-center justify-center w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg transition-colors group"
              >
                <Minus className="w-4 h-4 text-red-400 group-hover:text-red-300" />
              </button>
              
              <div className="px-4 py-2 bg-yellow/10 border border-yellow/30 rounded-lg">
                <span className="text-sm font-bold text-yellow">5%</span>
              </div>
              
              <button
                onClick={() => {
                  // Increase all retention rates by 5%
                  for (let i = 2; i <= 12; i++) {
                    const key = `retentionMonth${i}`;
                    const newValue = Math.min(100, inputs[key] + 5);
                    onInputChange(key, newValue);
                  }
                }}
                className="flex items-center justify-center w-10 h-10 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg transition-colors group"
              >
                <Plus className="w-4 h-4 text-green-400 group-hover:text-green-300" />
              </button>
            </div>
            <p className="text-xs text-white/40 text-center mt-2">
              Adjust all retention rates at once
            </p>
          </div>

          <div className="space-y-3">
            <SliderInput
              id="retentionMonth2"
              value={inputs.retentionMonth2}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth2}
            />
            {inputs.retentionMonth2 > 100 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from Month 1</p>
            )}
            
            <SliderInput
              id="retentionMonth3"
              value={inputs.retentionMonth3}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth3}
            />
            {inputs.retentionMonth3 > inputs.retentionMonth2 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth4"
              value={inputs.retentionMonth4}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth4}
            />
            {inputs.retentionMonth4 > inputs.retentionMonth3 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth5"
              value={inputs.retentionMonth5}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth5}
            />
            {inputs.retentionMonth5 > inputs.retentionMonth4 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth6"
              value={inputs.retentionMonth6}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth6}
            />
            {inputs.retentionMonth6 > inputs.retentionMonth5 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth7"
              value={inputs.retentionMonth7}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth7}
            />
            {inputs.retentionMonth7 > inputs.retentionMonth6 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth8"
              value={inputs.retentionMonth8}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth8}
            />
            {inputs.retentionMonth8 > inputs.retentionMonth7 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth9"
              value={inputs.retentionMonth9}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth9}
            />
            {inputs.retentionMonth9 > inputs.retentionMonth8 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth10"
              value={inputs.retentionMonth10}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth10}
            />
            {inputs.retentionMonth10 > inputs.retentionMonth9 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth11"
              value={inputs.retentionMonth11}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth11}
            />
            {inputs.retentionMonth11 > inputs.retentionMonth10 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
            
            <SliderInput
              id="retentionMonth12"
              value={inputs.retentionMonth12}
              onChange={onInputChange}
              config={SLIDER_CONFIG.retentionMonth12}
            />
            {inputs.retentionMonth12 > inputs.retentionMonth11 && (
              <p className="text-xs text-yellow-500 -mt-2 mb-2">⚠️ Retention increased from previous month</p>
            )}
          </div>
        </div>
      </div>

      {/* Spend & Acquisition - Collapsible */}
      <div className="mt-5">
        <button
          onClick={() => setSpendAcquisitionExpanded(!spendAcquisitionExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-yellow/20 via-yellow/10 to-transparent border-l-2 border-yellow group"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Spend & Acquisition
            </h3>
          </div>
          {spendAcquisitionExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            spendAcquisitionExpanded ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          {/* See Impact Button */}
          <button
            onClick={onScrollToGrowthChart}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-4 btn-gradient-flow border border-cyan/40 rounded-lg text-cyan text-xs font-semibold shadow-lg"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            See Impact?
          </button>

          <SliderInput
            id="monthlySpend"
            value={inputs.monthlySpend}
            onChange={onInputChange}
            config={SLIDER_CONFIG.monthlySpend}
          />
          <SliderInput
            id="retargetingPercent"
            value={inputs.retargetingPercent}
            onChange={onInputChange}
            config={SLIDER_CONFIG.retargetingPercent}
          />
          <div className="flex justify-between items-center gap-2 py-1.5 px-3 bg-yellow/5 rounded-lg -mt-2 mb-2 border border-yellow/20">
            <span className="text-white/50 text-[11px] whitespace-nowrap">Ad Spend (Acquisition)</span>
            <span className="text-yellow font-semibold text-sm whitespace-nowrap flex-shrink-0">{formatCurrency(inputs.monthlySpend * (1 - inputs.retargetingPercent / 100))}</span>
          </div>
          <div className="flex justify-between items-center gap-2 py-1.5 px-3 bg-yellow/5 rounded-lg mt-2 mb-4 border border-yellow/20">
            <span className="text-white/50 text-[11px] whitespace-nowrap">Ad Spend (Retargeting)</span>
            <span className="text-yellow font-semibold text-sm whitespace-nowrap flex-shrink-0">{formatCurrency(inputs.monthlySpend * (inputs.retargetingPercent / 100))}</span>
          </div>
          <SliderInput
            id="baseCPL"
            value={inputs.baseCPL}
            onChange={onInputChange}
            config={SLIDER_CONFIG.baseCPL}
            info="Cost Per Lead (CPL): The cost to generate one lead."
          />
          {(() => {
            const acquisitionSpend = inputs.monthlySpend * (1 - inputs.retargetingPercent / 100);
            const totalLeads = acquisitionSpend / inputs.baseCPL;
            return (
              <div className="flex justify-between items-center gap-2 py-1.5 px-3 bg-yellow/5 rounded-lg -mt-2 mb-4 border border-yellow/20">
                <span className="text-white/50 text-[11px] whitespace-nowrap">Total Leads per Month</span>
                <span className="text-yellow font-semibold text-sm whitespace-nowrap flex-shrink-0">{Math.round(totalLeads).toLocaleString()}</span>
              </div>
            );
          })()}
          <SliderInput
            id="conversionRate"
            value={inputs.conversionRate}
            onChange={onInputChange}
            config={SLIDER_CONFIG.conversionRate}
          />
          <div className="flex justify-between items-center gap-2 py-1.5 px-3 bg-yellow/5 rounded-lg -mt-2 mb-4 border border-yellow/20">
            <span className="text-white/50 text-[11px] whitespace-nowrap">Total Customers per Month</span>
            <span className="text-yellow font-semibold text-sm whitespace-nowrap flex-shrink-0">{Math.round(newUsersPerMonth).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center gap-2 py-1.5 px-3 bg-yellow/5 rounded-lg -mt-2 mb-4 border border-yellow/20">
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-white/50 text-xs whitespace-nowrap">nCAC</span>
              <InfoTooltip text="Net Customer Acquisition Cost (nCAC): The all-in cost to acquire one paying customer, including total marketing spend (acquisition + retargeting), agency fees, and content costs." />
            </div>
            <span className="text-yellow font-semibold text-sm whitespace-nowrap flex-shrink-0">{formatCurrency(calculatedNCAC)}/user</span>
          </div>
        </div>
      </div>

      {/* Scaling & Growth - Collapsible */}
      <div className="mt-5">
        <button
          onClick={() => setScalingExpanded(!scalingExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-yellow/20 via-yellow/10 to-transparent border-l-2 border-yellow group"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Scaling & Growth
            </h3>
          </div>
          {scalingExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            scalingExpanded ? 'max-h-[1400px] opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          {/* See Impact Button */}
          <button
            onClick={onScrollToPLTable}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3 btn-gradient-flow border border-cyan/40 rounded-lg text-cyan text-xs font-semibold shadow-lg"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            See Impact?
          </button>

          <p className="text-white/60 text-xs mb-3">
            Scale your ad spend month-over-month and model the impact of diminishing returns on CPL.
          </p>

          {/* CPL Correlation Slider */}
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-white/60 font-medium">CPL Increase Correlation</span>
              <InfoTooltip text="How much CPL increases relative to spend increase. 100% = CPL increases at same rate as spend (full diminishing returns). 50% = CPL increases at half the rate of spend. 0% = CPL stays constant regardless of spend." />
            </div>
            <p className="text-xs text-white/40 mb-3">
              How strongly CPL scales with spend increases (0% = no impact, 100% = full correlation)
            </p>
            <SliderInput
              id="cplCorrelation"
              value={inputs.cplCorrelation}
              onChange={onInputChange}
              config={SLIDER_CONFIG.cplCorrelation}
              onDragStart={() => onSliderDragStart('cplCorrelation')}
              onDragEnd={onSliderDragEnd}
              onClick={() => onSliderClick('cplCorrelation')}
            />
          </div>

          {/* Spend Increase Sliders (Month 2-12) */}
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60 font-medium">Monthly Ad Spend Increase</span>
            </div>
            <p className="text-xs text-white/40 mb-3">
              Percentage increase in ad spend from the previous month
            </p>
            <div className="space-y-3">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                const sliderId = `spendIncreaseMonth${month}`;
                return (
                  <SliderInput
                    key={sliderId}
                    id={sliderId}
                    value={inputs[sliderId]}
                    onChange={onInputChange}
                    config={SLIDER_CONFIG[sliderId]}
                    onDragStart={() => onSliderDragStart(sliderId)}
                    onDragEnd={onSliderDragEnd}
                    onClick={() => onSliderClick(sliderId)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Costs - Collapsible at bottom */}
      <div className="mt-5">
        <button
          onClick={() => setAssumptionsExpanded(!assumptionsExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-yellow/20 via-yellow/10 to-transparent border-l-2 border-yellow group"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-yellow flex-shrink-0" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Marketing Costs
            </h3>
          </div>
          {assumptionsExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            assumptionsExpanded ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-3 text-sm">
            <div className="py-1.5 px-3 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Agency Fee</span>
                <span className="text-white/80 font-medium">
                  {inputs.monthlySpend > AGENCY_FEE_THRESHOLD 
                    ? formatPercent(AGENCY_FEE_PERCENTAGE * 100) + ' of spend'
                    : formatCurrency(FIXED_AGENCY_FEE) + '/month'}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                {formatCurrency(FIXED_AGENCY_FEE)}/month or {formatPercent(AGENCY_FEE_PERCENTAGE * 100)} of ad spend (whichever is higher when spend {'>'} {formatCurrency(AGENCY_FEE_THRESHOLD)})
              </p>
            </div>
            <div>
              <SliderInput
                id="contentCosts"
                value={inputs.contentCosts}
                onChange={onInputChange}
                config={SLIDER_CONFIG.contentCosts}
              />
            </div>
            <div>
              <SliderInput
                id="otherOverheads"
                value={inputs.otherOverheads}
                onChange={onInputChange}
                config={SLIDER_CONFIG.otherOverheads}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Saved Settings - at bottom */}
      <SavedSettings
        currentSettings={inputs}
        onLoadSettings={onLoadSettings}
      />
    </aside>
  );
}
