import { getDb } from './db';
import * as Crypto from 'expo-crypto';
import { Vehiculo } from './vehiculo.service';

export async function guardarCacheVehiculos(vehiculos: (Vehiculo & { updatedAt: string })[]) {
  const db = await getDb();
  const ahora = new Date().toISOString();
  await db.execAsync('DELETE FROM vehiculos;');
  for (const v of vehiculos) {
    await db.runAsync(
      `INSERT INTO vehiculos (id, tipo, placa, registro, provincia, estado, servidor_actualizado_en, sincronizado_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [v.id, v.tipo, v.placa, v.registro, v.provincia, v.estado, v.updatedAt, ahora]
    );
  }
}

export async function obtenerCacheVehiculos(): Promise<Vehiculo[]> {
  const db = await getDb();
  return db.getAllAsync<Vehiculo>('SELECT * FROM vehiculos ORDER BY id ASC;');
}

export async function obtenerFechaSincronizacion(): Promise<string | null> {
  const db = await getDb();
  const fila = await db.getFirstAsync<{ sincronizado_en: string }>(
    'SELECT sincronizado_en FROM vehiculos ORDER BY sincronizado_en DESC LIMIT 1;'
  );
  return fila?.sincronizado_en ?? null;
}

// ---- Cola de operaciones pendientes ----

export type TipoOperacionCola = 'CREAR' | 'ACTUALIZAR' | 'CREAR_ORDEN';

export async function encolarOperacion(tipoOperacion: TipoOperacionCola, payload: object) {
  const db = await getDb();
  const clienteId = Crypto.randomUUID();
  await db.runAsync(
    `INSERT INTO cola_pendiente (cliente_id, tipo_operacion, payload, intentos, creado_en)
     VALUES (?, ?, ?, 0, ?)`,
    [clienteId, tipoOperacion, JSON.stringify(payload), new Date().toISOString()]
  );
  return clienteId;
}

export async function obtenerColaPendiente() {
  const db = await getDb();
  return db.getAllAsync<{
    cliente_id: string; tipo_operacion: string; payload: string; intentos: number; proximo_intento_en: string | null;
  }>('SELECT * FROM cola_pendiente ORDER BY creado_en ASC;');
}

export async function eliminarDeCola(clienteId: string) {
  const db = await getDb();
  await db.runAsync('DELETE FROM cola_pendiente WHERE cliente_id = ?;', [clienteId]);
}

export async function actualizarReintento(clienteId: string, intentos: number, proximoIntentoEn: string) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE cola_pendiente SET intentos = ?, proximo_intento_en = ? WHERE cliente_id = ?;',
    [intentos, proximoIntentoEn, clienteId]
  );
}