import { obtenerColaPendiente, eliminarDeCola, actualizarReintento } from './vehiculoLocal.service';
import { api } from './api';

const MAX_INTENTOS = 5;
const BASE_ESPERA_MS = 2000; // 2s, 4s, 8s, 16s, 32s...

let sincronizando = false;

export async function procesarCola() {
  if (sincronizando) return;
  sincronizando = true;

  try {
    const pendientes = await obtenerColaPendiente();
    const ahora = Date.now();

    for (const item of pendientes) {
      if (item.proximo_intento_en && new Date(item.proximo_intento_en).getTime() > ahora) {
        continue; // aún no toca reintentar este ítem
      }

      const payload = JSON.parse(item.payload);

      try {
        if (item.tipo_operacion === 'CREAR') {
          await api.post('/vehiculos', payload);
        } else if (item.tipo_operacion === 'ACTUALIZAR') {
          // Resolución de conflictos: comparamos contra el estado actual del servidor
          const { data: actuales } = await api.get('/vehiculos');
          const actual = actuales.find((v: any) => v.id === payload.id);

          if (actual && new Date(actual.updatedAt) > new Date(payload.baseUpdatedAt)) {
            // El servidor tiene una versión más nueva que la que originó este cambio: el servidor gana.
            console.log(`[SYNC] Conflicto en vehículo ${payload.id}: se descarta el cambio local (servidor más reciente).`);
          } else {
            await api.put(`/vehiculos/${payload.id}`, payload);
          }
        } else if (item.tipo_operacion === 'CREAR_ORDEN') {
          // Registro de evidencia (foto + ubicación) de la Semana 14, protegido por el
          // cliente_id único de la cola: si se reintenta, nunca duplica la orden.
          await api.post('/ordenes', payload);
        }
        await eliminarDeCola(item.cliente_id);
        console.log(`[SYNC] Operación ${item.cliente_id} sincronizada correctamente.`);
      } catch (error) {
        const intentos = item.intentos + 1;
        if (intentos >= MAX_INTENTOS) {
          console.log(`[SYNC] Operación ${item.cliente_id} agotó sus ${MAX_INTENTOS} intentos.`);
          await eliminarDeCola(item.cliente_id);
        } else {
          const espera = BASE_ESPERA_MS * Math.pow(2, intentos - 1);
          const proximoIntento = new Date(Date.now() + espera).toISOString();
          await actualizarReintento(item.cliente_id, intentos, proximoIntento);
          console.log(`[SYNC] Reintento ${intentos}/${MAX_INTENTOS} para ${item.cliente_id} en ${espera}ms.`);
        }
      }
    }
  } finally {
    sincronizando = false;
  }
}