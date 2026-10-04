import * as Device from "expo-device";

type Ambiente = "development" | "production";

export const AMBIENTE: Ambiente = __DEV__ ? "development" : "production";

// DECISIÓN DOCUMENTADA: este proyecto académico no cuenta con un servidor
// desplegado con HTTPS. El build de producción se conecta mediante una IP
// fija de Tailscale (red privada virtual cifrada punto a punto), que exige
// que el equipo que aloja el backend esté encendido y conectado a Tailscale.
// Esta es una limitación conocida, no apta para producción real, aceptada
// para el alcance de este proyecto integrador.
const URL_PRODUCCION = "http://100.118.112.37:4000";

const URLS_POR_AMBIENTE: Record<Ambiente, { emulador: string; fisico: string | undefined }> = {
  development: {
    emulador: "http://10.0.2.2:4000",
    fisico: process.env.EXPO_PUBLIC_API_URL_PHYSICAL,
  },
  production: {
    emulador: URL_PRODUCCION,
    fisico: URL_PRODUCCION,
  },
};

export const API_URL = Device.isDevice
  ? URLS_POR_AMBIENTE[AMBIENTE].fisico
  : URLS_POR_AMBIENTE[AMBIENTE].emulador;

export const TIMEOUTS = {
  lectura: 8000,
  escritura: 12000,
};