'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { formatCurrency } from '@/lib/utils';
import { SUPPORTED_COUNTRIES } from '@/lib/utils';

const schema = z.object({
  sendAmount: z.coerce.number().positive('Amount must be positive'),
  recipientCountry: z.string().min(1, 'Select a country'),
});

type FormValues = z.infer<typeof schema>;

export function QuickSendCard() {
  const [recipientCountry, setRecipientCountry] = useState('KE');
  const receiveCurrency =
    SUPPORTED_COUNTRIES.find((c) => c.code === recipientCountry)?.currency || 'KES';

  const { rate } = useExchangeRate('USD', receiveCurrency);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sendAmount: 100, recipientCountry: 'KE' },
  });

  const sendAmount = watch('sendAmount') || 0;
  const receiveAmount = rate ? sendAmount * rate.rate : 0;

  const countryOptions = SUPPORTED_COUNTRIES.map((c) => ({
    value: c.code,
    label: `${c.name} (${c.currency})`,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Quick Send</h3>
      <form onSubmit={handleSubmit(() => {})} className="space-y-3">
        <Input
          label="You send (USD)"
          type="number"
          min="1"
          step="0.01"
          error={errors.sendAmount?.message}
          {...register('sendAmount')}
        />
        <Select
          label="To country"
          options={countryOptions}
          value={recipientCountry}
          onChange={(e) => setRecipientCountry(e.target.value)}
          {...register('recipientCountry')}
        />

        {rate && receiveAmount > 0 && (
          <div className="rounded-lg bg-primary-50 p-3 dark:bg-primary-900/20">
            <p className="text-xs text-primary-700 dark:text-primary-400">
              Recipient gets:{' '}
              <span className="font-bold">
                {formatCurrency(receiveAmount, receiveCurrency)}
              </span>
            </p>
            <p className="text-xs text-primary-500">
              Rate: 1 USD = {rate.rate.toFixed(4)} {receiveCurrency}
            </p>
          </div>
        )}

        <Link href={`/send?amount=${sendAmount}&to=${recipientCountry}`} className="block">
          <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Send Now
          </Button>
        </Link>
      </form>
    </div>
  );
}
