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

test("POST /stands sin token devuelve 401", async () => {
    await request(app)
        .post("/stands")
        .send({ codigo: "TEST-01", sectorId: 1 })
        .expect(401);
});

test("GET /stands obtiene la lista de stands (200 OK)", async () => {
    const respuesta = await request(app).get("/stands").expect(200);
    assert.ok(Array.isArray(respuesta.body.stands));
});

test("POST /stands con datos válidos crea el stand (201 Created)", async () => {
    const base = await crearEscenario(app, prisma);

    const respuesta = await request(app)
        .post("/stands")
        .set("Authorization", `Bearer ${base.tokenAdmin}`)
        .send({ codigo: `ST-NUEVO-${Date.now()}`, sectorId: base.sector.id_sector })
        .expect(201);

    const standGuardado = await prisma.stand.findUniqueOrThrow({
        where: { id_stand: respuesta.body.id_stand }
    });

    assert.ok(standGuardado);
});

test("POST /stands con cabecera mal formada devuelve 400", async () => {
    const base = await crearEscenario(app, prisma);

    await request(app)
        .post("/stands")
        .set("Authorization", "BearerTokenMalFormado")
        .send({ codigo: "ST-99", sectorId: base.sector.id_sector })
        .expect(400);
});

test("POST /stands con rol sin permisos (Artesano) devuelve 403", async () => {
    const base = await crearEscenario(app, prisma);

    await request(app)
        .post("/stands")
        .set("Authorization", `Bearer ${base.tokenArtesano}`)
        .send({ codigo: "ST-99", sectorId: base.sector.id_sector })
        .expect(403);
});

test("POST /stands con token inválido devuelve 401", async () => {
    const base = await crearEscenario(app, prisma);
    const tokenInvalido = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5LCJyb2wiOiJBRE1JTklTVFJBRE9SIn0.firmaFalsa123";

    await request(app)
        .post("/stands")
        .set("Authorization", `Bearer ${tokenInvalido}`)
        .send({ codigo: "ST-99", sectorId: base.sector.id_sector })
        .expect(401);
});

after(async () => {
    await prisma.$disconnect();
});