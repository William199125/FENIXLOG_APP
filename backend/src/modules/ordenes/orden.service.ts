import * as repo from "./orden.repository";
import { enqueue } from "../../jobs/queue";

export function obtenerOrdenes() {
  return repo.listarOrdenes(); // Eager loading: justificado porque vehiculo y detalles
  // SIEMPRE se muestran junto a la orden en la UI (pantalla de detalle de orden).
  // Lazy loading no aplicaría aquí porque generaría el problema N+1 que acabamos de corregir.
}

export async function crearOrden(data: any) {
  const orden = await repo.crearOrden(data);

  // Procesamiento asíncrono: no bloquea la respuesta al cliente
  enqueue({
    type: "NOTIFICAR_NUEVA_ORDEN",
    payload: { ordenId: orden.id, descripcion: orden.descripcion },
  });

  return orden;
}