let accessToken: string | null = null;

export const authStore = {
  setToken: (token: string) => { accessToken = token; },
  getToken: () => accessToken,
  clear: () => { accessToken = null; },
};