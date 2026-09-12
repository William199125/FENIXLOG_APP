// DTO: forma exacta en que el backend entrega el recurso (coincide con lo que ya usa tu caché SQLite)
export interface VehiculoDto {
  id: number;
  tipo: string;
  placa: string | null;
  registro: string;
  provincia: string;
  estado: string;
  updatedAt: string;
}

// Modelo de dominio: nombres estables para la app
export interface Vehiculo {
  id: number;
  tipo: string;
  placa: string | null;
  registro: string;
  provincia: string;
  estadoOperativo: string; // ← divergencia: "estado" (servidor) -> "estadoOperativo" (cliente)
  actualizadoEn: string;   // ← divergencia: "updatedAt" (servidor) -> "actualizadoEn" (cliente)
}

export function vehiculoDesdeDto(dto: VehiculoDto): Vehiculo {
  return {
    id: dto.id,
    tipo: dto.tipo,
    placa: dto.placa,
    registro: dto.registro,
    provincia: dto.provincia,
    estadoOperativo: dto.estado,
    actualizadoEn: dto.updatedAt,
  };
}