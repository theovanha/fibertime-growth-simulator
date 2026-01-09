import { useState } from 'react';
import { Download } from 'lucide-react';
import { formatCurrency, formatUsers } from '../utils/formatters';
import { exportCSV } from '../utils/exportCSV';

export function PLTable({ monthlyData, allMonthlyData }) {
  const [expanded, setExpanded] = useState(false);
  
  // Show 3 months when collapsed, 12 months when expanded
  const displayData = expanded ? allMonthlyData : monthlyData;

  const handleExport = () => {
    // Export whatever is currently displayed
    exportCSV(displayData);
  };

  return (
    <div className="glass-card p-6">
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
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-2 text-white/60 font-medium">Month</th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">New Users</th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">Total Users</th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">Revenue</th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">Spend</th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">Agency Fee</th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">Transaction Fees</th>
              <th className="text-right py-3 px-2 text-white/60 font-medium">Profit</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((month) => (
              <tr
                key={month.month}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-2 text-white font-medium">
                  Month {month.month}
                </td>
                <td className="py-3 px-2 text-right text-white/80">
                  {formatUsers(month.newUsers)}
                </td>
                <td className="py-3 px-2 text-right text-white/80">
                  {formatUsers(month.totalUsers)}
                </td>
                <td className="py-3 px-2 text-right text-cyan">
                  {formatCurrency(month.revenue)}
                </td>
                <td className="py-3 px-2 text-right text-white/80">
                  {formatCurrency(month.spend)}
                </td>
                <td className="py-3 px-2 text-right text-white/80">
                  {formatCurrency(month.agencyFee)}
                </td>
                <td className="py-3 px-2 text-right text-white/80">
                  {formatCurrency(month.transactionFee)}
                </td>
                <td
                  className={`py-3 px-2 text-right font-semibold ${
                    month.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(month.profit)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/20">
              <td className="py-3 px-2 text-white font-bold">Total</td>
              <td className="py-3 px-2 text-right text-white/80">
                {formatUsers(displayData.reduce((sum, m) => sum + m.newUsers, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/60">—</td>
              <td className="py-3 px-2 text-right text-cyan font-semibold">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.revenue, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/80">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.spend, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/80">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.agencyFee, 0))}
              </td>
              <td className="py-3 px-2 text-right text-white/80">
                {formatCurrency(displayData.reduce((sum, m) => sum + m.transactionFee, 0))}
              </td>
              <td
                className={`py-3 px-2 text-right font-bold ${
                  displayData.reduce((sum, m) => sum + m.profit, 0) >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {formatCurrency(displayData.reduce((sum, m) => sum + m.profit, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
