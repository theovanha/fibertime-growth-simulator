import { useState } from 'react';
import { Download } from 'lucide-react';
import { formatCurrency, formatUsers, formatPercent } from '../utils/formatters';
import { exportCSV } from '../utils/exportCSV';

export function PLTable({ monthlyData, allMonthlyData, activeSlider, pulseSlider, inputs }) {
  const [expanded, setExpanded] = useState(true);
  
  // Show 3 months when collapsed, 12 months when expanded
  const displayData = expanded ? allMonthlyData : monthlyData;

  // Helper function to determine which months should be highlighted (for drag)
  const getHighlightedMonths = () => {
    if (!activeSlider) return new Set();
    
    // If CPL Correlation is being dragged, highlight months with spend increase > 0
    if (activeSlider === 'cplCorrelation') {
      const highlightedMonths = new Set();
      for (let month = 2; month <= 12; month++) {
        if (inputs[`spendIncreaseMonth${month}`] > 0) {
          highlightedMonths.add(month);
        }
      }
      return highlightedMonths;
    }
    
    // If a specific month's spend slider is being dragged, highlight that month
    const match = activeSlider.match(/spendIncreaseMonth(\d+)/);
    if (match) {
      return new Set([parseInt(match[1])]);
    }
    
    return new Set();
  };

  const highlightedMonths = getHighlightedMonths();

  // Helper function to determine which months should pulse (for click)
  const getPulseMonths = () => {
    if (!pulseSlider) return new Set();
    
    // If CPL Correlation is clicked, pulse months with spend increase > 0
    if (pulseSlider === 'cplCorrelation') {
      const pulseMonths = new Set();
      for (let month = 2; month <= 12; month++) {
        if (inputs[`spendIncreaseMonth${month}`] > 0) {
          pulseMonths.add(month);
        }
      }
      return pulseMonths;
    }
    
    // If a specific month's spend slider is clicked, pulse that month
    const match = pulseSlider.match(/spendIncreaseMonth(\d+)/);
    if (match) {
      return new Set([parseInt(match[1])]);
    }
    
    return new Set();
  };

  const pulseMonths = getPulseMonths();

  // Calculate cumulative profit for each month
  const dataWithCumulative = displayData.map((month, index) => {
    const cumulativeProfit = displayData
      .slice(0, index + 1)
      .reduce((sum, m) => sum + m.profit, 0);
    return { ...month, cumulativeProfit };
  });

  const handleExport = () => {
    // Export whatever is currently displayed
    exportCSV(dataWithCumulative);
  };

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Monthly P&L Breakdown
          </h3>
          <p className="text-xs text-white/40">
            {expanded ? 'Showing 12 months' : 'Showing 3 months'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setExpanded(false)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                !expanded
                  ? 'bg-cyan/20 text-cyan'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              3 Months
            </button>
            <button
              onClick={() => setExpanded(true)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                expanded
                  ? 'bg-cyan/20 text-cyan'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              12 Months
            </button>
          </div>
          <button
            onClick={handleExport}
            className="btn-gradient flex items-center gap-2 text-sm py-2 px-4"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="sticky left-0 z-10 bg-navy text-left py-3 px-2 text-white/60 font-medium">
                <div className="whitespace-nowrap text-[11px] leading-tight">Month</div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Ad Spend</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Retargeting + Brand</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Ad Spend</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Customer Acquisition</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Total</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Ad Spend</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Agency + Marketing</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Overheads</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Total Amount</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Spent</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="whitespace-nowrap text-[11px] leading-tight">CPL</div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Total</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Leads</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Conversion</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">%</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Total New</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Customers</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Total Active</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Customers</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Revenue/User</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">per Month</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Total</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Revenue</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Monthly</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Profit</span>
                </div>
              </th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] leading-tight whitespace-nowrap">Cumulative</span>
                  <span className="text-[10px] leading-tight whitespace-nowrap">Profit</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {dataWithCumulative.map((month) => {
              const isMonthHighlighted = highlightedMonths.has(month.month);
              const isMonthPulsing = pulseMonths.has(month.month);
              
              const highlightCPL = activeSlider === 'cplCorrelation' && isMonthHighlighted;
              const pulseCPL = pulseSlider === 'cplCorrelation' && isMonthPulsing;
              
              const highlightSpend = activeSlider && activeSlider.startsWith('spendIncreaseMonth') && isMonthHighlighted;
              const pulseSpend = pulseSlider && pulseSlider.startsWith('spendIncreaseMonth') && isMonthPulsing;
              
              return (
                <tr
                  key={month.month}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="sticky left-0 z-10 bg-navy py-3 px-2 text-white font-medium whitespace-nowrap">
                    Month {month.month}
                  </td>
                  <td className={`py-3 px-2 text-right text-white/40 italic whitespace-nowrap ${highlightSpend ? 'table-cell-highlighted' : ''} ${pulseSpend ? 'table-cell-pulse' : ''}`}>
                    {formatCurrency(month.retargetingSpend)}
                  </td>
                  <td className={`py-3 px-2 text-right text-white/40 italic whitespace-nowrap ${highlightSpend ? 'table-cell-highlighted' : ''} ${pulseSpend ? 'table-cell-pulse' : ''}`}>
                    {formatCurrency(month.acquisitionSpend)}
                  </td>
                  <td className={`py-3 px-2 text-right text-white/80 whitespace-nowrap ${highlightSpend ? 'table-cell-highlighted' : ''} ${pulseSpend ? 'table-cell-pulse' : ''}`}>
                    {formatCurrency(month.spend)}
                  </td>
                  <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                    {formatCurrency(month.agencyAndMarketing)}
                  </td>
                  <td className="py-3 px-2 text-right text-yellow whitespace-nowrap">
                    {formatCurrency(month.totalAmountSpent)}
                  </td>
                  <td className={`py-3 px-2 text-right text-white/80 whitespace-nowrap ${highlightCPL ? 'table-cell-highlighted' : ''} ${pulseCPL ? 'table-cell-pulse' : ''}`}>
                    {formatCurrency(month.cpl)}
                  </td>
                <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                  {formatUsers(month.totalLeads)}
                </td>
                <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                  {formatPercent(month.conversionRatio)}
                </td>
                <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                  {formatUsers(month.totalCustomers)}
                </td>
                <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                  {formatUsers(month.totalUsers)}
                </td>
                <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                  {formatCurrency(month.revenuePerUser)}
                </td>
                <td className="py-3 px-2 text-right text-cyan whitespace-nowrap">
                  {formatCurrency(month.revenue)}
                </td>
                <td
                  className={`py-3 px-2 text-right font-semibold whitespace-nowrap ${
                    month.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(month.profit)}
                </td>
                <td
                  className={`py-3 px-2 text-right font-bold whitespace-nowrap ${
                    month.cumulativeProfit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(month.cumulativeProfit)}
                </td>
              </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/20">
              <td className="sticky left-0 z-10 bg-navy py-3 px-2 text-white font-bold whitespace-nowrap">Total</td>
              <td className="py-3 px-2 text-right text-white/40 italic whitespace-nowrap">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.retargetingSpend, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/40 italic whitespace-nowrap">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.acquisitionSpend, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.spend, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.agencyAndMarketing, 0))}
              </td>
              <td className="py-3 px-2 text-right text-yellow font-semibold whitespace-nowrap">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.totalAmountSpent, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/60 whitespace-nowrap">—</td>
              <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                {formatUsers(displayData.reduce((sum, m) => sum + m.totalLeads, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/60 whitespace-nowrap">—</td>
              <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                {formatUsers(displayData.reduce((sum, m) => sum + m.totalCustomers, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/80 whitespace-nowrap">
                {formatUsers(displayData.reduce((sum, m) => sum + m.totalUsers, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/60 whitespace-nowrap">—</td>
              <td className="py-3 px-2 text-right text-cyan font-semibold whitespace-nowrap">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.revenue, 0))}
              </td>
              <td
                className={`py-3 px-2 text-right font-bold whitespace-nowrap ${
                  displayData.reduce((sum, m) => sum + m.profit, 0) >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {formatCurrency(displayData.reduce((sum, m) => sum + m.profit, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/60 whitespace-nowrap">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
