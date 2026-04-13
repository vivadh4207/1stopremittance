import { logger } from '../utils/logger';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Transfer {
  id: string;
  sendAmount: unknown;
  sendCurrency: string;
  receiveAmount: unknown;
  receiveCurrency: string;
  recipientFirstName: string;
  recipientLastName: string;
  status: string;
}

export async function sendWelcomeEmail(user: User): Promise<void> {
  logger.info('Sending welcome email', {
    userId: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    template: 'welcome',
  });
  // TODO: Integrate with email provider (SendGrid, SES, Mailgun, etc.)
}

export async function sendTransferConfirmation(user: User, transfer: Transfer): Promise<void> {
  logger.info('Sending transfer confirmation email', {
    userId: user.id,
    email: user.email,
    transferId: transfer.id,
    amount: `${String(transfer.sendAmount)} ${transfer.sendCurrency}`,
    recipient: `${transfer.recipientFirstName} ${transfer.recipientLastName}`,
    template: 'transfer_confirmation',
  });
  // TODO: Integrate with email provider (SendGrid, SES, Mailgun, etc.)
}

export async function sendKYCStatusUpdate(user: User, status: string): Promise<void> {
  logger.info('Sending KYC status update email', {
    userId: user.id,
    email: user.email,
    kycStatus: status,
    template: 'kyc_status_update',
  });
  // TODO: Integrate with email provider (SendGrid, SES, Mailgun, etc.)
}

export async function sendPasswordResetEmail(user: User, resetToken: string): Promise<void> {
  logger.info('Sending password reset email', {
    userId: user.id,
    email: user.email,
    resetToken: resetToken.substring(0, 8) + '...',
    template: 'password_reset',
  });
  // TODO: Integrate with email provider (SendGrid, SES, Mailgun, etc.)
}

export async function sendTransferFailedEmail(user: User, transfer: Transfer, reason: string): Promise<void> {
  logger.info('Sending transfer failed email', {
    userId: user.id,
    email: user.email,
    transferId: transfer.id,
    reason,
    template: 'transfer_failed',
  });
  // TODO: Integrate with email provider (SendGrid, SES, Mailgun, etc.)
}
