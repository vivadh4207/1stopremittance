'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SendMoneyForm } from '@/components/forms/SendMoneyForm';

export default function SendPage() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const to = searchParams.get('to');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Send Money</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Transfer money internationally with great rates
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <SendMoneyForm
          initialAmount={amount ? Number(amount) : undefined}
          initialCountry={to || undefined}
        />
      </div>
    </div>
  );
}
