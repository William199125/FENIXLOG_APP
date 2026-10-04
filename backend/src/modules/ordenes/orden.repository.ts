import { prisma } from "../../lib/prisma";

// ❌ ANTES (N+1): traía órdenes y, por cada una, consultaba vehículo y detalles por separado
// Con 100 órdenes = 1 + 100 + 100 = 201 consultas
// ✅ DESPUÉS (Eager Loading con include): 1 sola consulta con JOIN
export function listarOrdenes() {
  return prisma.orden.findMany({
    orderBy: { id: "desc" },
    include: { vehiculo: true, detalles: true },
  });
}

export function crearOrden(data: {
  descripcion: string;
  vehiculoId?: number;
  detalles: { producto: string; cantidad: number }[];
  fotoBase64?: string;
  latitud?: number;
  longitud?: number;
}) {
  return prisma.orden.create({
    data: {
      descripcion: data.descripcion,
      vehiculoId: data.vehiculoId,
      detalles: { create: data.detalles },
      fotoBase64: data.fotoBase64,
      latitud: data.latitud,
      longitud: data.longitud,
    },
    include: { vehiculo: true, detalles: true },
  });
}

export function actualizarOrden(id: number, data: { descripcion?: string; estado?: string }) {
  return prisma.orden.update({
    where: { id },
    data: {
      descripcion: data.descripcion,
      estado: data.estado,
    },
    include: { vehiculo: true, detalles: true },
  });
}

export function eliminarOrden(id: number) {
  return prisma.$transaction([
    prisma.detalleOrden.deleteMany({ where: { ordenId: id } }),
    prisma.orden.delete({ where: { id } }),
  ]);
}