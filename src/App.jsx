import { useState, useCallback, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { GrowthChart } from './components/GrowthChart';
import { PLTable } from './components/PLTable';
import { CohortTable } from './components/CohortTable';
import { SaveModal } from './components/SaveModal';
import { DebugPanel } from './components/DebugPanel';
import { useCalculations } from './hooks/useCalculations';
import { ChevronLeft, ChevronRight, GripVertical, Save, LogOut } from 'lucide-react';
import { Login } from './pages/Login';
import { isAuthenticated, logout } from './utils/auth';
import { saveSettings } from './services/settingsService';
import fibertimeLogo from './assets/fibertime-logo.png';

// Default input values
const DEFAULT_VALUES = {
  monthlySpend: 300000,
  retargetingPercent: 20,
  baseCPL: 10,
  conversionRate: 40,
  usageDays: 10,
  pricePerDay: 5,
  retentionMonth2: 90,
  retentionMonth3: 80,
  retentionMonth4: 70,
  retentionMonth5: 60,
  retentionMonth6: 50,
  retentionMonth7: 40,
  retentionMonth8: 35,
  retentionMonth9: 30,
  retentionMonth10: 25,
  retentionMonth11: 20,
  retentionMonth12: 15,
  contentCosts: 15000,
  otherOverheads: 15000,
  // Spend scaling
  spendIncreaseMonth2: 0,
  spendIncreaseMonth3: 20,
  spendIncreaseMonth4: 0,
  spendIncreaseMonth5: 0,
  spendIncreaseMonth6: 50,
  spendIncreaseMonth7: 0,
  spendIncreaseMonth8: 0,
  spendIncreaseMonth9: 0,
  spendIncreaseMonth10: 0,
  spendIncreaseMonth11: 0,
  spendIncreaseMonth12: 0,
  cplCorrelation: 50,
};

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 320;

console.log('[DEBUG] App.jsx - Module loaded, about to define App component');

function App() {
  console.log('[DEBUG] App.jsx - App component rendering, initial check');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const authenticated = isAuthenticated();
    console.log('[DEBUG] App.jsx - Initial isAuthenticated check:', authenticated);
    return authenticated;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState(DEFAULT_VALUES);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [retentionExpanded, setRetentionExpanded] = useState(false);
  const [activeSlider, setActiveSlider] = useState(null);
  const [pulseSlider, setPulseSlider] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const sidebarRef = useRef(null);
  const retentionSectionRef = useRef(null);
  const cohortTableRef = useRef(null);
  const growthChartRef = useRef(null);
  const plTableRef = useRef(null);
  const sidebarScrollRef = useRef(null);
  const mainPanelScrollRef = useRef(null);

  // Handle successful login
  const handleLogin = useCallback(() => {
    console.log('[DEBUG] App.jsx:handleLogin:called - handleLogin invoked', {isLoggedInBefore:isLoggedIn,isLoadingBefore:isLoading});
    setIsLoading(true);
    console.log('[DEBUG] App.jsx:handleLogin:setLoadingTrue - setIsLoading(true) called');
    // Small delay to show loader animation
    setTimeout(() => {
      console.log('[DEBUG] App.jsx:handleLogin:timeoutFired - setTimeout callback executing');
      setIsLoggedIn(true);
      console.log('[DEBUG] App.jsx:handleLogin:setLoggedInTrue - setIsLoggedIn(true) called');
      setIsLoading(false);
      console.log('[DEBUG] App.jsx:handleLogin:setLoadingFalse - setIsLoading(false) called');
    }, 800);
  }, []);

  // Handle quick save from header
  const handleQuickSave = useCallback(async (name) => {
    setIsSaving(true);
    const result = await saveSettings(name, inputs);
    setIsSaving(false);
    
    if (result.success) {
      setIsSaveModalOpen(false);
    }
  }, [inputs]);

  // Handle individual slider changes
  const handleInputChange = useCallback((id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  }, []);

  // Handle loading saved settings
  const loadSavedSettings = useCallback((settingsData) => {
    setInputs(settingsData);
  }, []);

  // Handle slider drag start (for table highlighting)
  const handleSliderDragStart = useCallback((sliderId) => {
    setActiveSlider(sliderId);
  }, []);

  // Handle slider drag end (clear table highlighting)
  const handleSliderDragEnd = useCallback(() => {
    setActiveSlider(null);
  }, []);

  // Handle slider click (pulse effect)
  const handleSliderClick = useCallback((sliderId) => {
    setPulseSlider(sliderId);
    // Clear pulse after animation completes (1.2s pulse)
    setTimeout(() => {
      setPulseSlider(null);
    }, 1200);
  }, []);

  // Scroll to Retention section in sidebar
  const scrollToRetention = useCallback(() => {
    setRetentionExpanded(true);
    setTimeout(() => {
      if (retentionSectionRef.current) {
        retentionSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 150);
  }, []);

  // Scroll to Cohort Analysis table in main panel
  const scrollToCohortTable = useCallback(() => {
    setTimeout(() => {
      if (cohortTableRef.current && mainPanelScrollRef.current) {
        const mainPanelTop = mainPanelScrollRef.current.getBoundingClientRect().top;
        const cohortTop = cohortTableRef.current.getBoundingClientRect().top;
        const offset = cohortTop - mainPanelTop;
        mainPanelScrollRef.current.scrollTo({
          top: mainPanelScrollRef.current.scrollTop + offset - 20,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  // Scroll to Growth Chart in main panel
  const scrollToGrowthChart = useCallback(() => {
    setTimeout(() => {
      if (growthChartRef.current) {
        growthChartRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, []);

  // Scroll to P&L Table in main panel
  const scrollToPLTable = useCallback(() => {
    setTimeout(() => {
      if (plTableRef.current) {
        plTableRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, []);

  // Calculate all derived values
  const { kpis, monthlyData, allMonthlyData, newUsersPerMonth, cohortData } = useCalculations(inputs);

  // Handle resize start
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  // Handle resize move
  useEffect(() => {
    const handleResizeMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Show login page if not authenticated
  if (!isLoggedIn) {
    console.log('[DEBUG] App.jsx:render:notLoggedIn - Rendering Login component', {isLoggedIn,isLoading});
    return (
      <>
        <Login onLogin={handleLogin} />
        <DebugPanel />
      </>
    );
  }

  // Show loader while transitioning
  if (isLoading) {
    console.log('[DEBUG] App.jsx:render:loading - Showing loading screen', {isLoading,isLoggedIn});
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-navy">
          <div className="text-center">
            <div className="loader mb-4"></div>
            <p className="text-white/60 text-sm">Loading Growth Simulation Model...</p>
          </div>
        </div>
        <DebugPanel />
      </>
    );
  }

  console.log('[DEBUG] App.jsx:render:mainApp - Rendering main app', {isLoggedIn,isLoading});

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-navy overflow-hidden">
      {/* Sidebar - Full height on desktop */}
      <div 
        ref={sidebarRef}
        className="w-full lg:flex-shrink-0 lg:h-screen lg:border-r lg:border-white/10 bg-navy/50 relative transition-all duration-300"
        style={{
          width: window.innerWidth >= 1024 ? (isCollapsed ? '0px' : `${sidebarWidth}px`) : '100%',
        }}
      >
        {/* Collapse/Expand Button - Desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute top-4 -right-4 z-50 w-8 h-8 items-center justify-center rounded-full bg-cyan/20 border border-cyan/40 hover:bg-cyan/30 transition-all group"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-cyan" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-cyan" />
          )}
        </button>

        {/* Sidebar Content */}
        <div className={`h-full ${isCollapsed ? 'hidden lg:hidden' : ''}`}>
          {/* Mobile header */}
          <div className="lg:hidden border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <img src={fibertimeLogo} alt="FiberTime" className="h-8 object-contain mb-1" />
                <p className="text-xs text-white/50">Growth Simulation Model</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">12-Month Simulator</p>
              </div>
            </div>
          </div>

          <div ref={sidebarScrollRef} className="p-4 lg:p-0 lg:pt-3 h-full lg:overflow-y-auto">
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
              onLoadSettings={loadSavedSettings}
              calculatedNCAC={kpis.allInNCAC}
              newUsersPerMonth={newUsersPerMonth}
              retentionExpanded={retentionExpanded}
              setRetentionExpanded={setRetentionExpanded}
              retentionSectionRef={retentionSectionRef}
              onScrollToCohortTable={scrollToCohortTable}
              onScrollToGrowthChart={scrollToGrowthChart}
              onScrollToPLTable={scrollToPLTable}
              onSliderDragStart={handleSliderDragStart}
              onSliderDragEnd={handleSliderDragEnd}
              onSliderClick={handleSliderClick}
            />
          </div>
        </div>

        {/* Resize Handle - Desktop only */}
        {!isCollapsed && (
          <div
            onMouseDown={handleResizeStart}
            className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:bg-cyan/30 transition-colors"
            title="Drag to resize"
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-cyan" />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Desktop only (inside main area) */}
        <header className="hidden lg:block border-b border-white/10 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <img src={fibertimeLogo} alt="FiberTime" className="h-8 object-contain" />
                  <span className="text-white/50 font-normal text-lg">Growth Simulation Model</span>
                </div>
                <p className="text-white/50 text-sm">
                  Drag the sliders to test different scenarios. See how changing spend, pricing, or retention 
                  affects your profit over 12 months.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-8">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan/10 hover:bg-cyan/20 border border-cyan/40 rounded-lg text-cyan text-sm font-semibold transition-all"
                  title="Save current settings"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white/60 hover:text-white text-sm transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Panel - Scrollable */}
        <div ref={mainPanelScrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6">
          <KPICards kpis={kpis} />
          <div ref={growthChartRef}>
            <GrowthChart allMonthlyData={allMonthlyData} />
          </div>
          <div ref={plTableRef}>
            <PLTable 
              monthlyData={monthlyData} 
              allMonthlyData={allMonthlyData}
              activeSlider={activeSlider}
              pulseSlider={pulseSlider}
              inputs={inputs}
            />
          </div>
          <CohortTable 
            cohortData={cohortData} 
            cohortTableRef={cohortTableRef}
            onScrollToRetention={scrollToRetention}
          />
          
          {/* Footer */}
          <footer className="border-t border-white/10 mt-8 py-6">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <img src={fibertimeLogo} alt="FiberTime" className="h-6 object-contain" />
                <span className="text-white/30">×</span>
                <span className="text-white/70 text-sm font-semibold tracking-wide">VANHA</span>
              </div>
              <p className="text-center text-xs text-white/30">
                Growth Simulation Model • Professional Modeling for Strategic Planning
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* Quick Save Modal */}
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleQuickSave}
        isSaving={isSaving}
      />

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}

export default App;
