'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type BadgeColor = 'green' | 'yellow' | 'blue' | 'red' | 'gray' | 'purple' | 'indigo';

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
};

export function Badge({ color = 'gray', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClasses[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, BadgeColor> = {
    COMPLETED: 'green',
    APPROVED: 'green',
    PENDING: 'yellow',
    PROCESSING: 'blue',
    SUBMITTED: 'blue',
    FAILED: 'red',
    REJECTED: 'red',
    CANCELLED: 'gray',
  };
  return <Badge color={colorMap[status] || 'gray'}>{status}</Badge>;
}
