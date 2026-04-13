'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ChevronLeft, Check, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useTransfers } from '@/hooks/useTransfers';
import { formatCurrency, SUPPORTED_COUNTRIES } from '@/lib/utils';
import type { TransferQuote, Transfer } from '@/types';

const step1Schema = z.object({
  sendAmount: z.coerce.number().min(1, 'Amount must be at least $1'),
  sendCurrency: z.string().default('USD'),
  recipientCountry: z.string().min(1, 'Select a country'),
  receiveCurrency: z.string().min(1),
});

const step2Schema = z.object({
  recipientFirstName: z.string().min(2, 'Required'),
  recipientLastName: z.string().min(2, 'Required'),
  recipientEmail: z.string().email('Valid email required').optional().or(z.literal('')),
  recipientPhone: z.string().min(7, 'Valid phone required'),
  recipientBankName: z.string().min(2, 'Bank name required'),
  recipientAccountNumber: z.string().min(4, 'Account number required'),
  recipientRoutingNumber: z.string().optional(),
  purposeCode: z.string().min(1, 'Select a purpose'),
  notes: z.string().optional(),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

const PURPOSE_OPTIONS = [
  { value: 'FAMILY_SUPPORT', label: 'Family Support' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'MEDICAL', label: 'Medical' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'GIFT', label: 'Gift' },
  { value: 'OTHER', label: 'Other' },
];

const STEPS = ['Amount', 'Recipient', 'Review', 'Payment', 'Done'];

interface SendMoneyFormProps {
  initialAmount?: number;
  initialCountry?: string;
}

export function SendMoneyForm({ initialAmount, initialCountry }: SendMoneyFormProps) {
  const [step, setStep] = useState(0);
  const [quote, setQuote] = useState<TransferQuote | null>(null);
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Values | null>(null);
  const [completedTransfer, setCompletedTransfer] = useState<Transfer | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const toast = useToast();
  const { getQuote, sendMoney } = useTransfers();

  const countryOptions = [
    { value: '', label: 'Select destination country' },
    ...SUPPORTED_COUNTRIES.filter((c) => c.code !== 'US').map((c) => ({
      value: c.code,
      label: `${c.name} (${c.currency})`,
    })),
  ];

  const {
    register: reg1,
    handleSubmit: handleSubmit1,
    watch: watch1,
    setValue: setValue1,
    formState: { errors: errors1 },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      sendAmount: initialAmount || 100,
      sendCurrency: 'USD',
      recipientCountry: initialCountry || '',
      receiveCurrency: '',
    },
  });

  const recipientCountry = watch1('recipientCountry');

  useEffect(() => {
    const found = SUPPORTED_COUNTRIES.find((c) => c.code === recipientCountry);
    if (found) setValue1('receiveCurrency', found.currency);
  }, [recipientCountry, setValue1]);

  const {
    register: reg2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<Step2Values>({ resolver: zodResolver(step2Schema) });

  const onStep1Submit = async (values: Step1Values) => {
    try {
      setIsLoadingQuote(true);
      const q = await getQuote({
        sendAmount: values.sendAmount,
        sendCurrency: values.sendCurrency,
        receiveCurrency: values.receiveCurrency,
        recipientCountry: values.recipientCountry,
      });
      setQuote(q);
      setStep1Data(values);
      setStep(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to get quote';
      toast.error('Quote failed', message);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const onStep2Submit = (values: Step2Values) => {
    setStep2Data(values);
    setStep(2);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmPayment = async () => {
    if (!step1Data || !step2Data || !quote) return;
    try {
      setIsSubmitting(true);
      const transfer = await sendMoney({
        ...step1Data,
        ...step2Data,
        paymentMethodId: 'pm_mock_card',
      });
      setCompletedTransfer(transfer);
      setStep(4);
      toast.success('Transfer initiated!', 'Your money is on its way');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transfer failed';
      toast.error('Transfer failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const receiveCurrency = watch1('receiveCurrency');

  return (
    <div className="mx-auto max-w-xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i < step
                    ? 'bg-primary-600 text-white'
                    : i === step
                    ? 'border-2 border-primary-600 bg-white text-primary-600 dark:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  i === step
                    ? 'font-medium text-primary-600'
                    : 'text-gray-400'
                }`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 ${
                  i < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Amount */}
      {step === 0 && (
        <form onSubmit={handleSubmit1(onStep1Submit)} className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How much to send?</h2>
          <Input
            label="You send"
            type="number"
            min="1"
            step="0.01"
            leftIcon={<span className="text-sm font-medium">$</span>}
            error={errors1.sendAmount?.message}
            {...reg1('sendAmount')}
          />
          <Select
            label="Destination country"
            options={countryOptions}
            error={errors1.recipientCountry?.message}
            {...reg1('recipientCountry')}
          />
          {quote && step1Data && (
            <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Exchange rate</span>
                <span className="font-medium">
                  1 USD = {quote.exchangeRate.toFixed(4)} {receiveCurrency}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Fee</span>
                <span className="font-medium">{formatCurrency(quote.fee)}</span>
              </div>
              <div className="mt-2 border-t border-primary-200 dark:border-primary-700 pt-2 flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Recipient gets</span>
                <span className="font-bold text-primary-600">
                  {formatCurrency(quote.receiveAmount, receiveCurrency)}
                </span>
              </div>
            </div>
          )}
          <Button type="submit" variant="primary" className="w-full" isLoading={isLoadingQuote} rightIcon={<ChevronRight className="h-4 w-4" />}>
            Get Quote & Continue
          </Button>
        </form>
      )}

      {/* Step 1: Recipient */}
      {step === 1 && (
        <form onSubmit={handleSubmit2(onStep2Submit)} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recipient details</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" error={errors2.recipientFirstName?.message} {...reg2('recipientFirstName')} />
            <Input label="Last name" error={errors2.recipientLastName?.message} {...reg2('recipientLastName')} />
          </div>
          <Input label="Email (optional)" type="email" error={errors2.recipientEmail?.message} {...reg2('recipientEmail')} />
          <Input label="Phone number" type="tel" error={errors2.recipientPhone?.message} {...reg2('recipientPhone')} />
          <Input label="Bank name" error={errors2.recipientBankName?.message} {...reg2('recipientBankName')} />
          <Input label="Account number" error={errors2.recipientAccountNumber?.message} {...reg2('recipientAccountNumber')} />
          <Input label="Routing number (optional)" error={errors2.recipientRoutingNumber?.message} {...reg2('recipientRoutingNumber')} />
          <Select
            label="Purpose of transfer"
            options={[{ value: '', label: 'Select purpose' }, ...PURPOSE_OPTIONS]}
            error={errors2.purposeCode?.message}
            {...reg2('purposeCode')}
          />
          <Input label="Notes (optional)" error={errors2.notes?.message} {...reg2('notes')} />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(0)} leftIcon={<ChevronLeft className="h-4 w-4" />} className="flex-1">
              Back
            </Button>
            <Button type="submit" variant="primary" rightIcon={<ChevronRight className="h-4 w-4" />} className="flex-1">
              Review
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Review */}
      {step === 2 && quote && step1Data && step2Data && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review transfer</h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            <ReviewRow label="Sending" value={formatCurrency(step1Data.sendAmount, step1Data.sendCurrency)} />
            <ReviewRow label="Recipient gets" value={formatCurrency(quote.receiveAmount, step1Data.receiveCurrency)} highlight />
            <ReviewRow label="Exchange rate" value={`1 USD = ${quote.exchangeRate.toFixed(4)} ${step1Data.receiveCurrency}`} />
            <ReviewRow label="Fee" value={formatCurrency(quote.fee)} />
            <ReviewRow label="Total deducted" value={formatCurrency(quote.totalDeducted)} />
            <ReviewRow label="Recipient" value={`${step2Data.recipientFirstName} ${step2Data.recipientLastName}`} />
            <ReviewRow label="Bank" value={step2Data.recipientBankName} />
            <ReviewRow label="Account" value={step2Data.recipientAccountNumber} />
            <ReviewRow label="Est. arrival" value={quote.estimatedArrival} />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} leftIcon={<ChevronLeft className="h-4 w-4" />} className="flex-1">
              Back
            </Button>
            <Button type="button" variant="primary" onClick={() => setStep(3)} rightIcon={<ChevronRight className="h-4 w-4" />} className="flex-1">
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && quote && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h2>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CreditCard className="h-4 w-4" /> Card details
            </p>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                <p className="text-xs text-gray-400 mb-1">Card number</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">4242 4242 4242 4242 (test)</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                  <p className="text-xs text-gray-400 mb-1">Expiry</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">12/26</p>
                </div>
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                  <p className="text-xs text-gray-400 mb-1">CVC</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">123</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                🔒 Payments are secured with Stripe. Test mode active.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20 flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Total charge</span>
            <span className="text-xl font-bold text-primary-700 dark:text-primary-400">
              {formatCurrency(quote.totalDeducted)}
            </span>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)} leftIcon={<ChevronLeft className="h-4 w-4" />} className="flex-1">
              Back
            </Button>
            <Button type="button" variant="primary" onClick={onConfirmPayment} isLoading={isSubmitting} className="flex-1">
              Confirm & Pay {formatCurrency(quote.totalDeducted)}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && completedTransfer && (
        <div className="text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transfer Sent!</h2>
            <p className="mt-1 text-gray-500">Your transfer has been initiated successfully.</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-left space-y-3">
            <ReviewRow label="Transfer ID" value={completedTransfer.id.slice(0, 12) + '...'} />
            <ReviewRow label="Amount sent" value={formatCurrency(completedTransfer.sendAmount, completedTransfer.sendCurrency)} />
            <ReviewRow label="Recipient gets" value={formatCurrency(completedTransfer.receiveAmount, completedTransfer.receiveCurrency)} highlight />
            <ReviewRow label="Status" value={completedTransfer.status} />
          </div>
          <Button variant="primary" className="w-full" onClick={() => { setStep(0); setQuote(null); setStep1Data(null); setStep2Data(null); setCompletedTransfer(null); }}>
            Send another transfer
          </Button>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  );
}
