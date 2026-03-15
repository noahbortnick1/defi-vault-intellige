import type { VaultFinancials, PortfolioFinancials } from './types';
import { getVaultFinancials, getPortfolioFinancials } from './financialData';

export const financialApi = {
  getVaultFinancials: async (vaultAddress: string): Promise<VaultFinancials | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getVaultFinancials(vaultAddress);
  },

  getVaultNav: async (vaultAddress: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const financials = getVaultFinancials(vaultAddress);
    if (!financials) return null;
    
    return {
      vaultAddress,
      asOfDate: financials.balanceSheet.asOfDate,
      netAssets: financials.balanceSheet.netAssets,
      sharesOutstanding: financials.balanceSheet.sharesOutstanding,
      navPerShare: financials.balanceSheet.navPerShare,
      priorNavPerShare: financials.navHistory[financials.navHistory.length - 2]?.navPerShare || financials.balanceSheet.navPerShare,
      change: financials.balanceSheet.navPerShare - (financials.navHistory[financials.navHistory.length - 2]?.navPerShare || financials.balanceSheet.navPerShare)
    };
  },

  getVaultIncome: async (vaultAddress: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const financials = getVaultFinancials(vaultAddress);
    if (!financials) return null;
    
    return {
      vaultAddress,
      periodStart: financials.incomeStatement.periodStart,
      periodEnd: financials.incomeStatement.periodEnd,
      revenue: {
        lendingIncome: financials.incomeStatement.lendingIncome,
        incentiveIncome: financials.incomeStatement.incentiveIncome,
        tradingFeeIncome: financials.incomeStatement.tradingFeeIncome,
        stakingIncome: financials.incomeStatement.stakingIncome,
        totalRevenue: financials.incomeStatement.lendingIncome + 
                      financials.incomeStatement.incentiveIncome + 
                      financials.incomeStatement.tradingFeeIncome + 
                      financials.incomeStatement.stakingIncome
      },
      expenses: {
        borrowCost: financials.incomeStatement.borrowCost,
        gasCost: financials.incomeStatement.gasCost,
        managementFees: financials.incomeStatement.managementFees,
        performanceFees: financials.incomeStatement.performanceFees,
        totalExpenses: financials.incomeStatement.borrowCost + 
                       financials.incomeStatement.gasCost + 
                       financials.incomeStatement.managementFees + 
                       financials.incomeStatement.performanceFees
      },
      netIncome: financials.incomeStatement.netIncome
    };
  },

  getVaultFlows: async (vaultAddress: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const financials = getVaultFinancials(vaultAddress);
    if (!financials) return null;
    
    return {
      vaultAddress,
      periodStart: financials.flowOfFunds.periodStart,
      periodEnd: financials.flowOfFunds.periodEnd,
      deposits: financials.flowOfFunds.deposits,
      withdrawals: financials.flowOfFunds.withdrawals,
      rewardsClaimed: financials.flowOfFunds.rewardsClaimed,
      rebalanceVolume: financials.flowOfFunds.rebalanceVolume,
      netFlow: financials.flowOfFunds.netFlow
    };
  },

  getPortfolioFinancials: async (walletAddress: string): Promise<PortfolioFinancials> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getPortfolioFinancials(walletAddress);
  }
};
