import { api } from "./api";

export interface Vehiculo {
  id: number;
  tipo: string;
  placa: string | null;
  registro: string;
  provincia: string;
  estado: string;
}

export async function obtenerVehiculos(): Promise<Vehiculo[]> {
  const { data } = await api.get<Vehiculo[]>("/vehiculos");
  return data;
}