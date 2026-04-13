'use client';

import { useState, useEffect, useCallback } from 'react';
import { walletApi } from '@/lib/api';
import type { Wallet, Transaction } from '@/types';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [walletRes, txRes] = await Promise.all([
        walletApi.getWallet(),
        walletApi.getTransactions({ limit: 10 }),
      ]);
      if (walletRes.data.success) setWallet(walletRes.data.data ?? null);
      if (txRes.data.success) setTransactions(txRes.data.data ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load wallet';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const fundWallet = useCallback(
    async (amount: number, currency: string, paymentMethodId: string) => {
      const { data } = await walletApi.fundWallet({ amount, currency, paymentMethodId });
      if (data.success && data.data) {
        setWallet(data.data);
      }
    },
    [],
  );

  return { wallet, transactions, isLoading, error, refetch: fetchWallet, fundWallet };
}
