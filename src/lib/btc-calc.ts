import { BtcMarketData, DcaCalculationParams, DcaCalculationResult, LumpSumCalculationParams, LumpSumCalculationResult } from './types';

export const SATS_PER_BTC = 100_000_000;

export const DEFAULT_MARKET_DATA: BtcMarketData = {
  priceUsd: 91450,
  change24h: 2.34,
  high24h: 92380,
  low24h: 89120,
  marketCapUsd: 1810000000000,
  volume24hUsd: 38500000000,
  blockHeight: 887450,
  mempoolFeeSatPerVb: 14,
  lastUpdated: '2026-09-12T00:00:00.000Z', // Static default to prevent SSR hydration mismatch
};

/**
 * Converts a Bitcoin amount to Satoshis.
 */
export function btcToSats(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

/**
 * Converts Satoshis to a Bitcoin amount.
 */
export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

/**
 * Formats a USD amount nicely ($1,234.56).
 */
export function formatUsd(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Formats a BTC amount with up to 8 decimal places.
 */
export function formatBtc(btc: number, maxDecimals: number = 8): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: maxDecimals,
  }).format(btc);
}

/**
 * Formats Satoshis with thousand separators.
 */
export function formatSats(sats: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(sats));
}

/**
 * Calculates Lump-sum investment metrics with 30% to 50% interest yield.
 */
export function calculateLumpSum(params: LumpSumCalculationParams): LumpSumCalculationResult {
  const { amountInvestedUsd, currentPriceUsd } = params;
  const durationMonths = params.durationMonths || 12;
  const annualInterestPercent = Math.min(50, Math.max(30, params.annualInterestPercent ?? 40));
  const btcPrice = currentPriceUsd > 0 ? currentPriceUsd : DEFAULT_MARKET_DATA.priceUsd;

  if (amountInvestedUsd <= 0) {
    return {
      btcReceived: 0,
      satsReceived: 0,
      currentValueUsd: 0,
      unrealizedProfitLossUsd: 0,
      unrealizedProfitLossPercent: 0,
      annualInterestPercent,
      durationMonths,
    };
  }

  // Calculate interest where a 6-month term delivers the full targeted 30% to 50% interest
  const rateFraction = annualInterestPercent / 100;
  const cycles = Math.max(1, durationMonths / 6);
  const currentValueUsd = amountInvestedUsd * (1 + rateFraction * cycles);
  const unrealizedProfitLossUsd = currentValueUsd - amountInvestedUsd;
  const unrealizedProfitLossPercent = (unrealizedProfitLossUsd / amountInvestedUsd) * 100;

  const btcReceived = currentValueUsd / btcPrice;
  const satsReceived = btcToSats(btcReceived);

  return {
    btcReceived,
    satsReceived,
    currentValueUsd,
    unrealizedProfitLossUsd,
    unrealizedProfitLossPercent,
    annualInterestPercent,
    durationMonths,
  };
}

/**
 * Calculates a Managed Recurring Deposit (DCA) simulation with 30% to 50% interest yield.
 * Models capital deployment into Starknet ZK-vaults earning targeted annual yield.
 */
export function calculateDca(params: DcaCalculationParams): DcaCalculationResult {
  const { amountUsd, frequency, durationMonths } = params;
  const currentPrice = params.customBtcPrice || DEFAULT_MARKET_DATA.priceUsd;
  const annualInterestPercent = Math.min(50, Math.max(30, params.annualInterestPercent ?? 40));
  const annualRate = annualInterestPercent / 100;

  let intervalsCount = 0;
  let intervalDays = 7;

  switch (frequency) {
    case 'daily':
      intervalsCount = Math.round(durationMonths * 30.4);
      intervalDays = 1;
      break;
    case 'weekly':
      intervalsCount = Math.round((durationMonths * 52) / 12);
      intervalDays = 7;
      break;
    case 'biweekly':
      intervalsCount = Math.round((durationMonths * 26) / 12);
      intervalDays = 14;
      break;
    case 'monthly':
      intervalsCount = durationMonths;
      intervalDays = 30;
      break;
  }

  if (intervalsCount <= 0) intervalsCount = 1;

  let cumulativeInvested = 0;
  let cumulativeValue = 0;
  const totalCycles = Math.max(1, durationMonths / 6);
  const breakdown = [];

  for (let i = 1; i <= intervalsCount; i++) {
    cumulativeInvested += amountUsd;

    // Each interval's capital earns the targeted vault interest for its active duration
    const depositActiveCycles = ((intervalsCount - i + 1) / intervalsCount) * totalCycles;
    const valueOfThisDeposit = amountUsd * (1 + annualRate * depositActiveCycles);
    cumulativeValue += valueOfThisDeposit;

    if (intervalsCount <= 12 || i % Math.max(1, Math.floor(intervalsCount / 10)) === 0 || i === intervalsCount) {
      breakdown.push({
        period: i,
        dateLabel: `Month ${Math.min(durationMonths, Math.ceil((i * intervalDays) / 30.4))}`,
        investedCumulativeUsd: cumulativeInvested,
        btcAccumulatedCumulative: cumulativeValue / currentPrice,
        portfolioValueUsd: cumulativeValue,
      });
    }
  }

  const currentPortfolioValueUsd = cumulativeValue;
  const unrealizedProfitLossUsd = currentPortfolioValueUsd - cumulativeInvested;
  const unrealizedProfitLossPercent = cumulativeInvested > 0 ? (unrealizedProfitLossUsd / cumulativeInvested) * 100 : 0;
  const totalBtcAccumulated = currentPortfolioValueUsd / currentPrice;
  const averagePurchasePriceUsd = totalBtcAccumulated > 0 ? cumulativeInvested / totalBtcAccumulated : currentPrice;

  return {
    totalInvestedUsd: cumulativeInvested,
    totalBtcAccumulated,
    totalSatsAccumulated: btcToSats(totalBtcAccumulated),
    averagePurchasePriceUsd,
    currentPortfolioValueUsd,
    unrealizedProfitLossUsd,
    unrealizedProfitLossPercent,
    annualInterestPercent,
    breakdown,
  };
}
