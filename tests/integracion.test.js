import { test, before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { crearEscenario } from "./helpers/escenario-cur.js";

// Protección: Para no ejecutar por error en entorno de desarrollo.
// 2.4: aserciones de NODE_ENV y del nombre de la base, antes de importar la app.
assert.equal(process.env.NODE_ENV, "test"); // Verifica que el entorno sea de pruebas.
assert.match(new URL(process.env.DATABASE_URL).pathname, /_test$/); // Verifica que la base de datos sea de pruebas (termina en "_test").
assert.ok(process.env.ADMIN_TEST_EMAIL && process.env.ADMIN_TEST_PASSWORD, "Faltan ADMIN_TEST_EMAIL y ADMIN_TEST_PASSWORD en .env.test"); // Verifica que las credenciales de administrador de pruebas estén definidas.

const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../src/app.js");

let datos;

// 2.4: conexión a la base de pruebas.
before(async () => { await prisma.$connect(); });
// 2.4: desconexión de la base al terminar.
after(async () => { await prisma.$disconnect(); });

// 2.4: limpieza en orden de dependencias antes de cada prueba.
beforeEach(async () => {
  await prisma.$transaction([
    prisma.tokenRevocado.deleteMany(),
    prisma.producto.deleteMany(),
    prisma.artesano.deleteMany(),
    prisma.postulacion.deleteMany(),
    prisma.stand.deleteMany(),
    prisma.sector.deleteMany(),
    prisma.pabellon.deleteMany(),
    prisma.usuario.deleteMany({ where: { email: { not: process.env.ADMIN_TEST_EMAIL } } }),
    prisma.rubro.deleteMany(),
    prisma.consulta.deleteMany(),
  ]);

  datos = await crearEscenario(app, prisma);
});

const crearRubro = (token, cuerpo) =>
  request(app).post("/rubros")
    .set("Authorization", `Bearer ${token}`)
    .send(cuerpo);

// 2.5: alta correcta verificada en la base de datos (el rubro no tiene dueño, por eso no se comprueba pertenencia).
test("El administrador crea un rubro y queda guardado en PostgreSQL", async () => {
  const { tokenAdmin } = datos;
  const { body } = await crearRubro(tokenAdmin, {
    nom_rubro: "Cerámica", desc_rubro: "Piezas de arcilla"
  }).expect(201);

  const guardado = await prisma.rubro.findUniqueOrThrow({ where: { id_rubro: body.id_rubro } });
  assert.equal(guardado.nom_rubro, "Cerámica");
  assert.equal(guardado.desc_rubro, "Piezas de arcilla");
  assert.equal(await prisma.rubro.count({ where: { nom_rubro: "Cerámica" } }), 1);
});

// 2.5: cada usuario autenticado obtiene únicamente su propio perfil.
test("GET /usuarios/me devuelve únicamente el perfil propio", async () => {
  const { ana, bruno, tokenAna, tokenBruno } = datos;

  const { body: perfilAna } = await request(app).get("/usuarios/me")
    .set("Authorization", `Bearer ${tokenAna}`).expect(200)
    .expect("Content-Type", /json/);
  const { body: perfilBruno } = await request(app).get("/usuarios/me")
    .set("Authorization", `Bearer ${tokenBruno}`).expect(200);

  assert.equal(perfilAna.id_usuario, ana.id_usuario);
  assert.equal(perfilAna.email, "ana@pruebas.test");
  assert.equal(perfilBruno.id_usuario, bruno.id_usuario);
  assert.equal("passwordHash" in perfilAna, false);
});

// 2.5 (acceso a recurso ajeno): la API responde 403, no 404
test("Ana no puede modificar el perfil de Bruno", async () => {
  const { bruno, tokenAna } = datos;

  const { body } = await request(app).put(`/usuarios/${bruno.id_usuario}`)
    .set("Authorization", `Bearer ${tokenAna}`)
    .send({ nombre: "Modificado" }).expect(403);

  assert.equal(body.mensaje, "No tienes permisos para modificar el perfil de otro usuario");
  const guardado = await prisma.usuario.findUniqueOrThrow({ where: { id_usuario: bruno.id_usuario } });
  assert.equal(guardado.nombre, "Bruno");
});

// 2.6: aserciones significativas: estado 409, mensaje del cuerpo y un único registro en la base.
test("Crear un rubro duplicado devuelve 409 y conserva un solo registro", async () => {
  const { tokenAdmin } = datos;
  await crearRubro(tokenAdmin, { nom_rubro: "Cerámica" }).expect(201);

  const { body } = await crearRubro(tokenAdmin, { nom_rubro: "Cerámica" }).expect(409);

  assert.equal(body.mensaje, "El nombre del rubro ya existe");
  assert.equal(await prisma.rubro.count({ where: { nom_rubro: "Cerámica" } }), 1);
});

// 2.2: rol que no corresponde → 403, con estado, cuerpo y sin cambios en la base.
test("Un artesano no puede crear un rubro: devuelve 403 y no se guarda nada", async () => {
  const { tokenAna } = datos;
  const antes = await prisma.rubro.count();

  const { body } = await crearRubro(tokenAna, { nom_rubro: "Cerámica" }).expect(403);

  assert.equal(body.mensaje, "No tiene permiso para esta operación.");
  assert.equal(await prisma.rubro.count(), antes);
});

// 2.5: alta correcta verificada en la base y asociada a la cuenta (la postulación pertenece al usuario creado).
test("Registrar un artesano guarda su postulación asociada a su propia cuenta", async () => {
  const { rubro } = datos;
  const { body: carla } = await request(app).post("/usuarios").send({
    nombre: "Carla",
    apellido: "Prueba",
    email: "carla@pruebas.test",
    contrasena: "ClaveDePrueba2026!",
    postulacion: {
      dni: "30000099",
      celular: "3834123456",
      nom_emprend: "Emprendimiento de Carla",
      desc_emprend: "Artesanías en madera",
      rubroId: rubro.id_rubro,
      provincia: "Catamarca",
      localidad: "HUAYCAMA"
    }
  }).expect(201);

  const postulacion = await prisma.postulacion.findUniqueOrThrow({ where: { dni: "30000099" } });
  assert.equal(postulacion.usuarioId, carla.id_usuario);
  assert.equal(postulacion.rubroId, rubro.id_rubro);
  assert.equal(postulacion.std_postulacion, "PENDIENTE");
});