// Fixed constants for the fibertime Growth Model
export const FIXED_AGENCY_FEE = 120000;
export const AGENCY_FEE_THRESHOLD = 600000;
export const AGENCY_FEE_PERCENTAGE = 0.20;
export const TRANS_FEE_RATE = 0.10;
export const PRICE_PER_DAY = 5;

// Slider configuration
export const SLIDER_CONFIG = {
  monthlySpend: {
    min: 0,
    max: 2000000,
    step: 50000,
    label: 'Monthly Spend',
    format: 'currency',
  },
  retargetingPercent: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Retargeting % of Spend',
    format: 'percent',
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
    label: 'Revenue per User per Day',
    format: 'currency',
  },
  retentionMonth2: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 2',
    format: 'percent',
  },
  retentionMonth3: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 3',
    format: 'percent',
  },
  retentionMonth4: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 4',
    format: 'percent',
  },
  retentionMonth5: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 5',
    format: 'percent',
  },
  retentionMonth6: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 6',
    format: 'percent',
  },
  retentionMonth7: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 7',
    format: 'percent',
  },
  retentionMonth8: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 8',
    format: 'percent',
  },
  retentionMonth9: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 9',
    format: 'percent',
  },
  retentionMonth10: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 10',
    format: 'percent',
  },
  retentionMonth11: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 11',
    format: 'percent',
  },
  retentionMonth12: {
    min: 0,
    max: 100,
    step: 5,
    label: 'Month 12',
    format: 'percent',
  },
  contentCosts: {
    min: 0,
    max: 100000,
    step: 5000,
    label: 'Content Creation Costs',
    format: 'currency',
  },
  otherOverheads: {
    min: 0,
    max: 100000,
    step: 5000,
    label: 'Other Marketing Overheads',
    format: 'currency',
  },
  // Spend scaling sliders (Month 2-12)
  spendIncreaseMonth2: { min: 0, max: 100, step: 5, label: 'Month 2 Spend Increase', format: 'percent' },
  spendIncreaseMonth3: { min: 0, max: 100, step: 5, label: 'Month 3 Spend Increase', format: 'percent' },
  spendIncreaseMonth4: { min: 0, max: 100, step: 5, label: 'Month 4 Spend Increase', format: 'percent' },
  spendIncreaseMonth5: { min: 0, max: 100, step: 5, label: 'Month 5 Spend Increase', format: 'percent' },
  spendIncreaseMonth6: { min: 0, max: 100, step: 5, label: 'Month 6 Spend Increase', format: 'percent' },
  spendIncreaseMonth7: { min: 0, max: 100, step: 5, label: 'Month 7 Spend Increase', format: 'percent' },
  spendIncreaseMonth8: { min: 0, max: 100, step: 5, label: 'Month 8 Spend Increase', format: 'percent' },
  spendIncreaseMonth9: { min: 0, max: 100, step: 5, label: 'Month 9 Spend Increase', format: 'percent' },
  spendIncreaseMonth10: { min: 0, max: 100, step: 5, label: 'Month 10 Spend Increase', format: 'percent' },
  spendIncreaseMonth11: { min: 0, max: 100, step: 5, label: 'Month 11 Spend Increase', format: 'percent' },
  spendIncreaseMonth12: { min: 0, max: 100, step: 5, label: 'Month 12 Spend Increase', format: 'percent' },
  // CPL correlation
  cplCorrelation: { min: 0, max: 100, step: 5, label: 'CPL Correlation', format: 'percent' },
};
