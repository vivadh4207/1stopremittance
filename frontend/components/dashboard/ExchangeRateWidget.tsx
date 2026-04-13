'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { exchangeRatesApi } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import type { ExchangeRate } from '@/types';

const CORRIDORS = [
  { from: 'USD', to: 'KES', flag: '🇰🇪', country: 'Kenya' },
  { from: 'USD', to: 'GHS', flag: '🇬🇭', country: 'Ghana' },
  { from: 'USD', to: 'NGN', flag: '🇳🇬', country: 'Nigeria' },
  { from: 'USD', to: 'PHP', flag: '🇵🇭', country: 'Philippines' },
  { from: 'USD', to: 'INR', flag: '🇮🇳', country: 'India' },
  { from: 'USD', to: 'MXN', flag: '🇲🇽', country: 'Mexico' },
];

export function ExchangeRateWidget() {
  const [rates, setRates] = useState<Record<string, ExchangeRate>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled(
        CORRIDORS.map((c) => exchangeRatesApi.getRate(c.from, c.to)),
      );
      const newRates: Record<string, ExchangeRate> = {};
      results.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value.data.success) {
          const key = `${CORRIDORS[i].from}-${CORRIDORS[i].to}`;
          newRates[key] = result.value.data.data!;
        }
      });
      setRates(newRates);
      setLastUpdated(new Date());
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Live Rates</h3>
          {lastUpdated && (
            <p className="text-xs text-gray-400">Updated {formatRelativeTime(lastUpdated)}</p>
          )}
        </div>
        <button
          onClick={fetchRates}
          disabled={isLoading}
          className="rounded-lg p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && Object.keys(rates).length === 0 ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-2">
          {CORRIDORS.map((c) => {
            const key = `${c.from}-${c.to}`;
            const rate = rates[key];
            return (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{c.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {c.from} → {c.to}
                    </p>
                    <p className="text-xs text-gray-400">{c.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rate ? (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {rate.rate.toFixed(2)}
                      </p>
                      <p className="flex items-center gap-0.5 text-xs text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        Live
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                  <Link href="/send">
                    <button className="rounded-full p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
