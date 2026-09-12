import { api } from "./api";
import { secureAuth } from "./secureAuth";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: number;
    username: string;
    rol: string;
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { username, password });
  return data;
}

export async function refrescarToken(): Promise<string | null> {
  const refreshToken = await secureAuth.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await api.post("/auth/refrescar", { refreshToken });
    await secureAuth.setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}