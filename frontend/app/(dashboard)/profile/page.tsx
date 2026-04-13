'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api';
import { SUPPORTED_COUNTRIES } from '@/lib/utils';
import { Select } from '@/components/ui/Input';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  phone: z.string().min(7, 'Valid phone required'),
  country: z.string().min(2, 'Select a country'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(8, 'Min 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const countryOptions = SUPPORTED_COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      country: user?.country || '',
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (values: ProfileValues) => {
    try {
      const { data } = await usersApi.updateMe(values);
      if (data.success && data.data) {
        updateUser(data.data);
        toast.success('Profile updated!');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Update failed';
      toast.error('Update failed', message);
    }
  };

  const onPasswordSubmit = async (values: PasswordValues) => {
    try {
      await usersApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed!');
      resetPassword();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password change failed';
      toast.error('Failed', message);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* KYC status */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
          {user?.firstName[0]}{user?.lastName[0]}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">KYC:</span>
          <StatusBadge status={user?.kycStatus || 'PENDING'} />
        </div>
      </div>

      {/* Personal Info */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Personal Information</span>
          </div>
        }
      >
        <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              error={profileErrors.firstName?.message}
              {...regProfile('firstName')}
            />
            <Input
              label="Last name"
              error={profileErrors.lastName?.message}
              {...regProfile('lastName')}
            />
          </div>
          <Input label="Email" value={user?.email} disabled className="opacity-60" />
          <Input
            label="Phone"
            type="tel"
            error={profileErrors.phone?.message}
            {...regProfile('phone')}
          />
          <Select
            label="Country"
            options={countryOptions}
            error={profileErrors.country?.message}
            {...regProfile('country')}
          />
          <Button type="submit" variant="primary" isLoading={isProfileSubmitting}>
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Change Password</span>
          </div>
        }
      >
        <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            error={passwordErrors.currentPassword?.message}
            {...regPassword('currentPassword')}
          />
          <Input
            label="New password"
            type="password"
            error={passwordErrors.newPassword?.message}
            {...regPassword('newPassword')}
          />
          <Input
            label="Confirm new password"
            type="password"
            error={passwordErrors.confirmPassword?.message}
            {...regPassword('confirmPassword')}
          />
          <Button type="submit" variant="primary" isLoading={isPasswordSubmitting}>
            Update Password
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card
        header={
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Danger Zone</span>
          </div>
        }
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Deactivate Account</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Permanently deactivate your account and all data.
            </p>
          </div>
          <Button variant="danger" size="sm" disabled>
            Deactivate
          </Button>
        </div>
      </Card>
    </div>
  );
}
