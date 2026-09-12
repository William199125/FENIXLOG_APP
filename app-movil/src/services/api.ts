import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL, TIMEOUTS, AMBIENTE } from "../config/env";
import { secureAuth } from "./secureAuth";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _reintentada?: boolean;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUTS.lectura,
  headers: { "Content-Type": "application/json" },
});

// Interceptor 1: autenticación — inyecta el token del almacenamiento cifrado
api.interceptors.request.use((config) => {
  const token = secureAuth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor 2: registro — SOLO en desarrollo, oculta el header de Authorization
if (AMBIENTE === "development") {
  api.interceptors.request.use((config) => {
    const headersSeguros = {
      ...config.headers,
      Authorization: config.headers?.Authorization ? "[OCULTO]" : undefined,
    };
    console.log(`[HTTP] → ${config.method?.toUpperCase()} ${config.url}`, headersSeguros);
    return config;
  });
}

// Interceptor 3: renovación automática del token ante un 401
let renovacionEnCurso: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig;
    const esNoAutorizado = error.response?.status === 401;
    const yaSeReintento = original?._reintentada === true;

    // Protección contra bucles: si ya reintentamos esta petición, no insistimos.
    if (!esNoAutorizado || yaSeReintento || !original) {
      return Promise.reject(error);
    }

    original._reintentada = true;

    try {
      if (!renovacionEnCurso) {
        // Import dinámico: evita el ciclo api.ts -> auth.service.ts -> api.ts
        const { refrescarToken } = await import("./auth.service");
        renovacionEnCurso = refrescarToken();
      }
      const nuevoAccessToken = await renovacionEnCurso;
      renovacionEnCurso = null;

      if (!nuevoAccessToken) {
        await secureAuth.clear();
        return Promise.reject(error);
      }

      original.headers.Authorization = `Bearer ${nuevoAccessToken}`;
      return api(original);
    } catch (errorRenovacion) {
      renovacionEnCurso = null;
      await secureAuth.clear();
      return Promise.reject(errorRenovacion);
    }
  }
);