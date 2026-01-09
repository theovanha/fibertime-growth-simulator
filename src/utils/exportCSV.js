/**
 * Generate CSV content from monthly data
 * @param {Array} monthlyData - Array of monthly calculation results
 * @returns {string} CSV content string
 */
function generateCSVContent(monthlyData) {
  // CSV header
  const headers = [
    'Month',
    'New Users',
    'Total Users',
    'Revenue',
    'Spend',
    'Agency Fee',
    'Transaction Fees',
    'Profit',
  ];

  // CSV rows - raw numbers only, no formatting
  const rows = monthlyData.map((month) => [
    month.month,
    Math.round(month.newUsers),
    Math.round(month.totalUsers),
    Math.round(month.revenue),
    Math.round(month.spend),
    Math.round(month.agencyFee),
    Math.round(month.transactionFee),
    Math.round(month.profit),
  ]);

  // Combine header and rows
  const csvLines = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ];

  return csvLines.join('\n');
}

/**
 * Generate filename with current date
 * @returns {string} Filename with date (e.g., "fibertime-growth-sim-2024-01-15.csv")
 */
function generateFilename() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `fibertime-growth-sim-${year}-${month}-${day}.csv`;
}

/**
 * Export monthly data as CSV file
 * @param {Array} monthlyData - Array of monthly calculation results
 */
export function exportCSV(monthlyData) {
  const csvContent = generateCSVContent(monthlyData);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = generateFilename();
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
