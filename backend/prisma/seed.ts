import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const dbUrl = new URL(process.env.DATABASE_URL as string);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port),
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
});
const prisma = new PrismaClient({ adapter });

const UNIDAD = "BIMOT38";

interface VehiculoSeed {
  tipo: string;
  placa: string | null;
  registro: string;
  kilometraje: number | null;
  estado: string;
  enUnidad: boolean;
  empleo: string;
  provincia: string;
}

const vehiculos: VehiculoSeed[] = [
  { tipo: "CAMION CHEVROLET", placa: "PEB-1277", registro: "EE-21-0123", kilometraje: 301562, estado: "OPERABLE", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "CAMIÓN HINO", placa: "LEA-1144", registro: "EE-20-6529", kilometraje: 191856, estado: "NO OPERABLE", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "QUITO" },
  { tipo: "CAMIONETA MAZDA BT 50 CD 4X4 STD CRD 2.5FL", placa: "PEC-8096", registro: "EE-20-3645", kilometraje: null, estado: "NO OPERABLE", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "CAMIONETA MAZDA BT 50 CD 4X4 STD CRD 2.5FL", placa: "PEC-8937", registro: "EE-20-3664", kilometraje: 138569, estado: "OPERABLE", enUnidad: false, empleo: "APOY. OPE. MILITARES", provincia: "QUEVEDO" },
  { tipo: "CAMIONETA MAZDA BT 50 CD 4X4 STD CRD 2.5FL", placa: "PEC-8095", registro: "EE-20-3644", kilometraje: 250292, estado: "OPERABLE", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "CAMIONETA MAZDA BT 50 CD 4X4 STD CRD 2.5FL", placa: "PEC-8091", registro: "EE-20-3642", kilometraje: null, estado: "NO OPERABLE", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "CAMIONETA MAZDA BT-50 CD 4X4 STD CRD 2.5FL", placa: "PEC-7737", registro: "EE-20-3622", kilometraje: 178895, estado: "NO OPERABLE", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "CAMIONETA CHEVROLET D-MAX", placa: "XEA-2039", registro: "EE-20-1883", kilometraje: 339730, estado: "OPERABLE", enUnidad: false, empleo: "RECORRIDO HIDROCARBUROS", provincia: "QUEVEDO" },
  { tipo: "CAMIONETA CHEVROLET D-MAX", placa: "XEA-3291", registro: "EE-20-3789", kilometraje: 80245, estado: "OPERABLE", enUnidad: false, empleo: "RECORRIDO HIDROCARBUROS", provincia: "QUEVEDO" },
  { tipo: "CAMIONETA CHEVROLET D-MAX CRDI PREMIER AC 2.5 CD 4X4 TM", placa: "XEA-3514", registro: "EE-20-3941", kilometraje: 26547, estado: "NO OPERABLE MTTO VIGENCIA TECNOLOGICA", enUnidad: false, empleo: "APOY. OPE. MILITARES", provincia: "ENTREGADA AL COLOG25" },
  { tipo: "CAMIONETA GREAT WALL", placa: "XEA-3364", registro: "EE-20-3837", kilometraje: 36821, estado: "OPERABLE", enUnidad: false, empleo: "RECORRIDO HIDROCARBUROS", provincia: "QUEVEDO" },
  { tipo: "JEEP NISSAN X TRAIL CLASSIC 4X4 2.5 MT", placa: "PEC-7957", registro: "EE-20-0700", kilometraje: 170586, estado: "NO OPERABLE", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP SUZUKI SZ FL TM 2.0 5P 4X2", placa: "PEC-8787", registro: "EE-20-1155", kilometraje: 247900, estado: "OPERABLE", enUnidad: false, empleo: "APOY. OPE. MILITARES", provincia: "QUEVEDO" },
  { tipo: "CAMION TACT. KAMAZ 43101 6X6", placa: null, registro: "EE-21-0409", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "CAMION TACT. AM-GENERAL AM-923", placa: null, registro: "EE-21-3833", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "CAMION TACT. MULTIPROPOSITO SINOTRUK 4X4", placa: "XEA-2248", registro: "EE-22-2504", kilometraje: 90752, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "PIFO" },
  { tipo: "CAMION TACT. MULTIPROPOSITO SINOTRUK 4X4", placa: "XEA-2298", registro: "EE-22-2523", kilometraje: 52249, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "CAMION TACT. MULTIPROPOSITO SINOTRUK 4X4", placa: "XEA-2344", registro: "EE-22-2539", kilometraje: null, estado: "NO OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "CAMION TACT. MULTIPROPOSITO SINOTRUK 4X4", placa: "XEA-2424", registro: "EE-22-2601", kilometraje: 150526, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "CAMION TACT. MULTIPROPOSITO SINOTRUK 4X4", placa: "XEA-2322", registro: "EE-22-2656", kilometraje: 83592, estado: "OPERABLE", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "CAMION TACT. MULTIPROPOSITO SINOTRUK 4X4", placa: "XEA-2323", registro: "EE-22-2657", kilometraje: null, estado: "NO OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP TACT. HMMWV M-998", placa: null, registro: "EE-21-3917", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP TACT. HMMWV M-998", placa: null, registro: "EE-21-3920", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP TACT. HMMWV M-998", placa: null, registro: "EE-21-3926", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP TACT. HMMWV M-1152", placa: null, registro: "EE-20-1253", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP TACT. HMMWV M-1152", placa: null, registro: "EE-20-1254", kilometraje: null, estado: "NO OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP TACT. HMMWV M-1152", placa: null, registro: "EE-20-1255", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "JEEP TACT. HMMWV M-1152", placa: null, registro: "EE-20-1256", kilometraje: null, estado: "INSERVIBLE/CHATARRIZACIÓN", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "BUS SINOTRUK", placa: "XEI-1754", registro: "EE-20-2194", kilometraje: null, estado: "NO OPERABLE MTTO", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-059", kilometraje: 30213, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-061", kilometraje: 27684, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-062", kilometraje: 28452, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "MACHACHI" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-063", kilometraje: 16454, estado: "OPERABLE", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "DURAN" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-064", kilometraje: null, estado: "NO OPERABLE SINIESTRADO", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "PORTOVIEJO" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-065", kilometraje: 25874, estado: "NO OPERABLE MTTO", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "PORTOVIEJO" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-067", kilometraje: 13790, estado: "NO OPERABLE MTTO", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "PORTOVIEJO" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-068", kilometraje: 16083, estado: "OPERABLE", enUnidad: false, empleo: "OPERACIONES MILITARES", provincia: "DURAN" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-069", kilometraje: 33558, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-070", kilometraje: 23854, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-072", kilometraje: 22887, estado: "OPERABLE", enUnidad: true, empleo: "OPERACIONES MILITARES", provincia: "QUEVEDO" },
  { tipo: "VEHÍCULO 4X4 DAVID HX-8", placa: null, registro: "EE-10-D-076", kilometraje: 17959, estado: "OPERABLE", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "QUEVEDO" },
  { tipo: "MOTOCICLETA SUZUKI DR 200", placa: "FA152N", registro: "EE-20-8690", kilometraje: null, estado: "MTTO", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "MOTOCICLETA SUZUKI DR 200", placa: "EA574D", registro: "EE-20-8720", kilometraje: null, estado: "MTTO", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "MOTOCICLETA SUZUKI DR 200", placa: "FA151N", registro: "EE-20-8689", kilometraje: null, estado: "MTTO", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "MOTOCICLETA SUZUKI CR 150", placa: "FA169N", registro: "EE-24-0025", kilometraje: null, estado: "MTTO", enUnidad: true, empleo: "APOY. OPE. MILITARES", provincia: "MACHACHI" },
  { tipo: "MOTOCICLETA TUNDRA TD250RAP", placa: "KS917N", registro: "EE-20-8865", kilometraje: 2254, estado: "OPERABLE", enUnidad: false, empleo: "APOY. OPE. MILITARES", provincia: "QUEVEDO" },
  { tipo: "MOTOCICLETA TUNDRA TD250RAP", placa: "KS958N", registro: "EE-20-8866", kilometraje: 2369, estado: "OPERABLE", enUnidad: false, empleo: "APOY. OPE. MILITARES", provincia: "QUEVEDO" },
];

async function main() {
  console.log(`Sembrando ${vehiculos.length} vehículos...`);

  for (const v of vehiculos) {
    await prisma.vehiculo.upsert({
      where: { registro: v.registro },
      update: { ...v, unidad: UNIDAD },
      create: { ...v, unidad: UNIDAD },
    });
  }

  console.log("Seed completado ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });