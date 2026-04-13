'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { kycApi } from '@/lib/api';
import type { KYCDocument } from '@/types';

const schema = z.object({
  docType: z.enum(['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE']),
  docNumber: z.string().min(3, 'Enter a valid document number'),
  frontImageUrl: z.string().url('Enter a valid image URL'),
  backImageUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  selfieUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface KYCFormProps {
  currentDoc: KYCDocument | null;
  onSuccess: () => void;
}

export function KYCForm({ currentDoc, onSuccess }: KYCFormProps) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      docType: 'NATIONAL_ID',
      docNumber: currentDoc?.docNumber || '',
      frontImageUrl: currentDoc?.frontImageUrl || '',
      backImageUrl: currentDoc?.backImageUrl || '',
      selfieUrl: currentDoc?.selfieUrl || '',
    },
  });

  const docTypeOptions = [
    { value: 'NATIONAL_ID', label: 'National ID' },
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'DRIVERS_LICENSE', label: "Driver's License" },
  ];

  const onSubmit = async (values: FormValues) => {
    try {
      await kycApi.submitKYC({
        docType: values.docType,
        docNumber: values.docNumber,
        frontImageUrl: values.frontImageUrl,
        backImageUrl: values.backImageUrl || undefined,
        selfieUrl: values.selfieUrl || undefined,
      });
      toast.success('KYC submitted!', 'Your documents are under review');
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      toast.error('Submission failed', message);
    }
  };

  if (currentDoc?.status === 'APPROVED') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-200">KYC Approved</p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your identity has been verified. You can now send money without limits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentDoc?.status === 'SUBMITTED' || currentDoc?.status === 'PENDING') {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-500" />
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-200">Review in Progress</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your documents are being reviewed. This typically takes 1-2 business days.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-white p-4 dark:bg-gray-800">
          <p className="text-xs font-medium text-gray-500 uppercase">Submitted Document</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            Type: {currentDoc.docType.replace('_', ' ')}
          </p>
          <p className="text-sm text-gray-900 dark:text-white">Number: {currentDoc.docNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {currentDoc?.status === 'REJECTED' && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-200">Documents Rejected</p>
            {currentDoc.reviewNotes && (
              <p className="text-sm text-red-700 dark:text-red-300">{currentDoc.reviewNotes}</p>
            )}
            <p className="text-sm text-red-700 dark:text-red-300">
              Please resubmit with valid documents.
            </p>
          </div>
        </div>
      )}

      <Select
        label="Document Type"
        options={docTypeOptions}
        error={errors.docType?.message}
        {...register('docType')}
      />
      <Input
        label="Document Number"
        placeholder="e.g., A12345678"
        error={errors.docNumber?.message}
        {...register('docNumber')}
      />
      <Input
        label="Front Image URL"
        type="url"
        placeholder="https://..."
        leftIcon={<Upload className="h-4 w-4" />}
        helperText="Provide a direct URL to your document's front image"
        error={errors.frontImageUrl?.message}
        {...register('frontImageUrl')}
      />
      <Input
        label="Back Image URL (optional)"
        type="url"
        placeholder="https://..."
        leftIcon={<Upload className="h-4 w-4" />}
        error={errors.backImageUrl?.message}
        {...register('backImageUrl')}
      />
      <Input
        label="Selfie URL (optional)"
        type="url"
        placeholder="https://..."
        leftIcon={<Upload className="h-4 w-4" />}
        helperText="A photo of yourself holding the document"
        error={errors.selfieUrl?.message}
        {...register('selfieUrl')}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        Submit for Verification
      </Button>
    </form>
  );
}
