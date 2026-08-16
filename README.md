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

---

## 📱 Semana 9 — Configuración y verificación del entorno de desarrollo móvil

### 1. Framework seleccionado y justificación

**Framework:** React Native con Expo (managed workflow) y TypeScript.

**Justificación técnica:**
- Permite un solo código base para Android e iOS, reduciendo el tiempo de desarrollo en un proyecto académico con recursos limitados.
- Expo Go permite probar en dispositivo físico real sin compilar binarios nativos ni firmar certificados, ideal para iteración rápida.
- Hot reload / Fast Refresh acelera el ciclo de desarrollo.
- TypeScript aporta tipado estático, coherente con el backend (también TypeScript), reduciendo errores de contrato entre frontend y backend.
- Amplio ecosistema de librerías (Axios, React Navigation) ya integrado al proyecto.

### 2. Entorno de desarrollo — Versiones verificadas

| Herramienta | Versión |
|---|---|
| Node.js | v24.18.0 |
| npm | 11.16.0 |
| Expo CLI | 57.0.13 |
| Android Debug Bridge (adb) | 1.0.41 |
| Editor | Visual Studio Code |
| SDK Android | `C:\Users\WILLIAM\AppData\Local\Android\Sdk` |

### 3. Diagnóstico del entorno

Comando ejecutado:
```bash
npx expo-doctor
```

**Resultado final:** `21/21 checks passed. No issues detected!`

Durante el proceso se resolvieron los siguientes hallazgos:
- Desalineación de versiones (`expo`, `react`, `react-native`, `react-native-safe-area-context`) respecto al SDK 57, corregida con `npx expo install --fix`.
- Regresión de memoria conocida de Hermes V1 en `expo@57.0.6`, resuelta al actualizar a `expo@~57.0.13`.

### 4. Destino de ejecución

Se configuraron y verificaron **dos destinos**, para evidenciar portabilidad entre entorno simulado y real:

- **Emulador Android (AVD)** vía Android Studio — útil para desarrollo sin depender de conexión WiFi estable.
- **Dispositivo físico Android** vía Expo Go — valida condiciones de red reales de la LAN local.

### 5. Ejecución del proyecto y hot reload

```bash
cd app-movil
npx expo start
```

- Emulador: se abre presionando `a` en la terminal de Expo.
- Dispositivo físico: se abre escaneando el código QR con la app Expo Go.

Se verificó el funcionamiento del hot reload modificando texto en `LoginScreen.tsx` y confirmando la actualización automática en ambos destinos, sin necesidad de recompilar.

### 6. Variables de entorno y autorización de tráfico

El emulador y el dispositivo físico alcanzan el backend local mediante direcciones distintas:

| Destino | Dirección hacia el backend | Motivo |
|---|---|---|
| Emulador Android (AVD) | `http://10.0.2.2:4000` | IP especial que el emulador traduce internamente a `localhost` de la PC anfitriona |
| Dispositivo físico (misma WiFi) | `http://192.168.1.121:4000` | IP LAN real de la PC en la red WiFi local |

**Archivo `app-movil/.env`:**
```
EXPO_PUBLIC_API_URL_EMULATOR=http://10.0.2.2:4000
EXPO_PUBLIC_API_URL_PHYSICAL=http://192.168.1.121:4000
```

**Selección automática según el destino** (`src/config/env.ts`), usando `expo-device` para detectar si la app corre en un dispositivo físico o en un emulador.

**Autorización de tráfico en Windows Firewall** (reglas de entrada, alcance: red privada):
- Puerto **4000** (TCP) — tráfico de la API Express.
- Puerto **8081** (TCP) — tráfico del servidor de desarrollo Metro/Expo (necesario para el hot reload en dispositivo físico).

Adicionalmente, el backend se configuró para escuchar en todas las interfaces de red (`0.0.0.0`) en lugar de únicamente `localhost`, permitiendo que dispositivos externos en la misma red accedan a él.

### 7. Solicitud exitosa hacia la API propia

Se conectó la pantalla `LoginScreen.tsx` al endpoint `POST /auth/login` del backend mediante Axios (`src/services/auth.service.ts`).

**Prueba realizada:** login con las credenciales de un usuario administrador registrado previamente en el backend (Semana 8).

**Resultado:** respuesta HTTP 200 recibida correctamente en ambos destinos (emulador y dispositivo físico), confirmada mediante una alerta nativa mostrando el usuario autenticado y su rol, seguida de la navegación a la pantalla principal de la app.

### 8. Dificultades encontradas y solución

- **Comando `adb` no reconocido en terminal:** la carpeta `platform-tools` del SDK de Android no estaba agregada al `PATH` del sistema. Se resolvió agregando `platform-tools` y `emulator` al `PATH` de Windows.
- **Variable de entorno `ComSpec` corrupta:** apuntaba incorrectamente a la carpeta de usuario en lugar de `cmd.exe`, causando errores de tipo `spawn ENOENT` en múltiples comandos de npm/npx a lo largo de varias semanas del proyecto. Se corrigió actualizando su valor a `C:\Windows\System32\cmd.exe` en las variables de entorno del sistema.
- **"Project is incompatible with this version of Expo Go" en dispositivo físico:** la versión de Expo Go publicada en Google Play no incluía soporte para el SDK 57 usado por el proyecto. Se resolvió instalando manualmente la build específica de Expo Go para SDK 57 desde `expo.dev/go`.
- **Hot reload funcionando en emulador pero no en dispositivo físico:** causado por el puerto 8081 (Metro bundler) bloqueado por el Firewall de Windows para conexiones entrantes desde la red local. Se resolvió agregando la regla de firewall correspondiente.

### Cómo reproducir este entorno

```bash
# 1. Backend
cd backend
npm install
node node_modules/prisma/build/index.js generate
npm run dev

# 2. App móvil (en otra terminal)
cd app-movil
npm install
# Crear .env con las URLs correspondientes a tu red local (ver sección 6)
npx expo-doctor        # Confirmar 0 hallazgos antes de continuar
npx expo start --clear
```
**William** — Universidad Estatal Amazónica (UEA)
Proyecto integrador — Ingeniería en TIC