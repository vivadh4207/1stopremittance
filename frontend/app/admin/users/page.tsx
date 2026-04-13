'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types';

const KYC_OPTIONS = ['ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [kycFilter, setKycFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .getUsers({
        page,
        limit,
        kycStatus: kycFilter === 'ALL' ? undefined : kycFilter,
        search: search || undefined,
      })
      .then(({ data }) => {
        if (data.success) {
          setUsers(data.data ?? []);
          setTotal(data.pagination?.total ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page, kycFilter, search]);

  const columns = [
    {
      key: 'firstName',
      header: 'Name',
      render: (_: unknown, row: User) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      ),
    },
    { key: 'country', header: 'Country' },
    {
      key: 'kycStatus',
      header: 'KYC Status',
      render: (val: unknown) => <StatusBadge status={String(val)} />,
    },
    {
      key: 'role',
      header: 'Role',
      render: (val: unknown) => (
        <span className={`text-xs font-medium ${val === 'ADMIN' ? 'text-purple-600' : 'text-gray-600'}`}>
          {String(val)}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (val: unknown) => (
        <span className={`text-xs font-medium ${val ? 'text-green-600' : 'text-red-500'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (val: unknown) => (
        <span className="text-xs text-gray-400">{formatDate(String(val))}</span>
      ),
    },
  ] as Parameters<typeof Table>[0]['columns'];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{total} total users</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {KYC_OPTIONS.map((k) => (
            <button
              key={k}
              onClick={() => { setKycFilter(k); setPage(1); }}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                kycFilter === k
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <Table
        columns={columns}
        data={users as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        emptyMessage="No users found"
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
