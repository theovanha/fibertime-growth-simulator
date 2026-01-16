import { useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';

const POC_DATA = [
  {
    period: 'ALEX Free Wi-Fi (Dec)',
    source: 'META',
    totalCount: '11,244',
    customers: '4,048',
    convRate: '36.00%',
    cpl: 'R5.95',
    cpc: 'R16.53',
    totalSpent: 'R66.9k',
    totalValue: 'R1.2M',
  },
  {
    period: '',
    source: 'GOOGLE',
    totalCount: '296',
    customers: '145',
    convRate: '48.99%',
    cpl: 'R50.00',
    cpc: 'R102.06',
    totalSpent: 'R14.8k',
    totalValue: 'R43.5k',
  },
  {
    period: 'ALEX Non-Free (Jan)',
    source: 'META',
    totalCount: '719',
    customers: '356*',
    convRate: '49.57%*',
    cpl: 'R8.10',
    cpc: 'R16.34',
    totalSpent: 'R5.8k',
    totalValue: 'R106.8k',
  },
  {
    period: 'Mixed Locations (Jan)',
    source: 'META',
    totalCount: '2,750',
    customers: '—',
    convRate: '—',
    cpl: 'R5.03',
    cpc: '—',
    totalSpent: 'R13.8k',
    totalValue: '—',
  },
];

export function ProofOfConcept() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-6 mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <FlaskConical className="w-5 h-5 text-cyan" />
          <h3 className="text-lg font-semibold text-white">
            Interim Proof of Concept Results
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-xs text-white/50 mb-4">
          Historical campaign data from early testing phases
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-white/60 font-medium">Period / Category</th>
                <th className="text-left py-3 px-2 text-white/60 font-medium">Source</th>
                <th className="text-right py-3 px-2 text-white/60 font-medium">Total Count</th>
                <th className="text-right py-3 px-2 text-white/60 font-medium">Customers</th>
                <th className="text-right py-3 px-2 text-white/60 font-medium">Conv. Rate</th>
                <th className="text-right py-3 px-2 text-white/60 font-medium">CPL</th>
                <th className="text-right py-3 px-2 text-white/60 font-medium">CPC</th>
                <th className="text-right py-3 px-2 text-white/60 font-medium">Total Spent</th>
                <th className="text-right py-3 px-2 text-white/60 font-medium">Total Value<br/>(LTV R300)</th>
              </tr>
            </thead>
            <tbody>
              {POC_DATA.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 text-white font-medium">
                    {row.period}
                  </td>
                  <td className="py-3 px-2 text-white/80">
                    {row.source}
                  </td>
                  <td className="py-3 px-2 text-right text-white/80">
                    {row.totalCount}
                  </td>
                  <td className="py-3 px-2 text-right text-white/80">
                    {row.customers}
                  </td>
                  <td className="py-3 px-2 text-right text-white/80">
                    {row.convRate}
                  </td>
                  <td className="py-3 px-2 text-right text-cyan">
                    {row.cpl}
                  </td>
                  <td className="py-3 px-2 text-right text-white/80">
                    {row.cpc}
                  </td>
                  <td className="py-3 px-2 text-right text-yellow">
                    {row.totalSpent}
                  </td>
                  <td className="py-3 px-2 text-right text-green-400 font-semibold">
                    {row.totalValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
