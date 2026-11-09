import { test, beforeEach, after, describe } from "node:test";
import assert from "node:assert/strict";

assert.equal(process.env.NODE_ENV, "test", "El entorno debe ser 'test'");
assert.ok(process.env.DATABASE_URL.includes("_test"), "Debe apuntar a la bd de pruebas");

import request from "supertest";
import { app } from "../src/app.js";
import prisma from "../src/config/prisma.js";
import { crearEscenario } from "./helpers/escenario-upss.js";

describe("integracion-upss", () => {
    beforeEach(async () => {
        await prisma.$transaction([
            prisma.stand.deleteMany(),
            prisma.sector.deleteMany(),
            prisma.pabellon.deleteMany(),
            prisma.usuario.deleteMany()
        ]);
    });

    after(async () => {
        await prisma.$disconnect();
    });

    // ==========================================
    // UBICACIONES
    // ==========================================

    test("GET /api/ubicaciones/provincias obtiene la lista (200 OK)", async () => {
        await request(app).get("/api/ubicaciones/provincias").expect(200);
    });

    test("GET /api/ubicaciones/localidades/:provincia obtiene la lista (200 OK)", async () => {
        await request(app).get("/api/ubicaciones/localidades/Catamarca").expect(200);
    });

    test("GET /api/ubicaciones/localidades/:provincia devuelve 404 si no existe", async () => {
        await request(app).get("/api/ubicaciones/localidades/ProvinciaFalsa").expect(404);
    });

    // ==========================================
    // PABELLONES
    // ==========================================

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

    // ==========================================
    // SECTORES
    // ==========================================

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

    // ==========================================
    // STANDS
    // ==========================================

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
});
