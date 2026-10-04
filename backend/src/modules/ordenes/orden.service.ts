import * as repo from "./orden.repository";
import { enqueue } from "../../jobs/queue";

export function obtenerOrdenes() {
  return repo.listarOrdenes();
}

export async function crearOrden(data: any) {
  const orden = await repo.crearOrden(data);
  enqueue({
    type: "NOTIFICAR_NUEVA_ORDEN",
    payload: { ordenId: orden.id, descripcion: orden.descripcion },
  });
  return orden;
}

export function actualizarOrden(id: number, data: any) {
  return repo.actualizarOrden(id, data);
}

export function eliminarOrden(id: number) {
  return repo.eliminarOrden(id);
}