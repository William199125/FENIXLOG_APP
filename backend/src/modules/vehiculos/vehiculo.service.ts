import * as repo from "./vehiculo.repository";
import { getOrSetCache, invalidateCache } from "../../lib/cache";

const CACHE_KEY = "vehiculos:all";

export async function obtenerVehiculos() {
  // Cache-Aside: TTL 60s
  return getOrSetCache(CACHE_KEY, 60, () => repo.listarVehiculos());
}

export async function crearVehiculo(data: any) {
  const vehiculo = await repo.crearVehiculo(data);
  invalidateCache(CACHE_KEY); // invalidación al escribir
  return vehiculo;
}

export async function actualizarVehiculo(id: number, data: any) {
  const vehiculo = await repo.actualizarVehiculo(id, data);
  invalidateCache(CACHE_KEY);
  return vehiculo;
}

export async function eliminarVehiculo(id: number) {
  await repo.eliminarVehiculo(id);
  invalidateCache(CACHE_KEY);
}