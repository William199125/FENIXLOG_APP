import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'fenixlog_access_token';
const REFRESH_KEY = 'fenixlog_refresh_token';

let accessTokenMemoria: string | null = null;

export const secureAuth = {
  async init() {
    accessTokenMemoria = await SecureStore.getItemAsync(ACCESS_KEY);
    return accessTokenMemoria;
  },

  async setTokens(accessToken: string, refreshToken: string) {
    accessTokenMemoria = accessToken;
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  },

  getToken() {
    return accessTokenMemoria;
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_KEY);
  },

  async setAccessToken(token: string) {
    accessTokenMemoria = token;
    await SecureStore.setItemAsync(ACCESS_KEY, token);
  },

  async clear() {
    accessTokenMemoria = null;
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};