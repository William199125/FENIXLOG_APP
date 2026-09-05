import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync('fenixlog.db');

  await dbInstance.execAsync(`
    CREATE TABLE IF NOT EXISTS vehiculos (
      id INTEGER PRIMARY KEY,
      tipo TEXT NOT NULL,
      placa TEXT,
      registro TEXT NOT NULL,
      provincia TEXT NOT NULL,
      estado TEXT NOT NULL,
      servidor_actualizado_en TEXT NOT NULL,
      sincronizado_en TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cola_pendiente (
      cliente_id TEXT PRIMARY KEY,
      tipo_operacion TEXT NOT NULL,
      payload TEXT NOT NULL,
      intentos INTEGER DEFAULT 0,
      proximo_intento_en TEXT,
      creado_en TEXT NOT NULL
    );
  `);

  return dbInstance;
}

export async function clearAllLocalData() {
  const db = await getDb();
  await db.execAsync(`
    DELETE FROM vehiculos;
    DELETE FROM cola_pendiente;
  `);
}