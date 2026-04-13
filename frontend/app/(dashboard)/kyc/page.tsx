'use client';

import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { KYCForm } from '@/components/forms/KYCForm';
import { kycApi } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import type { KYCDocument } from '@/types';

export default function KYCPage() {
  const [kycDoc, setKycDoc] = useState<KYCDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKYC = async () => {
    try {
      const { data } = await kycApi.getKYCStatus();
      if (data.success) setKycDoc(data.data ?? null);
    } catch {
      setKycDoc(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKYC();
  }, []);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">KYC Verification</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Verify your identity to unlock higher transfer limits
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
          <div>
            <p className="text-sm font-medium text-primary-900 dark:text-primary-200">
              Why do we need this?
            </p>
            <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
              We&apos;re required by law to verify the identity of all users. Verification typically takes
              1-2 business days. Once approved, you&apos;ll have unlimited transfer limits.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <KYCForm currentDoc={kycDoc} onSuccess={fetchKYC} />
        )}
      </div>
    </div>
  );
}
