export interface OrdenDto {
  id: number;
  descripcion: string;
  estado: string;
  createdAt: string;
  vehiculoId: number | null;
  vehiculo?: { id: number; tipo: string; placa: string | null } | null;
  detalles: { id: number; producto: string; cantidad: number }[];
}

export interface Orden {
  id: number;
  descripcion: string;
  estado: string;
  creadaEn: string;            // ← divergencia: "createdAt" -> "creadaEn"
  vehiculoAsociadoId: number | null; // ← divergencia: "vehiculoId" -> "vehiculoAsociadoId"
  repuestos: { id: number; nombre: string; cantidad: number }[]; // ← divergencia: "detalles"/"producto" -> "repuestos"/"nombre"
}

export function ordenDesdeDto(dto: OrdenDto): Orden {
  return {
    id: dto.id,
    descripcion: dto.descripcion,
    estado: dto.estado,
    creadaEn: dto.createdAt,
    vehiculoAsociadoId: dto.vehiculoId,
    repuestos: dto.detalles.map((d) => ({ id: d.id, nombre: d.producto, cantidad: d.cantidad })),
  };
}