import { apiClient } from './client';
import { ApiResponse, WalletInfo } from '../types/api';

export const walletApi = {
  async getBalance() {
    const response = await apiClient.get<ApiResponse<{ balance: number; cached: boolean }>>(
      '/api/wallet/balance',
    );
    return response.data. data;
  },

  async getWalletInfo() {
    const response = await apiClient.get<ApiResponse<WalletInfo>>('/api/wallet/info');
    return response.data.data;
  },
};