import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js"; 
import prisma from "../src/config/prisma.js";
import { crearEscenario } from "./helpers/escenario-pap.js";

let datos;

beforeEach(async () => {
    await prisma.producto.deleteMany(); 
    await prisma.artesano.deleteMany();
    await prisma.postulacion.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.rubro.deleteMany();
    await prisma.stand.deleteMany();
    await prisma.sector.deleteMany();
    await prisma.pabellon.deleteMany();

    datos = await crearEscenario(app, prisma);
});

afterEach(async () => {
    await prisma.$disconnect();
});

// ==========================================
// TESTS DE LECTURA (GET)
// ==========================================

test("GET /artesanos - Admin puede ver la lista (200)", async () => {
    const { tokenAdmin } = datos;
    const respuesta = await request(app)
        .get("/artesanos")
        .set("Authorization", `Bearer ${tokenAdmin}`);
    
    assert.equal(respuesta.status, 200);
});

test("GET /artesanos - Artesano recibe 403 porque es exclusivo de Admin", async () => {
    const { tokenArtesano } = datos;
    const respuesta = await request(app)
        .get("/artesanos")
        .set("Authorization", `Bearer ${tokenArtesano}`);
    
    assert.equal(respuesta.status, 403);
});

test("GET /artesanos/:id - Artesano puede ver su propio perfil (200)", async () => {
    const { artesano, tokenArtesano } = datos;
    const respuesta = await request(app)
        .get(`/artesanos/${artesano.id_artesano}`)
        .set("Authorization", `Bearer ${tokenArtesano}`);
    
    assert.equal(respuesta.status, 200);
});

// ==========================================
// TESTS DE ACTUALIZACIÓN Y STAND (PUT / POST)
// ==========================================


test("POST /artesanos/:id/stand con rol no autorizado (ARTESANO) (403)", async () => {
    const { artesano, tokenArtesano } = datos; 
    
    const respuesta = await request(app).post(`/artesanos/${artesano.id_artesano}/stand`)
        .set("Authorization", `Bearer ${tokenArtesano}`)
        .send({ standId: 1 })
        .expect(403);

    assert.deepEqual(respuesta.body, { mensaje: "No tiene permiso para esta operación." });
});

test("PUT /artesanos/:id - Artesano puede actualizar su perfil (200)", async () => {
    const { artesano, tokenArtesano } = datos;
    const respuesta = await request(app)
        .put(`/artesanos/${artesano.id_artesano}`)
        .set("Authorization", `Bearer ${tokenArtesano}`)
        .send({
            celular: "3834999999"
        });

    assert.ok(respuesta.status === 200 || respuesta.status === 204);
});

// ==========================================
// TESTS DE ELIMINACIÓN (DELETE)
// ==========================================

test("DELETE /artesanos/:id - Admin puede eliminar un artesano (200 o 204)", async () => {
    const { artesano, tokenAdmin } = datos;
    const respuesta = await request(app)
        .delete(`/artesanos/${artesano.id_artesano}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

    assert.ok(respuesta.status === 200 || respuesta.status === 204);
});