import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js"; 
import prisma from "../src/config/prisma.js";
import { crearEscenario } from "./helpers/escenario-pap.js";

let datos;
let idPostulacionGlobal;

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

    const postulacionBD = await prisma.postulacion.findFirst();
    idPostulacionGlobal = postulacionBD.id_postulacion; 
});

afterEach(async () => {
    await prisma.$disconnect();
});

// ==========================================
// TESTS DE LECTURA (GET)
// ==========================================

test("GET /postulaciones - Admin puede ver la lista (200)", async () => {
    const { tokenAdmin } = datos;
    const respuesta = await request(app)
        .get("/postulaciones")
        .set("Authorization", `Bearer ${tokenAdmin}`);
    
    assert.equal(respuesta.status, 200);
});

// ==========================================
// TESTS DE ACTUALIZACIÓN (PUT)
// ==========================================

test("PUT /postulaciones/:id/evaluar - Admin puede evaluar postulación (200)", async () => {
    const { tokenAdmin } = datos;
    
    await prisma.postulacion.update({
        where: { id_postulacion: idPostulacionGlobal },
        data: { std_postulacion: "EN_REVISION" }
    });

    const respuesta = await request(app)
        .put(`/postulaciones/${idPostulacionGlobal}/evaluar`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ 
            std_postulacion: "APROBADA",
            observacion: "Cumple con todos los requisitos, fotos excelentes." 
        });

    assert.ok(respuesta.status === 200 || respuesta.status === 204);
});

// ==========================================
// TEST DE ELIMINACIÓN (DELETE)
// ==========================================

test("DELETE /postulaciones/:id - Admin puede eliminar postulación (200 o 204)", async () => {
    const { tokenAdmin, artesano } = datos;

    await prisma.artesano.delete({
        where: { id_artesano: artesano.id_artesano }
    });

    const respuesta = await request(app)
        .delete(`/postulaciones/${idPostulacionGlobal}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

    assert.ok(respuesta.status === 200 || respuesta.status === 204);
});