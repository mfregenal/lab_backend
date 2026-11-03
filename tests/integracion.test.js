import { test, before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { crearEscenario } from "./helpers/escenario.js";

// Protección: Para no ejecutar por error en entorno de desarrollo.
assert.equal(process.env.NODE_ENV, "test"); // Verifica que el entorno sea de pruebas.
assert.match(new URL(process.env.DATABASE_URL).pathname, /_test$/); // Verifica que la base de datos sea de pruebas (termina en "_test").
assert.ok(process.env.ADMIN_TEST_EMAIL && process.env.ADMIN_TEST_PASSWORD, "Faltan ADMIN_TEST_EMAIL y ADMIN_TEST_PASSWORD en .env.test"); // Verifica que las credenciales de administrador de pruebas estén definidas.

const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../src/app.js");

let datos;

before(async () => { await prisma.$connect(); });
after(async () => { await prisma.$disconnect(); });

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

test("Ana no puede modificar el perfil de Bruno", async () => {
  const { bruno, tokenAna } = datos;

  const { body } = await request(app).put(`/usuarios/${bruno.id_usuario}`)
    .set("Authorization", `Bearer ${tokenAna}`)
    .send({ nombre: "Modificado" }).expect(403);

  assert.equal(body.mensaje, "No tienes permisos para modificar el perfil de otro usuario");
  const guardado = await prisma.usuario.findUniqueOrThrow({ where: { id_usuario: bruno.id_usuario } });
  assert.equal(guardado.nombre, "Bruno");
});

test("Crear un rubro duplicado devuelve 409 y conserva un solo registro", async () => {
  const { tokenAdmin } = datos;
  await crearRubro(tokenAdmin, { nom_rubro: "Cerámica" }).expect(201);

  const { body } = await crearRubro(tokenAdmin, { nom_rubro: "Cerámica" }).expect(409);

  assert.equal(body.mensaje, "El nombre del rubro ya existe");
  assert.equal(await prisma.rubro.count({ where: { nom_rubro: "Cerámica" } }), 1);
});