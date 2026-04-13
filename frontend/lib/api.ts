import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  User,
  Wallet,
  Transaction,
  Transfer,
  TransferQuote,
  KYCDocument,
  ExchangeRate,
  AdminStats,
  SendMoneyFormData,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post<ApiResponse<AuthTokens>>(
          `${API_URL}/auth/refresh`,
          { refreshToken },
        );

        const tokens = data.data!;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);

        processQueue(null, tokens.accessToken);
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', credentials),
  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', data),
  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout'),
  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }),
};

export const usersApi = {
  getMe: () => apiClient.get<ApiResponse<User>>('/users/me'),
  updateMe: (data: Partial<User>) => apiClient.put<ApiResponse<User>>('/users/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put<ApiResponse<null>>('/users/me/password', data),
};

export const walletApi = {
  getWallet: () => apiClient.get<ApiResponse<Wallet>>('/wallet'),
  getTransactions: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<Transaction[]>>('/wallet/transactions', { params }),
  fundWallet: (data: { amount: number; currency: string; paymentMethodId: string }) =>
    apiClient.post<ApiResponse<Wallet>>('/wallet/fund', data),
};

export const transfersApi = {
  getQuote: (data: {
    sendAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    recipientCountry: string;
  }) => apiClient.post<ApiResponse<TransferQuote>>('/transfers/quote', data),
  sendMoney: (data: Partial<SendMoneyFormData> & { paymentMethodId?: string }) =>
    apiClient.post<ApiResponse<Transfer>>('/transfers', data),
  getTransfers: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<ApiResponse<Transfer[]>>('/transfers', { params }),
  getTransfer: (id: string) => apiClient.get<ApiResponse<Transfer>>(`/transfers/${id}`),
};

export const exchangeRatesApi = {
  getRate: (from: string, to: string) =>
    apiClient.get<ApiResponse<ExchangeRate>>(`/exchange-rates/${from}/${to}`),
  getAllRates: () => apiClient.get<ApiResponse<ExchangeRate[]>>('/exchange-rates'),
};

export const kycApi = {
  submitKYC: (data: {
    docType: string;
    docNumber: string;
    frontImageUrl: string;
    backImageUrl?: string;
    selfieUrl?: string;
  }) => apiClient.post<ApiResponse<KYCDocument>>('/kyc', data),
  getKYCStatus: () => apiClient.get<ApiResponse<KYCDocument>>('/kyc/status'),
};

export const adminApi = {
  getStats: () => apiClient.get<ApiResponse<AdminStats>>('/admin/stats'),
  getUsers: (params?: { page?: number; limit?: number; kycStatus?: string; role?: string; search?: string }) =>
    apiClient.get<ApiResponse<User[]>>('/admin/users', { params }),
  getTransactions: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<ApiResponse<Transfer[]>>('/admin/transfers', { params }),
  updateUser: (id: string, data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, data),
  updateKYC: (id: string, data: { status: string; reviewNotes?: string }) =>
    apiClient.put<ApiResponse<KYCDocument>>(`/admin/kyc/${id}`, data),
};

export default apiClient;
