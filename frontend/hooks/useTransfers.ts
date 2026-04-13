'use client';

import { useState, useCallback } from 'react';
import { transfersApi } from '@/lib/api';
import type { Transfer, TransferQuote, SendMoneyFormData } from '@/types';

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchTransfers = useCallback(
    async (params?: { page?: number; limit?: number; status?: string }) => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await transfersApi.getTransfers(params);
        if (data.success) {
          setTransfers(data.data ?? []);
          setTotal(data.pagination?.total ?? 0);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load transfers';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getQuote = useCallback(
    async (params: {
      sendAmount: number;
      sendCurrency: string;
      receiveCurrency: string;
      recipientCountry: string;
    }): Promise<TransferQuote> => {
      const { data } = await transfersApi.getQuote(params);
      if (data.success && data.data) return data.data;
      throw new Error(data.error || 'Failed to get quote');
    },
    [],
  );

  const sendMoney = useCallback(
    async (formData: Partial<SendMoneyFormData> & { paymentMethodId?: string }): Promise<Transfer> => {
      const { data } = await transfersApi.sendMoney(formData);
      if (data.success && data.data) return data.data;
      throw new Error(data.error || 'Transfer failed');
    },
    [],
  );

  return { transfers, total, isLoading, error, refetch: fetchTransfers, getQuote, sendMoney };
}
