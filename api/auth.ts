import { apiClient } from './client';
import { ApiResponse, AuthTokens } from '../types/api';

export const authApi = {
  async getChallenge(email: string, displayName?:  string) {
    const response = await apiClient.post<ApiResponse<any>>('/api/auth/challenge', {
      username: email,
      displayName,
    });
    return response.data.data;
  },

  async verifyWebAuthn(attestationResponse: any) {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/api/auth/verify', {
      id:  attestationResponse.id,
      rawId: attestationResponse.rawId,
      response: attestationResponse.response,
      type: 'public-key',
    });
    return response.data.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient. post<ApiResponse<AuthTokens>>('/api/auth/refresh', {
      refreshToken,
    });
    return response.data. data;
  },
};