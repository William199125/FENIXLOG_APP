// Simula el envío de una notificación (correo, push, etc.) sin bloquear la respuesta HTTP.
export async function notificarNuevaOrden(payload: { ordenId: number; descripcion: string }) {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simula latencia de un servicio externo
  console.log(`[NOTIFICACIÓN] Nueva orden #${payload.ordenId} registrada: ${payload.descripcion}`);
}