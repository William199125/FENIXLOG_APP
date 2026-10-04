import { prisma } from "../../lib/prisma";

interface OpcionesListado {
  page?: number;
  limit?: number;
  estado?: string;
  provincia?: string;
}

export function listarVehiculos(opciones: OpcionesListado = {}) {
  const where: any = {};
  if (opciones.estado) where.estado = opciones.estado;
  if (opciones.provincia) where.provincia = opciones.provincia;

  const baseQuery: any = { where, orderBy: { id: "asc" } };

  if (opciones.page && opciones.limit) {
    baseQuery.skip = (opciones.page - 1) * opciones.limit;
    baseQuery.take = opciones.limit;
  }

  return prisma.vehiculo.findMany(baseQuery);
}

export function contarVehiculos(opciones: OpcionesListado = {}) {
  const where: any = {};
  if (opciones.estado) where.estado = opciones.estado;
  if (opciones.provincia) where.provincia = opciones.provincia;
  return prisma.vehiculo.count({ where });
}

export function crearVehiculo(data: any) {
  return prisma.vehiculo.create({ data });
}

export function actualizarVehiculo(id: number, data: any) {
  return prisma.vehiculo.update({ where: { id }, data });
}

export function eliminarVehiculo(id: number) {
  return prisma.vehiculo.delete({ where: { id } });
}