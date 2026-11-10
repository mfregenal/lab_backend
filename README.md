# API Gestión del Poncho

Proyecto de **Desarrollo Backend — FTyCA, UNCa**, desarrollado con Node.js 24, Express 5, Prisma, PostgreSQL y Zod.

Es la API REST de **Poncho Digital**, la plataforma de artesanos de la Fiesta Nacional e Internacional del Poncho. Incluye registro y login con JWT, roles, postulación y evaluación de artesanos, CRUD de productos, pabellones, sectores y stands con su ubicación, registro de consultas de visitantes, documentación OpenAPI con Swagger UI y pruebas automáticas. Las operaciones siguen el flujo **rutas → validación → controladores → servicios**.

## Integrantes del equipo

| Apellido y Nombre | MU N° |
| :--- | :--- |
| **Fregenal, Marcelo Nahuel** | `00428` |
| **Diaz, Marcos German** | `00412` |
| **Alvarez Parma, Alan Uriel** | `00079` |

## Instalación e inicio

Requisitos: **Node.js 24.x** y **PostgreSQL iniciado**. Ejecutar los comandos desde la raíz del proyecto.

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Crear la base de desarrollo desde PostgreSQL:

   ```sql
   CREATE DATABASE poncho_db;
   ```

3. Copiar `.env.example` como `.env` y configurar `DATABASE_URL`, `JWT_SECRET` y, si se desea, `PORT`. Ejemplo, reemplazando las credenciales:

   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/poncho_db?schema=public"
   JWT_SECRET="REEMPLAZAR_POR_UN_SECRETO_PROPIO"
   PORT=3000
   ```

4. Aplicar las migraciones, generar Prisma Client y la documentación, e iniciar:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run docs
   npm run dev
   ```

La API queda disponible en **http://localhost:3000** (o el puerto configurado en `PORT`). Para iniciar sin observar cambios, usar `npm start`.

`swagger-output.json` no se versiona: es necesario ejecutar `npm run docs` antes de iniciar la API por primera vez.

## Roles y acceso

Hay dos roles en la base de datos: `ADMINISTRADOR` y `ARTESANO`. El **visitante** es quien consulta sin iniciar sesión; sus consultas se registran mediante un middleware.

| Recurso | Público | Artesano | Administrador |
| :--- | :--- | :--- | :--- |
| Registro (`POST /usuarios`, con su postulación) y login (`POST /usuarios/login`) | Sí | — | — |
| Rubros, pabellones, sectores, stands, productos, ubicaciones (GET) | Sí | Sí | Sí |
| Productos (POST, PUT, DELETE) | No | Solo los propios | Sí |
| Postulaciones y su evaluación (`PUT /postulaciones/:id/evaluar`) | No | Consulta y edita la propia | Evalúa, consulta y elimina |
| Listado público de artesanos (`GET /artesanos/publicos`, sin email ni ids) | Sí | Sí | Sí |
| Artesanos | No | Consulta y edita su perfil | Lista, asigna stand y elimina |
| Rubros, pabellones, sectores, stands (POST, PUT, DELETE) | No | No | Sí |
| Usuarios y consultas registradas | No | Su perfil (`/usuarios/me`); puede editar sus datos y su contraseña con `PUT /usuarios/:id` | Gestión completa |

Las consultas públicas (`GET` de productos, stands y `/artesanos/publicos`) devuelven solo datos de presentación: nombre, apellido, emprendimiento, rubro y stand. No exponen email, DNI, celular ni ids internos.

El estado de la postulación se modela de forma explícita: `PENDIENTE`, `EN_REVISION`, `REVISION_REQUERIDA` (el administrador solicita modificaciones; el postulante puede editarla y vuelve a `PENDIENTE`), `APROBADA` y `RECHAZADA`. Al aprobarse se crea el artesano y puede publicar productos.

Los stands tienen tres estados: `DISPONIBLE`, `OCUPADO` y `MANTENIMIENTO`. Un stand nuevo queda `DISPONIBLE` (o `MANTENIMIENTO` si se indica). `OCUPADO` solo se alcanza al asignarlo a un artesano (`POST /artesanos/:id/stand`), y un stand con artesano asignado no puede cambiar de estado manualmente.

El primer administrador debe crearse directamente en la base de datos o con un script local; luego puede registrar a otros con `POST /usuarios/registro-administrador`, que requiere un administrador autenticado.

## Documentación de la API

Abrir **http://localhost:3000/docs/**. Swagger UI permite consultar las operaciones y enviar solicitudes reales con **Try it out**.

- Para operaciones protegidas, iniciar sesión con `POST /usuarios/login` y pegar el token en **Authorize**.
- Las estructuras reutilizables están en `src/documentacion/` (`esquemas-cur.js`, `esquemas-pap.js` y `esquemas-upss.js`); los comentarios de las rutas describen cada operación. `generar-docs.js` combina esa información y escribe `swagger-output.json`.

Después de modificar esquemas o comentarios:

```bash
npm run docs
```

Reiniciar la API y recargar `/docs`. No editar el JSON generado a mano.

## Pruebas automáticas

| Comando | Qué comprueba |
| --- | --- |
| `npm test` | Pruebas de esquemas Zod, rechazos de autenticación y servicio de ubicaciones, sin consultas a PostgreSQL. |
| `npm run test:integracion` | Flujos completos con PostgreSQL: usuarios y rubros (`integracion-cur`), postulaciones, artesanos y productos (`integracion-pap`), y ubicaciones, pabellones, sectores y stands (`integracion-upss`). |

**No hace falta iniciar la API con `npm run dev` para ejecutar las pruebas.**

### Preparar la base de pruebas

Crear una base exclusiva en PostgreSQL:

```sql
CREATE DATABASE poncho_db_test;
```

Copiar `.env.test.example` como `.env.test` y completar sus credenciales, el administrador de pruebas (`ADMIN_TEST_EMAIL` y `ADMIN_TEST_PASSWORD`) y `JWT_SECRET`. Mantener `NODE_ENV=test` y un nombre de base que termine en `_test`, separada de la de desarrollo.

```bash
npm run db:test:preparar
npm run test:integracion
```

`db:test:preparar` se ejecuta la primera vez y cuando haya nuevas migraciones. **Las pruebas de integración limpian los datos de la base de pruebas antes de cada caso**, por eso se ejecutan de a un archivo por vez.

Cada archivo de prueba agrupa sus casos con un `describe` con su nombre, para identificar fácilmente a qué archivo pertenece cada prueba.

## Archivos del repositorio

Versionar el código, las migraciones, las pruebas, `package.json`, `package-lock.json` y el generador de documentación.

Las plantillas `.env.example` y `.env.test.example` se comparten sin credenciales reales. No subir `.env`, `.env.test`, `node_modules/`, Prisma Client generado ni `swagger-output.json`; respetar `.gitignore`.
