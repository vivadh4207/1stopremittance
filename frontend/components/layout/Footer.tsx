import React from 'react';
import Link from 'next/link';
import { DollarSign } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              1Stop Remittance
            </span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-primary-600">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary-600">
              Terms
            </Link>
            <Link href="/support" className="hover:text-primary-600">
              Support
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} 1Stop Remittance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
