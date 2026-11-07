import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { app } from "../src/app.js"; 
import prisma from "../src/config/prisma.js";
import { crearEscenario } from "./helpers/escenario-pap.js";

let datos;

beforeEach(async () => {
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

test("POST /productos sin token (401)", async () => {
    const respuesta = await request(app).post("/productos")
        .send({ nom_producto: "Mate Test", precio: 15000 })
        .expect(401);
        
    assert.deepEqual(respuesta.body, { mensaje: "Se requiere un token de acceso." });
});


test("POST /productos con Authorization mal formada (400)", async () => {
    const respuesta = await request(app).post("/productos")
        .set("Authorization", "BearerTokenPegadoSinEspacio") 
        .send({ nom_producto: "Mate Test", precio: 15000 })
        .expect(400);


    assert.deepEqual(respuesta.body, { mensaje: "Usar Authorization: Bearer <token>." });
});


test("POST /productos con token inválido/falso (401)", async () => {
    const respuesta = await request(app).post("/productos")
        .set("Authorization", "Bearer un.token.falso")
        .send({ nom_producto: "Mate Test", precio: 15000 })
        .expect(401);

    assert.deepEqual(respuesta.body, { mensaje: "El token es inválido, ha vencido o fue revocado." });
});


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

// ==========================================
// PAUTA 2.5: PERSISTENCIA Y PROPIEDAD
// ==========================================

test(" Alta correcta verificada en la base y pertenece a la cuenta autenticada", async () => {
    const { artesano, tokenArtesano } = datos;
    
    const respuesta = await request(app).post("/productos")
        .set("Authorization", `Bearer ${tokenArtesano}`)
        .send({ nom_producto: "Poncho Persistente", precio: 50000 });
    
    assert.equal(respuesta.status, 201);
    
    const idCreado = respuesta.body.id_producto || respuesta.body.data?.id_producto || respuesta.body.producto?.id_producto; 
    assert.ok(idCreado, "La API debe devolver el ID del producto creado");

    const productoEnBD = await prisma.producto.findUnique({
        where: { id_producto: idCreado }
    });
    
    assert.ok(productoEnBD, "El producto realmente debe existir en la base de datos");
    
    assert.equal(productoEnBD.artesanoId, artesano.id_artesano, "El producto debe pertenecer al artesano autenticado");
});

test(" Acceso a recurso ajeno (404), el registro sigue existiendo y no cambió de dueño", async () => {
    const { tokenArtesano, rubro } = datos; 
    
    const usuarioVictima = await prisma.usuario.create({
        data: { nombre: "Victima", apellido: "Test", email: "victima@test.com", passwordHash: "123", rol: "ARTESANO", std_usuario: true }
    });
    const artesanoVictima = await prisma.artesano.create({
        data: {
            usuario: { connect: { id_usuario: usuarioVictima.id_usuario } },
            postulacion: {
                create: {
                    dni: "99999999", celular: "111", nom_emprend: "V", desc_emprend: "V", trayectoria: "V", provincia: "Catamarca", localidad: "Capital", std_postulacion: "APROBADA", 
                    rubro: { connect: { id_rubro: rubro.id_rubro } }, 
                    usuario: { connect: { id_usuario: usuarioVictima.id_usuario } }
                }
            }
        }
    });
    const productoAjeno = await prisma.producto.create({
        data: { nom_producto: "Producto Ajeno", precio: 1000, artesanoId: artesanoVictima.id_artesano }
    });
    
    const respuesta = await request(app).delete(`/productos/${productoAjeno.id_producto}`)
        .set("Authorization", `Bearer ${tokenArtesano}`);
        
    assert.equal(respuesta.status, 404);
    
    const productoDespues = await prisma.producto.findUnique({
        where: { id_producto: productoAjeno.id_producto }
    });
    
    assert.ok(productoDespues, "El producto ajeno NO debe haber sido borrado de la base de datos");
    assert.equal(productoDespues.artesanoId, artesanoVictima.id_artesano, "El dueño del producto no debe haber cambiado");
});