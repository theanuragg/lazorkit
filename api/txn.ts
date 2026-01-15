import { apiClient } from './client';
import { ApiResponse, Transaction } from '../types/api';

export const transactionsApi = {
  async sendTransaction(recipientAddress: string, amountSol: number) {
    const response = await apiClient.post<ApiResponse<{ transactionId: string; status: string }>>(
      '/api/transactions',
      {
        recipientAddress,
        amountSol,
      },
    );
    return response.data.data;
  },

  async listTransactions() {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/api/transactions');
    return response.data.data;
  },

  async getTransaction(id: string) {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/api/transactions/${id}`);
    return response.data.data;
  },
};