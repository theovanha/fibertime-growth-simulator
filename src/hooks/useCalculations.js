import { useMemo } from 'react';
import {
  FIXED_AGENCY_FEE,
  AGENCY_FEE_THRESHOLD,
  AGENCY_FEE_PERCENTAGE,
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
    retargetingPercent,
    baseCPL,
    conversionRate,
    usageDays,
    pricePerDay,
    retentionMonth2,
    retentionMonth3,
    retentionMonth4,
    retentionMonth5,
    retentionMonth6,
    retentionMonth7,
    retentionMonth8,
    retentionMonth9,
    retentionMonth10,
    retentionMonth11,
    retentionMonth12,
    contentCosts,
    otherOverheads,
    // Spend scaling inputs
    spendIncreaseMonth2,
    spendIncreaseMonth3,
    spendIncreaseMonth4,
    spendIncreaseMonth5,
    spendIncreaseMonth6,
    spendIncreaseMonth7,
    spendIncreaseMonth8,
    spendIncreaseMonth9,
    spendIncreaseMonth10,
    spendIncreaseMonth11,
    spendIncreaseMonth12,
    cplCorrelation,
  } = inputs;

  return useMemo(() => {
    // Step 1: Build spend increase array for each month
    const spendIncreases = [
      0, // Month 1 (baseline, no increase)
      spendIncreaseMonth2,
      spendIncreaseMonth3,
      spendIncreaseMonth4,
      spendIncreaseMonth5,
      spendIncreaseMonth6,
      spendIncreaseMonth7,
      spendIncreaseMonth8,
      spendIncreaseMonth9,
      spendIncreaseMonth10,
      spendIncreaseMonth11,
      spendIncreaseMonth12,
    ];

    // Step 2: Calculate monthly spend for each month (cumulative scaling)
    const monthlySpendArray = [];
    let currentSpend = monthlySpend;
    for (let i = 0; i < 12; i++) {
      monthlySpendArray.push(currentSpend);
      if (i < 11) { // Don't scale after month 12
        currentSpend = currentSpend * (1 + spendIncreases[i + 1] / 100);
      }
    }

    // Step 3: Calculate CPL for each month (scales with spend based on correlation)
    const cplArray = [];
    let currentCPL = baseCPL;
    for (let i = 0; i < 12; i++) {
      cplArray.push(currentCPL);
      if (i < 11) { // Don't scale after month 12
        const spendIncreasePct = spendIncreases[i + 1] / 100;
        const cplIncreasePct = spendIncreasePct * (cplCorrelation / 100);
        currentCPL = currentCPL * (1 + cplIncreasePct);
      }
    }

    // Step 4: For backwards compatibility, keep initial values for first month
    const acquisitionSpend = monthlySpendArray[0] * (1 - retargetingPercent / 100);
    const retargetingSpend = monthlySpendArray[0] * (retargetingPercent / 100);

    // Step 5: Calculate nCAC (net Customer Acquisition Cost) for Month 1
    const nCAC = cplArray[0] / (conversionRate / 100);

    // Step 6: Calculate new users per month for Month 1 (for sidebar display)
    const newUsersPerMonth = acquisitionSpend / nCAC;

    // Step 7: Build retention curve (Month 1 is always 100%, then user-defined rates)
    const retentionCurve = [
      100, // Month 1 (always 100%)
      retentionMonth2,
      retentionMonth3,
      retentionMonth4,
      retentionMonth5,
      retentionMonth6,
      retentionMonth7,
      retentionMonth8,
      retentionMonth9,
      retentionMonth10,
      retentionMonth11,
      retentionMonth12,
    ];

    // Step 8: Calculate revenue per user per month
    const revenuePerUserPerMonth = usageDays * pricePerDay;

    // Step 9: Calculate LTV as sum of expected revenue across retention curve
    const ltv = retentionCurve.reduce((sum, retention) => {
      return sum + (retention / 100) * revenuePerUserPerMonth;
    }, 0);

    // Step 10: Calculate new users per month for each month (using scaled spend/CPL)
    const newUsersPerMonthArray = [];
    for (let i = 0; i < 12; i++) {
      const monthSpend = monthlySpendArray[i];
      const monthCPL = cplArray[i];
      const monthAcquisitionSpend = monthSpend * (1 - retargetingPercent / 100);
      const monthNCAC = monthCPL / (conversionRate / 100);
      const monthNewUsers = monthAcquisitionSpend / monthNCAC;
      newUsersPerMonthArray.push(monthNewUsers);
    }

    // Step 11: Track all cohorts and their retention over time (with month-specific new users)
    const cohortData = [];
    
    for (let startMonth = 0; startMonth < 12; startMonth++) {
      const cohort = {
        month: startMonth + 1,
        initialUsers: newUsersPerMonthArray[startMonth],
        monthlyUsers: [] // Users from this cohort in each subsequent month
      };
      
      for (let currentMonth = startMonth; currentMonth < 12; currentMonth++) {
        const monthsElapsed = currentMonth - startMonth;
        const retentionRate = retentionCurve[monthsElapsed] / 100;
        const activeUsers = newUsersPerMonthArray[startMonth] * retentionRate;
        cohort.monthlyUsers.push({
          month: currentMonth + 1,
          users: activeUsers,
          retentionRate: retentionCurve[monthsElapsed]
        });
      }
      
      cohortData.push(cohort);
    }
    
    // Step 12: Calculate total active users per month (sum of all cohorts with month-specific acquisitions)
    const totalUsersArray = [];
    for (let month = 0; month < 12; month++) {
      let totalActive = 0;
      // Sum users from all cohorts that have started by this month
      for (let cohortIdx = 0; cohortIdx <= month; cohortIdx++) {
        const monthsElapsed = month - cohortIdx;
        totalActive += newUsersPerMonthArray[cohortIdx] * (retentionCurve[monthsElapsed] / 100);
      }
      totalUsersArray.push(totalActive);
    }

    // Helper function to calculate month metrics (with month-specific values)
    const calculateMonth = (monthNumber, totalUsers, monthSpend, monthCPL, monthNewUsers) => {
      const revenue = totalUsers * usageDays * pricePerDay;
      
      // Month-specific acquisition and retargeting spend
      const monthAcquisitionSpend = monthSpend * (1 - retargetingPercent / 100);
      const monthRetargetingSpend = monthSpend * (retargetingPercent / 100);
      
      // Dynamic agency fee: R120k fixed OR 20% of ad spend if spend > R600k
      const agencyFee = monthSpend > AGENCY_FEE_THRESHOLD 
        ? monthSpend * AGENCY_FEE_PERCENTAGE 
        : FIXED_AGENCY_FEE;
      
      // Marketing overheads (combined content costs + other overheads)
      const marketingOverheads = contentCosts + otherOverheads;
      
      // Combined agency fee + marketing overheads
      const agencyAndMarketing = agencyFee + marketingOverheads;
      
      // Total amount spent (all costs)
      const totalAmountSpent = monthSpend + agencyFee + marketingOverheads;
      
      // Acquisition metrics (using month-specific CPL and spend)
      // Round CPL to nearest 10 cents for better visibility
      const cpl = Math.round(monthCPL / 0.10) * 0.10;
      const totalLeads = monthAcquisitionSpend / monthCPL;
      const conversionRatio = conversionRate;
      const totalCustomers = monthNewUsers;
      
      // Revenue metrics
      const revenuePerUser = usageDays * pricePerDay;
      
      // All-in costs (includes agency fee + marketing overheads)
      const totalCostAllIn = monthSpend + agencyFee + marketingOverheads;
      const profitAllIn = revenue - totalCostAllIn;
      
      // Digital-only costs (excludes agency fee, includes marketing overheads)
      const totalCostDigital = monthSpend + marketingOverheads;
      const profitDigital = revenue - totalCostDigital;

      return {
        month: monthNumber,
        spend: monthSpend,
        retargetingSpend: monthRetargetingSpend,
        acquisitionSpend: monthAcquisitionSpend,
        agencyFee,
        marketingOverheads,
        agencyAndMarketing,
        contentCosts,
        otherOverheads,
        totalAmountSpent,
        cpl,
        totalLeads,
        conversionRatio,
        totalCustomers,
        revenuePerUser,
        revenue,
        profit: profitAllIn,
        // Legacy fields for backwards compatibility
        newUsers: monthNewUsers,
        totalUsers,
        totalCost: totalCostAllIn,
        profitDigital,
        totalCostDigital,
      };
    };

    // Calculate all 12 months (with month-specific spend, CPL, and new users)
    const allMonthlyData = totalUsersArray.map((totalUsers, index) => 
      calculateMonth(
        index + 1,
        totalUsers,
        monthlySpendArray[index],
        cplArray[index],
        newUsersPerMonthArray[index]
      )
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
    // Use Month 1 values for KPI display
    const month1Spend = monthlySpendArray[0];
    const month1AcquisitionSpend = month1Spend * (1 - retargetingPercent / 100);
    const month1NewUsers = newUsersPerMonthArray[0];
    
    // Digital nCAC (excludes agency fee, includes content costs only)
    const digitalNCAC = (month1AcquisitionSpend + contentCosts) / month1NewUsers;
    
    // All-In nCAC (includes agency fee + content costs, excludes other overheads)
    const currentAgencyFee = month1Spend > AGENCY_FEE_THRESHOLD 
      ? month1Spend * AGENCY_FEE_PERCENTAGE 
      : FIXED_AGENCY_FEE;
    const allInNCAC = (month1Spend + currentAgencyFee + contentCosts) / month1NewUsers;

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
        
        // LTV metric
        ltv,
        
        // Revenue and LTV:nCAC ratios
        revenuePerUserPerMonth: usageDays * pricePerDay,
        oneMonthLTVToNCAC: (usageDays * pricePerDay) / allInNCAC,
        totalLTVToNCAC: ltv / allInNCAC,
      },

      // Chart-ready data
      chartData,
      
      // Cohort tracking data for cohort analysis table
      cohortData,
    };
  }, [
    monthlySpend, retargetingPercent, baseCPL, conversionRate, usageDays, pricePerDay,
    retentionMonth2, retentionMonth3, retentionMonth4, retentionMonth5, retentionMonth6,
    retentionMonth7, retentionMonth8, retentionMonth9, retentionMonth10, retentionMonth11, retentionMonth12,
    contentCosts, otherOverheads,
    spendIncreaseMonth2, spendIncreaseMonth3, spendIncreaseMonth4, spendIncreaseMonth5, spendIncreaseMonth6,
    spendIncreaseMonth7, spendIncreaseMonth8, spendIncreaseMonth9, spendIncreaseMonth10, spendIncreaseMonth11, spendIncreaseMonth12,
    cplCorrelation
  ]);
}
