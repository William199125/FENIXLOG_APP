import NetInfo from "@react-native-community/netinfo";
import { api } from "../services/api";
import { VehiculoDto, Vehiculo, vehiculoDesdeDto } from "../models/vehiculo.model";
import {
  guardarCacheVehiculos, obtenerCacheVehiculos, obtenerFechaSincronizacion, encolarOperacion,
} from "../services/vehiculoLocal.service";
import { procesarCola } from "../services/syncQueue";
import { traducirError, ErrorDominio } from "../utils/networkErrors";

export interface ResultadoVehiculos {
  vehiculos: Vehiculo[];
  sinConexion: boolean;
  antiguedad: string | null;
  error: ErrorDominio | null;
}

async function hayConexionReal(): Promise<boolean> {
  const estado = await NetInfo.fetch();
  return estado.isConnected === true && estado.isInternetReachable === true;
}

export async function obtenerVehiculos(): Promise<ResultadoVehiculos> {
  if (await hayConexionReal()) {
    try {
      const { data } = await api.get<VehiculoDto[]>("/vehiculos");
      const vehiculos: Vehiculo[] = data.map(vehiculoDesdeDto);
      await guardarCacheVehiculos(data);
      await procesarCola();
      return { vehiculos, sinConexion: false, antiguedad: await obtenerFechaSincronizacion(), error: null };
    } catch (e: any) {
      return fuenteLocal(traducirError(e));
    }
  }
  return fuenteLocal(null);
}

async function fuenteLocal(errorSiVacio: ErrorDominio | null): Promise<ResultadoVehiculos> {
  const cacheDto: VehiculoDto[] = await obtenerCacheVehiculos();
  const vehiculos: Vehiculo[] = cacheDto.map(vehiculoDesdeDto);
  const antiguedad = await obtenerFechaSincronizacion();
  const error: ErrorDominio | null =
    vehiculos.length === 0
      ? errorSiVacio ?? { tipo: "SIN_CONEXION", mensaje: "Sin conexión y sin datos guardados localmente." }
      : null;
  return { vehiculos, sinConexion: true, antiguedad, error };
}

export async function crearVehiculo(payload: object) {
  await encolarOperacion("CREAR", payload);
  if (await hayConexionReal()) await procesarCola();
}