import * as SecureStore from 'expo-secure-store';
import { AsyncStorage } from 'react-native';

const TOKEN_KEY = 'lazorkit_access_token';
const REFRESH_TOKEN_KEY = 'lazorkit_refresh_token';
const USER_KEY = 'lazorkit_user';

export const storage = {
  async setAccessToken(token: string) {
    try {
      await SecureStore. setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  },

  async setRefreshToken(token: string) {
    try {
      await SecureStore. setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  },

  async setUser(user:  any) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  },

  async clearAll() {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};