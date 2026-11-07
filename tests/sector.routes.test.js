import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";

assert.equal(process.env.NODE_ENV, "test", "El entorno debe ser 'test'");
assert.ok(process.env.DATABASE_URL.includes("_test"), "Debe apuntar a la bd de pruebas");

import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";
import { crearEscenario } from "./helpers/escenario-upss.js";

beforeEach(async () => {
    await prisma.$transaction([
        prisma.stand.deleteMany(),
        prisma.sector.deleteMany(),
        prisma.pabellon.deleteMany(),
        prisma.usuario.deleteMany()
    ]);
});

test("POST /sectores sin token devuelve 401", async () => {
    await request(app).post("/sectores").send({ nom_sector: "Test", pabellonId: 1 }).expect(401);
});

test("GET /sectores obtiene la lista de sectores (200 OK)", async () => {
    const respuesta = await request(app).get("/sectores").expect(200);
    assert.ok(Array.isArray(respuesta.body));
});

test("POST /sectores con datos válidos crea el sector (201 Created)", async () => {
    const base = await crearEscenario(app, prisma);

    const respuesta = await request(app)
        .post("/sectores")
        .set("Authorization", `Bearer ${base.tokenAdmin}`)
        .send({ nom_sector: "Nuevo Sector", pabellonId: base.pabellon.id_pabellon })
        .expect(201);

    assert.equal(respuesta.body.nom_sector, "Nuevo Sector");
    assert.equal(respuesta.body.pabellonId, base.pabellon.id_pabellon);
});

test("POST /sectores con cabecera mal formada devuelve 400", async () => {
    const base = await crearEscenario(app, prisma);
    await request(app)
        .post("/sectores")
        .set("Authorization", "BearerMalFormado")
        .send({ nom_sector: "Test", pabellonId: base.pabellon.id_pabellon })
        .expect(400);
});

test("POST /sectores con rol sin permisos (Artesano) devuelve 403", async () => {
    const base = await crearEscenario(app, prisma);
    await request(app)
        .post("/sectores")
        .set("Authorization", `Bearer ${base.tokenArtesano}`)
        .send({ nom_sector: "Test", pabellonId: base.pabellon.id_pabellon })
        .expect(403);
});

test("POST /sectores con token inválido devuelve 401", async () => {
    const base = await crearEscenario(app, prisma);
    const tokenInvalido = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5LCJyb2wiOiJBRE1JTklTVFJBRE9SIn0.firmaFalsa123";

    await request(app)
        .post("/sectores")
        .set("Authorization", `Bearer ${tokenInvalido}`)
        .send({ nom_sector: "Test", pabellonId: base.pabellon.id_pabellon })
        .expect(401);
});

after(async () => {
    await prisma.$disconnect();
});