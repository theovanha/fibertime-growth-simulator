import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { GrowthChart } from './components/GrowthChart';
import { PLTable } from './components/PLTable';
import { useCalculations } from './hooks/useCalculations';

// Default input values
const DEFAULT_VALUES = {
  monthlySpend: 100000,
  baseCPL: 10,
  conversionRate: 33,
  cplPenalty: 10,
  usageDays: 10,
  pricePerDay: 5,
  retention: 85,
};

function App() {
  const [inputs, setInputs] = useState(DEFAULT_VALUES);

  // Handle individual slider changes
  const handleInputChange = useCallback((id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  }, []);

  // Calculate all derived values
  const { kpis, monthlyData, allMonthlyData } = useCalculations(inputs);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-navy overflow-hidden">
      {/* Sidebar - Full height on desktop */}
      <div className="w-full lg:w-80 flex-shrink-0 lg:h-screen lg:overflow-y-auto lg:border-r lg:border-white/10 bg-navy/50">
        {/* Mobile header */}
        <div className="lg:hidden border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-cyan">fiber</span>
                <span className="text-yellow">time</span>
              </h1>
              <p className="text-xs text-white/50">Growth Command Center</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">12-Month Simulator</p>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-0 lg:pt-3">
          {/* Explanatory Intro - Mobile only */}
          <div className="mb-4 lg:hidden">
            <p className="text-white/70 text-sm">
              Drag the sliders to test different scenarios. See how changing spend, pricing, or retention 
              affects your profit over 12 months.
            </p>
          </div>
          <Sidebar
            inputs={inputs}
            onInputChange={handleInputChange}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Desktop only (inside main area) */}
        <header className="hidden lg:block border-b border-white/10 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  <span className="text-cyan">fiber</span>
                  <span className="text-yellow">time</span>
                  <span className="text-white/50 font-normal text-lg ml-3">Growth Command Center</span>
                </h1>
                <p className="text-white/50 text-sm">
                  Drag the sliders to test different scenarios. See how changing spend, pricing, or retention 
                  affects your profit over 12 months.
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-8">
                <p className="text-xs text-white/40">12-Month Simulator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Panel - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <GrowthChart allMonthlyData={allMonthlyData} />
          <KPICards kpis={kpis} />
          <PLTable monthlyData={monthlyData} allMonthlyData={allMonthlyData} />
          
          {/* Footer */}
          <footer className="border-t border-white/10 mt-8 py-4">
            <p className="text-center text-xs text-white/30">
              fibertime Growth Simulator • Built for C-Suite Strategic Planning
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
