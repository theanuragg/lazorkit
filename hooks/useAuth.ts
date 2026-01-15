import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { authApi } from '../api/auth';

export const useAuth = () => {
  const { accessToken, loadFromStorage, setTokens, clearAuth } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const login = async (email: string, displayName?: string) => {
    try {
      const challenge = await authApi.getChallenge(email, displayName);
      // In a real app, call WebAuthn API here
      // For MVP, simplified flow
      const tokens = await authApi.verifyWebAuthn({
        id: challenge.userId,
        rawId: challenge. userId,
        response: {
          clientDataJSON: 'mock',
          attestationObject: 'mock',
        },
      });
      await setTokens(tokens. accessToken, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await clearAuth();
  };

  return {
    isAuthenticated: !!accessToken,
    login,
    logout,
  };
};