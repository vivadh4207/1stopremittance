'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDateTime, getCountryFlag } from '@/lib/utils';
import type { Transfer } from '@/types';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];

export default function AdminTransactionsPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .getTransactions({
        page,
        limit,
        status: status === 'ALL' ? undefined : status,
      })
      .then(({ data }) => {
        if (data.success) {
          setTransfers(data.data ?? []);
          setTotal(data.pagination?.total ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page, status]);

  const filtered = search
    ? transfers.filter((t) =>
        `${t.recipientFirstName} ${t.recipientLastName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : transfers;

  const columns = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (val: unknown) => (
        <span className="text-xs text-gray-500">{formatDateTime(String(val))}</span>
      ),
    },
    {
      key: 'senderId',
      header: 'Sender ID',
      render: (val: unknown) => (
        <span className="text-xs font-mono text-gray-600">{String(val).slice(0, 8)}...</span>
      ),
    },
    {
      key: 'recipientFirstName',
      header: 'Recipient',
      render: (_: unknown, row: Transfer) => (
        <span>
          {getCountryFlag(row.recipientCountry)} {row.recipientFirstName} {row.recipientLastName}
        </span>
      ),
    },
    {
      key: 'sendAmount',
      header: 'Sent',
      render: (val: unknown, row: Transfer) =>
        formatCurrency(Number(val), row.sendCurrency),
    },
    {
      key: 'receiveAmount',
      header: 'Received',
      render: (val: unknown, row: Transfer) =>
        formatCurrency(Number(val), row.receiveCurrency),
    },
    {
      key: 'fee',
      header: 'Fee',
      render: (val: unknown) => formatCurrency(Number(val)),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val: unknown) => <StatusBadge status={String(val)} />,
    },
  ] as Parameters<typeof Table>[0]['columns'];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Transfers</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{total} total transfers</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                status === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        emptyMessage="No transfers found"
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
