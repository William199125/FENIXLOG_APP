import * as Device from "expo-device";

type Ambiente = "development" | "production";

export const AMBIENTE: Ambiente = __DEV__ ? "development" : "production";

// DECISIÓN DOCUMENTADA ACTUALIZADA: Para la entrega final del proyecto 
// integrador, el backend se ha desplegado exitosamente en Render con HTTPS 
// y la base de datos en Neon (PostgreSQL). Ya no dependemos de Tailscale.
const URL_PRODUCCION = "https://fenixlog-backend.onrender.com";

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

// TIMEOUTS ACTUALIZADOS: Aumentados a 60 segundos para compensar el "cold start"
// (despertar) de la capa gratuita del servidor de Render.
export const TIMEOUTS = {
  lectura: 60000,
  escritura: 60000,
};