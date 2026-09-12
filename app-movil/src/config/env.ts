import * as Device from "expo-device";

type Ambiente = "development" | "production";

export const AMBIENTE: Ambiente = __DEV__ ? "development" : "production";

const URLS_POR_AMBIENTE: Record<Ambiente, { emulador: string; fisico: string | undefined }> = {
  development: {
    emulador: "http://10.0.2.2:4000",
    fisico: process.env.EXPO_PUBLIC_API_URL_PHYSICAL,
  },
  production: {
    emulador: "https://api.fenixlog.mil.ec",
    fisico: "https://api.fenixlog.mil.ec",
  },
};

if (AMBIENTE === "production" && !URLS_POR_AMBIENTE.production.fisico?.startsWith("https://")) {
  throw new Error("Configuración de producción inválida: la URL base debe usar HTTPS.");
}

export const API_URL = Device.isDevice
  ? URLS_POR_AMBIENTE[AMBIENTE].fisico
  : URLS_POR_AMBIENTE[AMBIENTE].emulador;

export const TIMEOUTS = {
  lectura: 8000,
  escritura: 12000,
};