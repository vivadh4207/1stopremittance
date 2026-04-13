'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { useTransfers } from '@/hooks/useTransfers';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDateTime, getCountryFlag } from '@/lib/utils';
import type { Transfer } from '@/types';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];

export default function TransactionsPage() {
  const { transfers, total, isLoading, refetch } = useTransfers();
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transfer | null>(null);
  const limit = 10;

  useEffect(() => {
    refetch({ page, limit, status: status === 'ALL' ? undefined : status });
  }, [page, status, refetch]);

  const filtered = search
    ? transfers.filter((t) =>
        `${t.recipientFirstName} ${t.recipientLastName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : transfers;

  const totalPages = Math.ceil(total / limit);

  const columns = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (val: unknown) => (
        <span className="text-xs text-gray-500">{formatDateTime(String(val))}</span>
      ),
    },
    {
      key: 'recipientFirstName',
      header: 'Recipient',
      render: (_: unknown, row: Transfer) => (
        <div>
          <p className="font-medium">
            {getCountryFlag(row.recipientCountry)} {row.recipientFirstName} {row.recipientLastName}
          </p>
          <p className="text-xs text-gray-400">{row.recipientCountry}</p>
        </div>
      ),
    },
    {
      key: 'sendAmount',
      header: 'Sent',
      render: (val: unknown, row: Transfer) => (
        <span className="font-medium">{formatCurrency(Number(val), row.sendCurrency)}</span>
      ),
    },
    {
      key: 'receiveAmount',
      header: 'Received',
      render: (val: unknown, row: Transfer) => (
        <span className="text-green-600 font-medium">
          {formatCurrency(Number(val), row.receiveCurrency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val: unknown) => <StatusBadge status={String(val)} />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_: unknown, row: Transfer) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye className="h-3.5 w-3.5" />}
          onClick={() => setSelected(row)}
        >
          View
        </Button>
      ),
    },
  ] as Parameters<typeof Table>[0]['columns'];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{total} total transfers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by recipient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
        data={filtered as Record<string, unknown>[]}
        isLoading={isLoading}
        emptyMessage="No transactions found"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Transfer Details"
        size="lg"
      >
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Transfer ID', value: selected.id },
                { label: 'Status', value: <StatusBadge status={selected.status} /> },
                { label: 'Recipient', value: `${selected.recipientFirstName} ${selected.recipientLastName}` },
                { label: 'Country', value: `${getCountryFlag(selected.recipientCountry)} ${selected.recipientCountry}` },
                { label: 'Bank', value: selected.recipientBankName || '—' },
                { label: 'Account', value: selected.recipientAccountNumber || '—' },
                { label: 'Amount Sent', value: formatCurrency(selected.sendAmount, selected.sendCurrency) },
                { label: 'Amount Received', value: formatCurrency(selected.receiveAmount, selected.receiveCurrency) },
                { label: 'Exchange Rate', value: String(selected.exchangeRate) },
                { label: 'Fee', value: formatCurrency(selected.fee) },
                { label: 'Total Deducted', value: formatCurrency(selected.totalDeducted) },
                { label: 'Created', value: formatDateTime(selected.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
