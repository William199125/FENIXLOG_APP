import { prisma } from "../../lib/prisma";

export function listarVehiculos() {
  return prisma.vehiculo.findMany({ orderBy: { id: "asc" } });
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