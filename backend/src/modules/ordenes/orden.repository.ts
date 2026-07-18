import { prisma } from "../../lib/prisma";

// ❌ ANTES (N+1): traía órdenes y, por cada una, consultaba vehículo y detalles por separado
// const ordenes = await prisma.orden.findMany();
// for (const orden of ordenes) {
//   orden.vehiculo = await prisma.vehiculo.findUnique({ where: { id: orden.vehiculoId } });
//   orden.detalles = await prisma.detalleOrden.findMany({ where: { ordenId: orden.id } });
// }
// Con 100 órdenes = 1 + 100 + 100 = 201 consultas

// ✅ DESPUÉS (Eager Loading con include): 1 sola consulta con JOIN
export function listarOrdenes() {
  return prisma.orden.findMany({
    orderBy: { id: "desc" },
    include: {
      vehiculo: true,
      detalles: true,
    },
  });
}

export function crearOrden(data: {
  descripcion: string;
  vehiculoId?: number;
  detalles: { producto: string; cantidad: number }[];
}) {
  return prisma.orden.create({
    data: {
      descripcion: data.descripcion,
      vehiculoId: data.vehiculoId,
      detalles: { create: data.detalles },
    },
    include: { vehiculo: true, detalles: true },
  });
}