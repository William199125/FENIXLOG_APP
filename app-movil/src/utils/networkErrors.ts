import { AxiosError } from "axios";

export type TipoErrorDominio = "SIN_CONEXION" | "TIEMPO_AGOTADO" | "ERROR_VALIDACION" | "ERROR_SERVIDOR" | "NO_AUTORIZADO" | "DESCONOCIDO";

export interface ErrorDominio {
  tipo: TipoErrorDominio;
  mensaje: string;
  campos?: Record<string, string>;
}

export function traducirError(error: AxiosError<any>): ErrorDominio {
  if (!error.response && error.code !== "ECONNABORTED") {
    return { tipo: "SIN_CONEXION", mensaje: "No hay conexión con el servidor. Verifica tu red." };
  }
  if (error.code === "ECONNABORTED") {
    return { tipo: "TIEMPO_AGOTADO", mensaje: "El servidor tardó demasiado en responder. Intenta de nuevo." };
  }
  const status = error.response?.status;
  if (status === 422 || status === 400) {
    const campos: Record<string, string> = error.response?.data?.errores ?? {};
    return { tipo: "ERROR_VALIDACION", mensaje: "Revisa los datos ingresados.", campos };
  }
  if (status === 401) {
    return { tipo: "NO_AUTORIZADO", mensaje: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }
  if (status && status >= 500) {
    return { tipo: "ERROR_SERVIDOR", mensaje: "Ocurrió un problema en el servidor. Intenta más tarde." };
  }
  return { tipo: "DESCONOCIDO", mensaje: error.response?.data?.error ?? "Ocurrió un error inesperado." };
}