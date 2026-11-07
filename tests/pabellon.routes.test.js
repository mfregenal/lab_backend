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

test("POST /pabellones sin token devuelve 401", async () => {
    await request(app)
        .post("/pabellones")
        .send({ nom_pabellon: "Pabellon Test" })
        .expect(401);
});

test("GET /pabellones obtiene la lista de pabellones (200 OK)", async () => {
    const respuesta = await request(app).get("/pabellones").expect(200);
    assert.ok(Array.isArray(respuesta.body));
});

test("POST /pabellones con datos válidos crea el pabellón (201 Created)", async () => {
    const base = await crearEscenario(app, prisma);

    const respuesta = await request(app)
        .post("/pabellones")
        .set("Authorization", `Bearer ${base.tokenAdmin}`)
        .send({ nom_pabellon: "Nuevo Pabellón", desc_pabellon: "Test" })
        .expect(201);

    assert.equal(respuesta.body.nom_pabellon, "Nuevo Pabellón");
});

test("POST /pabellones con cabecera mal formada devuelve 400", async () => {
    await request(app)
        .post("/pabellones")
        .set("Authorization", "BearerTokenMalFormado")
        .send({ nom_pabellon: "Test" })
        .expect(400);
});

test("POST /pabellones con rol sin permisos (Artesano) devuelve 403", async () => {
    const base = await crearEscenario(app, prisma);

    await request(app)
        .post("/pabellones")
        .set("Authorization", `Bearer ${base.tokenArtesano}`)
        .send({ nom_pabellon: "Test" })
        .expect(403);
});

after(async () => {
    await prisma.$disconnect();
});