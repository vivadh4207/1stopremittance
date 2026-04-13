export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  country: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  reservedBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'CREDIT' | 'DEBIT' | 'RESERVE' | 'RELEASE';
  amount: number;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Transfer {
  id: string;
  senderId: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientCountry: string;
  recipientBankName?: string;
  recipientAccountNumber?: string;
  recipientRoutingNumber?: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  totalDeducted: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  purposeCode?: string;
  notes?: string;
  stripePaymentIntentId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KYCDocument {
  id: string;
  userId: string;
  docType: 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE';
  docNumber: string;
  frontImageUrl: string;
  backImageUrl?: string;
  selfieUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  spread: number;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
}

export interface TransferQuote {
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  totalDeducted: number;
  estimatedArrival: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTransfers: number;
  totalVolume: number;
  totalRevenue: number;
  pendingKYC: number;
  activeUsers: number;
  transfersByDay: Array<{ date: string; count: number; volume: number }>;
  topCorridors: Array<{ corridor: string; count: number; volume: number }>;
}

export interface SendMoneyFormData {
  sendAmount: number;
  sendCurrency: string;
  recipientCountry: string;
  receiveCurrency: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientBankName: string;
  recipientAccountNumber: string;
  recipientRoutingNumber: string;
  purposeCode: string;
  notes: string;
}
