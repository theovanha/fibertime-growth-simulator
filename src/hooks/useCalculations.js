import { useMemo } from 'react';
import {
  BASE_SPEND_ANCHOR,
  STEP_SIZE,
  FIXED_AGENCY_FEE,
  TRANS_FEE_RATE,
} from '../constants/config';

/**
 * Custom hook that performs all growth model calculations
 * @param {Object} inputs - Slider input values
 * @returns {Object} Calculated results including monthly data and KPIs
 */
export function useCalculations(inputs) {
  const {
    monthlySpend,
    baseCPL,
    conversionRate,
    cplPenalty,
    usageDays,
    pricePerDay,
    retention,
  } = inputs;

  return useMemo(() => {
    // Step 1: Calculate escalator steps (diminishing returns)
    const steps = Math.max(0, Math.floor((monthlySpend - BASE_SPEND_ANCHOR) / STEP_SIZE));

    // Step 2: Calculate adjusted CPL with escalator
    const adjCPL = baseCPL * (1 + (cplPenalty / 100) * steps);

    // Step 3: Calculate nCAC (net Customer Acquisition Cost)
    const nCAC = adjCPL / (conversionRate / 100);

    // Step 4: Calculate new users per month (same each month)
    const newUsersPerMonth = monthlySpend / nCAC;

    // Step 5: Calculate user totals for 12 months with retention compounding
    const totalUsersArray = [];
    let prevTotalUsers = 0;
    for (let i = 0; i < 12; i++) {
      const retained = prevTotalUsers * (retention / 100);
      const totalUsers = retained + newUsersPerMonth;
      totalUsersArray.push(totalUsers);
      prevTotalUsers = totalUsers;
    }

    // Helper function to calculate month metrics (with and without agency fee)
    const calculateMonth = (monthNumber, totalUsers) => {
      const revenue = totalUsers * usageDays * pricePerDay;
      const transactionFee = revenue * TRANS_FEE_RATE;
      const agencyFee = FIXED_AGENCY_FEE;
      
      // All-in costs (includes agency fee)
      const totalCostAllIn = monthlySpend + transactionFee + agencyFee;
      const profitAllIn = revenue - totalCostAllIn;
      
      // Digital-only costs (excludes agency fee)
      const totalCostDigital = monthlySpend + transactionFee;
      const profitDigital = revenue - totalCostDigital;

      return {
        month: monthNumber,
        newUsers: newUsersPerMonth,
        totalUsers,
        revenue,
        spend: monthlySpend,
        agencyFee,
        transactionFee,
        totalCost: totalCostAllIn,
        profit: profitAllIn,
        profitDigital,
        totalCostDigital,
      };
    };

    // Calculate all 12 months
    const allMonthlyData = totalUsersArray.map((totalUsers, index) => 
      calculateMonth(index + 1, totalUsers)
    );

    // First 3 months for display in table/chart
    const monthlyData = allMonthlyData.slice(0, 3);

    // === PROFIT KPIs ===
    // Cumulative profit (sum of months)
    const netProfit30Day = allMonthlyData[0].profit;
    const netProfit90Day = allMonthlyData.slice(0, 3).reduce((sum, m) => sum + m.profit, 0);
    const netProfit1Year = allMonthlyData.reduce((sum, m) => sum + m.profit, 0);
    
    // Monthly-only profit (single month values)
    const monthlyProfit30Day = allMonthlyData[0].profit; // Month 1
    const monthlyProfit90Day = allMonthlyData[2].profit; // Month 3 only
    const monthlyProfit1Year = allMonthlyData[11].profit; // Month 12 only

    // === nCAC KPIs ===
    // Digital nCAC (excludes agency fee)
    const digitalNCAC = monthlySpend / newUsersPerMonth;
    
    // All-In nCAC (includes agency fee)
    const allInNCAC = (monthlySpend + FIXED_AGENCY_FEE) / newUsersPerMonth;

    // === PAYBACK KPIs ===
    // Helper function to calculate payback period
    const calculatePayback = (profitKey) => {
      let cumulative = 0;
      for (let i = 0; i < 12; i++) {
        cumulative += allMonthlyData[i][profitKey];
        if (cumulative >= 0) {
          return `${(i + 1) * 30} days`;
        }
      }
      return 'No payback in 1 year';
    };

    // Digital Payback (costs exclude agency fee)
    const digitalPayback = calculatePayback('profitDigital');
    
    // All-In Payback (costs include agency fee)
    const allInPayback = calculatePayback('profit');

    // Chart data formatted for Recharts (first 3 months)
    const chartData = monthlyData.map((m) => ({
      name: `Month ${m.month}`,
      revenue: m.revenue,
      totalCosts: m.totalCost,
      netProfit: m.profit,
    }));

    return {
      // Raw calculation values
      steps,
      adjCPL,
      nCAC,
      newUsersPerMonth,

      // Monthly data array (first 3 months for table)
      monthlyData,
      
      // All 12 months for extended calculations
      allMonthlyData,

      // KPIs
      kpis: {
        // Cumulative profit metrics
        netProfit30Day,
        netProfit90Day,
        netProfit1Year,
        
        // Monthly-only profit metrics
        monthlyProfit30Day,
        monthlyProfit90Day,
        monthlyProfit1Year,
        
        // nCAC metrics
        digitalNCAC,
        allInNCAC,
        
        // Payback metrics
        digitalPayback,
        allInPayback,
      },

      // Chart-ready data
      chartData,
    };
  }, [monthlySpend, baseCPL, conversionRate, cplPenalty, usageDays, pricePerDay, retention]);
}
