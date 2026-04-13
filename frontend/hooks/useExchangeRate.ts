'use client';

import { useState, useEffect, useRef } from 'react';
import { exchangeRatesApi } from '@/lib/api';
import type { ExchangeRate } from '@/types';

export function useExchangeRate(from: string, to: string) {
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!from || !to || from === to) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await exchangeRatesApi.getRate(from, to);
        if (data.success && data.data) {
          setRate(data.data);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch rate';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [from, to]);

  return { rate, isLoading, error };
}
