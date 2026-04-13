'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { Users, ArrowUpRight, DollarSign, TrendingUp } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { AdminStats } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then(({ data }) => {
        if (data.success && data.data) setStats(data.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Platform-wide statistics</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100"
          change={8}
        />
        <StatsCard
          title="Total Transfers"
          value={stats?.totalTransfers ?? 0}
          icon={<ArrowUpRight className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-100"
          change={15}
        />
        <StatsCard
          title="Total Volume"
          value={formatCurrency(stats?.totalVolume ?? 0)}
          icon={<DollarSign className="h-5 w-5 text-primary-600" />}
          iconBg="bg-primary-100"
          change={22}
        />
        <StatsCard
          title="Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-100"
          change={18}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Area chart */}
        <Card
          className="lg:col-span-2"
          header={
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Transfer Volume (Last 30 Days)
            </h3>
          }
        >
          {stats?.transfersByDay && stats.transfersByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats.transfersByDay}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatDate(v)}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Volume']}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </Card>

        {/* Bar chart - top corridors */}
        <Card
          header={
            <h3 className="font-semibold text-gray-900 dark:text-white">Top Corridors</h3>
          }
        >
          {stats?.topCorridors && stats.topCorridors.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.topCorridors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="corridor" type="category" tick={{ fontSize: 10 }} width={60} />
                <Tooltip formatter={(value: number) => [value, 'Transfers']} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </Card>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500">Pending KYC</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{stats?.pendingKYC ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{stats?.activeUsers ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500">Avg Transfer</p>
          <p className="mt-1 text-2xl font-bold text-primary-600">
            {stats?.totalTransfers
              ? formatCurrency((stats.totalVolume || 0) / stats.totalTransfers)
              : '$0.00'}
          </p>
        </div>
      </div>
    </div>
  );
}
