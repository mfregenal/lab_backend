import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { app } from "../src/app.js"; 
import prisma from "../src/config/prisma.js";
import { crearEscenario } from "./helpers/escenario.js";

let datos;
let idPostulacionGlobal;

beforeEach(async () => {
    // Limpieza
    await prisma.artesano.deleteMany();
    await prisma.postulacion.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.rubro.deleteMany();

    datos = await crearEscenario(app, prisma);

    // Como el escenario crea la postulación junto con el artesano, la buscamos
    const postulacionBD = await prisma.postulacion.findFirst();
    idPostulacionGlobal = postulacionBD.id_postulacion; // Ajustá si tu ID se llama distinto (ej. id)
});

afterEach(async () => {
    await prisma.$disconnect();
});



// ==========================================
// TESTS DE ACTUALIZACIÓN (PUT)
// ==========================================

test("PUT /postulaciones/:id/evaluar - Admin puede evaluar postulación (200)", async () => {
    const { tokenAdmin } = datos;
    
    // FIX: Ponemos la postulación en EN_REVISION simulando que está lista para que el Admin la vea
    await prisma.postulacion.update({
        where: { id_postulacion: idPostulacionGlobal },
        data: { std_postulacion: "EN_REVISION" }
    });

    // El admin la evalúa y la pasa a APROBADA
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
    
    // FIX: Eliminamos el Artesano primero para liberar la Foreign Key y que Prisma nos deje borrar la postulación
    await prisma.artesano.delete({
        where: { id_artesano: artesano.id_artesano }
    });

    const respuesta = await request(app)
        .delete(`/postulaciones/${idPostulacionGlobal}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

    assert.ok(respuesta.status === 200 || respuesta.status === 204);
});