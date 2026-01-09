// Strategy presets for one-click configuration
export const PRESETS = {
  conservative: {
    name: 'Conservative',
    description: 'Low-risk, controlled growth',
    values: {
      monthlySpend: 50000,
      baseCPL: 10,
      conversionRate: 30,
      cplPenalty: 0,
      usageDays: 8,
      pricePerDay: 5,
      retention: 75,
    },
  },
  testSuccess: {
    name: 'Test Success',
    description: 'Validated market-fit scenario',
    values: {
      monthlySpend: 100000,
      baseCPL: 10,
      conversionRate: 33,
      cplPenalty: 10,
      usageDays: 10,
      pricePerDay: 5,
      retention: 85,
    },
  },
  aggressiveScale: {
    name: 'Aggressive Scale',
    description: 'Maximum growth push',
    values: {
      monthlySpend: 500000,
      baseCPL: 12,
      conversionRate: 35,
      cplPenalty: 5,
      usageDays: 15,
      pricePerDay: 5,
      retention: 90,
    },
  },
};

// Default preset on load
export const DEFAULT_PRESET = 'testSuccess';
