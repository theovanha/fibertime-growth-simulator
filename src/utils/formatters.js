/**
 * Format a number as ZAR currency
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string (e.g., "R 1,234,567")
 */
export function formatCurrency(value) {
  const absValue = Math.abs(value);
  const formatted = Math.round(absValue).toLocaleString('en-ZA');
  const sign = value < 0 ? '-' : '';
  return `${sign}R ${formatted}`;
}

/**
 * Format a number as a percentage
 * @param {number} value - The value to format (already in percentage form, e.g., 85 for 85%)
 * @returns {string} Formatted percentage string (e.g., "85%")
 */
export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

/**
 * Format a number as whole users
 * @param {number} value - The value to format
 * @returns {string} Formatted user count (e.g., "1,234")
 */
export function formatUsers(value) {
  return Math.round(value).toLocaleString('en-ZA');
}

/**
 * Format days display
 * @param {number} value - Number of days
 * @returns {string} Formatted days string (e.g., "10 days")
 */
export function formatDays(value) {
  return `${value} days`;
}

/**
 * Format slider value based on type
 * @param {number} value - The value to format
 * @param {string} format - The format type ('currency', 'percent', 'days')
 * @returns {string} Formatted value
 */
export function formatSliderValue(value, format) {
  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    case 'days':
      return `${value} days/month`;
    default:
      return String(value);
  }
}
