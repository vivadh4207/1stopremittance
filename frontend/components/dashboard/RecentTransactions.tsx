'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatRelativeTime, getCountryFlag } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import type { Transfer } from '@/types';

interface RecentTransactionsProps {
  transfers: Transfer[];
  isLoading: boolean;
}

export function RecentTransactions({ transfers, isLoading }: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Recent Transfers
        </h3>
        <Link
          href="/transactions"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : transfers.length === 0 ? (
        <div className="py-8 text-center">
          <ArrowUpRight className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No transfers yet</p>
          <Link href="/send" className="mt-2 inline-block text-sm text-primary-600 hover:underline">
            Send your first transfer
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transfers.slice(0, 5).map((transfer) => (
            <div
              key={transfer.id}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <ArrowUpRight className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {getCountryFlag(transfer.recipientCountry)}{' '}
                  {transfer.recipientFirstName} {transfer.recipientLastName}
                </p>
                <p className="text-xs text-gray-400">{formatRelativeTime(transfer.createdAt)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  -{formatCurrency(transfer.sendAmount, transfer.sendCurrency)}
                </p>
                <div className="mt-0.5 flex justify-end">
                  <StatusBadge status={transfer.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
