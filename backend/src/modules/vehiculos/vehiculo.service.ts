import * as repo from "./vehiculo.repository";
import { getOrSetCache, invalidateCacheByPrefix } from "../../lib/cache";

const CACHE_PREFIX = "vehiculos:";

interface OpcionesListado {
  page?: number;
  limit?: number;
  estado?: string;
  provincia?: string;
}

export async function obtenerVehiculos(opciones: OpcionesListado = {}) {
  // La clave de caché incluye los parámetros: cada combinación de filtro/página
  // se cachea por separado, evitando devolver datos de una consulta distinta.
  const claveCache = `${CACHE_PREFIX}${JSON.stringify(opciones)}`;

  return getOrSetCache(claveCache, 60, async () => {
    const vehiculos = await repo.listarVehiculos(opciones);

    if (opciones.page && opciones.limit) {
      const total = await repo.contarVehiculos(opciones);
      return {
        data: vehiculos,
        page: opciones.page,
        limit: opciones.limit,
        total,
        totalPages: Math.ceil(total / opciones.limit),
      };
    }

    return vehiculos; // comportamiento original: array simple, sin paginar
  });
}

export async function crearVehiculo(data: any) {
  const vehiculo = await repo.crearVehiculo(data);
  invalidateCacheByPrefix(CACHE_PREFIX);
  return vehiculo;
}

export async function actualizarVehiculo(id: number, data: any) {
  const vehiculo = await repo.actualizarVehiculo(id, data);
  invalidateCacheByPrefix(CACHE_PREFIX);
  return vehiculo;
}

export async function eliminarVehiculo(id: number) {
  await repo.eliminarVehiculo(id);
  invalidateCacheByPrefix(CACHE_PREFIX);
}