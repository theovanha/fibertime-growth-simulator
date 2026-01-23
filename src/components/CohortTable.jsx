import { Settings } from 'lucide-react';
import { formatUsers } from '../utils/formatters';

export function CohortTable({ cohortData, cohortTableRef, onScrollToRetention }) {
  if (!cohortData || cohortData.length === 0) return null;

  // Calculate total active users for each month (sum of all cohorts)
  const totalActiveByMonth = [];
  for (let month = 0; month < 12; month++) {
    let total = 0;
    cohortData.forEach((cohort) => {
      const cohortMonth = cohort.monthlyUsers.find(m => m.month === month + 1);
      if (cohortMonth) {
        total += cohortMonth.users;
      }
    });
    totalActiveByMonth.push(total);
  }

  return (
    <div ref={cohortTableRef} className="glass-card p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Cohort Analysis - Retention Waterfall
          </h3>
          <p className="text-xs text-white/40">
            Shows how each month's customers are retained over time
          </p>
        </div>
        <button
          onClick={onScrollToRetention}
          className="flex items-center gap-2 px-3 py-1.5 bg-yellow/10 hover:bg-yellow/20 border border-yellow/30 rounded-lg transition-colors text-yellow text-xs font-medium whitespace-nowrap"
        >
          <Settings className="w-3.5 h-3.5" />
          Adjust Retention?
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="sticky left-0 z-10 bg-navy text-left py-3 px-3 text-white/60 font-medium whitespace-nowrap">
                Cohort
              </th>
              {[...Array(12)].map((_, i) => (
                <th key={i} className="text-right py-3 px-3 text-white/60 font-medium whitespace-nowrap">
                  Month {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohortData.map((cohort) => (
              <tr
                key={cohort.month}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="sticky left-0 z-10 bg-navy py-3 px-3 text-white font-medium whitespace-nowrap">
                  Month {cohort.month}
                </td>
                {[...Array(12)].map((_, monthIdx) => {
                  const monthData = cohort.monthlyUsers.find(m => m.month === monthIdx + 1);
                  if (!monthData) {
                    return (
                      <td key={monthIdx} className="py-3 px-3 text-right text-white/20 whitespace-nowrap">
                        —
                      </td>
                    );
                  }
                  
                  // Color intensity based on retention rate
                  const opacity = Math.max(0.4, monthData.retentionRate / 100);
                  const bgColor = `rgba(34, 211, 238, ${opacity * 0.1})`; // cyan with varying opacity
                  
                  return (
                    <td 
                      key={monthIdx} 
                      className="py-3 px-3 text-right text-white/80 whitespace-nowrap"
                      style={{ backgroundColor: bgColor }}
                    >
                      {formatUsers(monthData.users)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-cyan/30">
              <td className="sticky left-0 z-10 bg-navy py-3 px-3 text-cyan font-bold whitespace-nowrap">
                Total Active
              </td>
              {totalActiveByMonth.map((total, idx) => (
                <td key={idx} className="py-3 px-3 text-right text-cyan font-bold whitespace-nowrap">
                  {formatUsers(total)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
