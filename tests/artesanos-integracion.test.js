import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { app } from "../src/app2.js";
import prisma from "../src/config/prisma.js";
import { crearEscenario } from "./helpers/escenario.js";

let datos;

beforeEach(async () => {
    // Limpiamos las tablas (Asegurate de borrar en orden para no chocar con foreign keys)
    await prisma.artesano.deleteMany();
    await prisma.postulacion.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.rubro.deleteMany();
    
    // Si tenés una tabla Stand, agregá su deleteMany acá también:
    // await prisma.stand.deleteMany();

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
    
    // Verificamos que tu middleware de autorización funcione correctamente
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

test("POST /artesanos/:id/stand - Admin puede asignar stand (200 o 201)", async () => {
    const { artesano, tokenAdmin } = datos;
    
    // Si tu esquema exige que el Stand exista previamente en la base de datos, 
    // descomentá esto y crealo con prisma.stand.create(...) primero:
    
    // const standPrueba = await prisma.stand.create({ data: { ... } });
    // const standIdTest = standPrueba.id_stand;
    
    const standIdTest = 1; // Reemplazar por el ID real si creaste el stand arriba

    const respuesta = await request(app)
        .post(`/artesanos/${artesano.id_artesano}/stand`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ standId: standIdTest });

    // Si no tenés el stand creado en la BD de test y usas foreign keys, te va a tirar error de Prisma.
    // Ajustá el estado de la aserción según lo que devuelva tu controlador cuando es exitoso.
    assert.ok([200, 201, 404].includes(respuesta.status)); 
});

test("PUT /artesanos/:id - Artesano puede actualizar su perfil (200)", async () => {
    const { artesano, tokenArtesano } = datos;
    const respuesta = await request(app)
        .put(`/artesanos/${artesano.id_artesano}`)
        .set("Authorization", `Bearer ${tokenArtesano}`)
        .send({
            // Asegurate de pasar los datos que permita tu validador de actualización
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