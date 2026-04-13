'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { Wallet } from '@/types';

interface BalanceCardProps {
  wallet: Wallet | null;
  isLoading: boolean;
}

export function BalanceCard({ wallet, isLoading }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  if (isLoading) {
    return (
      <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-purple-700">
        <Spinner size="lg" className="text-white" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-6 text-white shadow-lg">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -right-4 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary-200">Available Balance</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-4xl font-bold tracking-tight">
                {showBalance
                  ? formatCurrency(wallet?.balance ?? 0, wallet?.currency ?? 'USD')
                  : '••••••'}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="rounded p-1 text-primary-200 hover:text-white transition-colors"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-1.5 text-sm font-semibold">
            {wallet?.currency ?? 'USD'}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs text-primary-200">
            Reserved:{' '}
            <span className="font-medium text-white">
              {formatCurrency(wallet?.reservedBalance ?? 0, wallet?.currency ?? 'USD')}
            </span>
          </p>
          {wallet?.id && (
            <p className="mt-1 text-xs text-primary-300">
              Account: {wallet.id.slice(0, 8).toUpperCase()}
            </p>
          )}
        </div>

        <div className="mt-5">
          <Link href="/send">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-white text-primary-700 hover:bg-primary-50"
            >
              Send Money
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
