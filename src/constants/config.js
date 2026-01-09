// Fixed constants for the fibertime Growth Model
export const BASE_SPEND_ANCHOR = 0;
export const STEP_SIZE = 30000;
export const FIXED_AGENCY_FEE = 75000;
export const TRANS_FEE_RATE = 0.10;
export const PRICE_PER_DAY = 5;

// Slider configuration
export const SLIDER_CONFIG = {
  monthlySpend: {
    min: 5000,
    max: 1000000,
    step: 5000,
    label: 'Monthly Spend',
    format: 'currency',
  },
  baseCPL: {
    min: 5,
    max: 50,
    step: 1,
    label: 'Base CPL',
    format: 'currency',
  },
  conversionRate: {
    min: 5,
    max: 100,
    step: 1,
    label: 'Lead-to-Customer Conversion',
    format: 'percent',
  },
  cplPenalty: {
    min: 0,
    max: 50,
    step: 1,
    label: 'CPL Escalator (diminishing returns)',
    format: 'percent',
  },
  usageDays: {
    min: 1,
    max: 30,
    step: 1,
    label: 'Usage Days',
    format: 'days',
  },
  pricePerDay: {
    min: 1,
    max: 15,
    step: 1,
    label: 'Revenue per Day',
    format: 'currency',
  },
  retention: {
    min: 0,
    max: 100,
    step: 1,
    label: 'Retention',
    format: 'percent',
  },
};
