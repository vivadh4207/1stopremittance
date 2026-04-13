import { config } from '../config/env';

export interface FeeBreakdown {
  fee: number;
  percentageFee: number;
  flatFee: number;
  feePercentage: number;
}

export function calculateFee(amount: number): FeeBreakdown {
  const feePercentage = config.fee.percentage;
  const flatFee = config.fee.flat;
  const percentageFee = (amount * feePercentage) / 100;
  const fee = percentageFee + flatFee;

  return {
    fee: Math.round(fee * 100) / 100,
    percentageFee: Math.round(percentageFee * 100) / 100,
    flatFee,
    feePercentage,
  };
}
