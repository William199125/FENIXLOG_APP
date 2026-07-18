# 🪖 FENIX LOG

Aplicación móvil para la administración del mantenimiento preventivo y correctivo del parque automotor militar del **Batallón de Infantería Motorizado N° 38 "Ambato"**.

Proyecto integrador desarrollado para la Universidad Estatal Amazónica (UEA).

---

## 📋 Descripción

FENIX LOG permite administrar:

- Vehículos (militares y tácticos)
- Órdenes de trabajo de mantenimiento
- Historial de mantenimiento
- Repuestos y detalles de órdenes
- Usuarios con roles diferenciados (ADMIN / MILITAR)

---

## 🏗️ Arquitectura

```
React Native (Expo)
        ↓  HTTP/JSON + JWT Bearer
Express (Routes → Middlewares → Controllers)
        ↓
Services (lógica de negocio, caché, jobs)
        ↓
Repositories (acceso a datos)
        ↓
Prisma ORM (adapter-mariadb)
        ↓
MariaDB (fenixlog)

        ↘ Cola en memoria (async jobs) → Worker (notificaciones)
        ↘ node-cache (Cache-Aside) → Vehículos
```

---

## 🛠️ Tecnologías

### Frontend
- React Native
- Expo
- TypeScript

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM 7.8
- MariaDB
- JWT (jsonwebtoken)
- bcryptjs
- node-cache

---

## 📁 Estructura del proyecto

```
FENIXLOG_APP/
├── app-movil/          # Aplicación React Native + Expo
│   └── src/
│       ├── components/
│       ├── navigation/
│       ├── screens/
│       └── theme/
└── backend/            # API REST
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    └── src/
        ├── config/
        ├── jobs/        # Procesamiento asíncrono
        ├── lib/         # Prisma client + Cache-Aside
        ├── middlewares/ # Auth JWT + Roles
        ├── modules/
        │   ├── auth/
        │   ├── ordenes/
        │   └── vehiculos/
        └── utils/
```

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js
- MariaDB corriendo localmente
- Base de datos `fenixlog` creada

### Backend

```bash
cd backend
npm install

# Crea el archivo .env con:
# DATABASE_URL=mysql://usuario:contraseña@localhost:PUERTO/fenixlog
# JWT_SECRET=tu_secreto
# JWT_REFRESH_SECRET=tu_secreto_refresh
# JWT_EXPIRES_IN=15m
# JWT_REFRESH_EXPIRES_IN=7d

node node_modules/prisma/build/index.js migrate dev
node node_modules/prisma/build/index.js generate
node node_modules/tsx/dist/cli.mjs prisma/seed.ts   # Carga los 47 vehículos del BIMOT38

npm run dev
```

Servidor disponible en `http://localhost:4000`.

### Frontend

```bash
cd app-movil
npm install
npx expo start
```

---

## 🔌 API REST — Endpoints

| Método | Ruta | Protegida | Rol | Descripción |
|---|---|---|---|---|
| POST | `/auth/registrar` | No | - | Registro de usuario |
| POST | `/auth/login` | No | - | Login, devuelve access + refresh token |
| POST | `/auth/refrescar` | No | - | Renueva el access token |
| GET | `/vehiculos` | Sí | Cualquiera | Lista vehículos (con caché) |
| POST | `/vehiculos` | Sí | ADMIN | Crea vehículo |
| PUT | `/vehiculos/:id` | Sí | ADMIN | Actualiza vehículo |
| DELETE | `/vehiculos/:id` | Sí | ADMIN | Elimina vehículo |
| GET | `/ordenes` | Sí | Cualquiera | Lista órdenes (eager loading) |
| POST | `/ordenes` | Sí | Cualquiera | Crea orden + notificación asíncrona |

---

## ⚡ Optimizaciones de rendimiento (Semana 8)

### Caché — Estrategia Cache-Aside
`GET /vehiculos` implementa Cache-Aside con `node-cache`:
- TTL de 60 segundos
- Invalidación automática al crear/actualizar/eliminar un vehículo
- Reduce el tiempo de respuesta de ~150ms (consulta a BD) a ~5-15ms (memoria)

### Corrección del problema N+1
`GET /ordenes` usa **Eager Loading** (`include` de Prisma) para traer `vehiculo` y `detalles` en una sola consulta con JOIN, evitando el patrón N+1 (1 + N + N consultas independientes).

### Procesamiento asíncrono
Al crear una orden (`POST /ordenes`), la notificación se procesa en una cola en memoria **sin bloquear la respuesta HTTP** al cliente.

### Autenticación y autorización
- JWT con access token (15 min) y refresh token (7 días)
- Contraseñas hasheadas con `bcryptjs`
- Middleware de roles (`requireRole`) protege operaciones de escritura sobre vehículos, restringidas a `ADMIN`

---

## 📦 Modelo de datos

```
Usuario
Vehiculo ──< Orden ──< DetalleOrden
```

- **Usuario**: username, password (hash), rol (ADMIN/MILITAR)
- **Vehiculo**: unidad, tipo, placa, registro, kilometraje, estado, empleo, provincia
- **Orden**: descripción, estado, relación con vehículo
- **DetalleOrden**: producto, cantidad, relación con orden

---

## 👤 Autor

**William** — Universidad Estatal Amazónica (UEA)
Proyecto integrador — Ingeniería en TIC