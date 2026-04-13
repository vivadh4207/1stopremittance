'use client';

import React, { useEffect } from 'react';
import { Send, CheckCircle, Clock } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ExchangeRateWidget } from '@/components/dashboard/ExchangeRateWidget';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickSendCard } from '@/components/dashboard/QuickSendCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useWallet } from '@/hooks/useWallet';
import { useTransfers } from '@/hooks/useTransfers';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { wallet, isLoading: walletLoading } = useWallet();
  const { transfers, isLoading: transfersLoading, refetch } = useTransfers();
  const { user } = useAuth();

  useEffect(() => {
    refetch({ limit: 5 });
  }, [refetch]);

  const pending = transfers.filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING').length;
  const completed = transfers.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName}! 👋
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here&apos;s your financial overview
        </p>
      </div>

      {/* Balance + Quick stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BalanceCard wallet={wallet} isLoading={walletLoading} />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatsCard
            title="Pending Transfers"
            value={pending}
            icon={<Clock className="h-5 w-5 text-yellow-600" />}
            iconBg="bg-yellow-100"
            isLoading={transfersLoading}
          />
          <StatsCard
            title="Completed"
            value={completed}
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            iconBg="bg-green-100"
            change={12}
            isLoading={transfersLoading}
          />
          <StatsCard
            title="Total Sent"
            value={`$${transfers.reduce((sum, t) => sum + Number(t.sendAmount), 0).toFixed(0)}`}
            icon={<Send className="h-5 w-5 text-primary-600" />}
            iconBg="bg-primary-100"
            isLoading={transfersLoading}
          />
          <StatsCard
            title="Countries Sent"
            value={new Set(transfers.map((t) => t.recipientCountry)).size}
            icon={<span className="text-lg">🌍</span>}
            iconBg="bg-purple-100"
            isLoading={transfersLoading}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentTransactions transfers={transfers} isLoading={transfersLoading} />
        </div>
        <div className="space-y-6">
          <QuickSendCard />
          <ExchangeRateWidget />
        </div>
      </div>
    </div>
  );
}
