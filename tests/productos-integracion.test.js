import { test, before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { crearEscenario } from "./helpers/escenario.js";

// Verificaciones de seguridad iniciales
assert.equal(process.env.NODE_ENV, "test");
assert.equal(new URL(process.env.DATABASE_URL).pathname, "/poncho_test");

const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../src/app.js");

let datos;

before(async () => { await prisma.$connect(); });
after(async () => { await prisma.$disconnect(); });

beforeEach(async () => {
    // 1. Limpiamos la base de datos en orden (hijos primero)
    await prisma.$transaction([
        prisma.producto.deleteMany(),
        prisma.artesano.deleteMany(),
        prisma.usuario.deleteMany()
    ]);
    // 2. Preparamos los datos nuevos
    datos = await crearEscenario(app, prisma);
});

// TEST: Creación exitosa
test("POST /productos con token correcto crea el producto (201)", async () => {
    const { artesano, tokenArtesano } = datos;
    
    // Le quitamos el .expect(201) para que no rompa y podamos leer la respuesta
    const respuesta = await request(app).post("/productos")
        .set("Authorization", `Bearer ${tokenArtesano}`)
        .send({ 
            nom_producto: "Mate Test", 
            precio: 15000, 
            artesanoId: artesano.id_artesano 
        }); 
        
    
    // Y verificamos el estado manualmente
    assert.equal(respuesta.status, 201);
});

// TEST: Sin Token
test("POST /productos sin token devuelve 401", async () => {
    const respuesta = await request(app).post("/productos")
        .send({ nom_producto: "Mate Test", precio: 15000, artesanoId: 1 })
        .expect(401);
        
    assert.deepEqual(respuesta.body, { mensaje: "Se requiere un token de acceso." }); // Ajustá al mensaje real de tu API
});

test("GET /productos devuelve la lista de productos (200)", async () => {
    const respuesta = await request(app).get("/productos");
    
    // Verificamos que responda 200 OK y que el cuerpo sea un array (o un objeto con un array adentro, dependiendo de cómo armes tu respuesta)
    assert.equal(respuesta.status, 200);
    assert.ok(Array.isArray(respuesta.body) || Array.isArray(respuesta.body.data)); 
});

test("GET /productos/:id devuelve un producto existente (200)", async () => {
    const { artesano } = datos;

    // 1. Creamos un producto de prueba directamente en la BD
    const productoCreado = await prisma.producto.create({
        data: {
            nom_producto: "Poncho de prueba GET",
            precio: 20000,
            artesanoId: artesano.id_artesano,
            // Agregá acá cualquier otro campo obligatorio que tenga tu tabla Producto (ej. stock, descripcion)
        }
    });

    // 2. Hacemos la petición GET a ese ID específico
    const respuesta = await request(app).get(`/productos/${productoCreado.id_producto}`);
    
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.nom_producto, "Poncho de prueba GET");
});

test("GET /productos/:id devuelve 404 si el producto no existe", async () => {
    // Le pasamos un ID altísimo que sabemos que no existe
    const respuesta = await request(app).get("/productos/999999");
    assert.equal(respuesta.status, 404);
});

// ==========================================
// TESTS DE ACTUALIZACIÓN (PUT / PATCH)
// ==========================================

test("PUT /productos/:id actualiza un producto con token correcto (200)", async () => {
    const { artesano, tokenArtesano } = datos;

    const productoCreado = await prisma.producto.create({
        data: {
            nom_producto: "Producto Viejo",
            precio: 1000,
            artesanoId: artesano.id_artesano
        }
    });

    const respuesta = await request(app)
        .put(`/productos/${productoCreado.id_producto}`)
        .set("Authorization", `Bearer ${tokenArtesano}`)
        .send({
            nom_producto: "Producto Actualizado",
            precio: 2500
        });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.nom_producto, "Producto Actualizado");
});

// ==========================================
// TESTS DE ELIMINACIÓN (DELETE)
// ==========================================

test("DELETE /productos/:id elimina un producto con token correcto (200 o 204)", async () => {
    const { artesano, tokenArtesano } = datos;

    const productoCreado = await prisma.producto.create({
        data: {
            nom_producto: "Producto para borrar",
            precio: 1000,
            artesanoId: artesano.id_artesano
        }
    });

    const respuesta = await request(app)
        .delete(`/productos/${productoCreado.id_producto}`)
        .set("Authorization", `Bearer ${tokenArtesano}`);

    // Algunos APIs devuelven 200 con un mensaje, otros 204 (Sin contenido). Ajustalo a tu código.
    assert.ok(respuesta.status === 200 || respuesta.status === 204);

    // Verificamos que realmente se haya borrado de la base de datos
    const productoEnBD = await prisma.producto.findUnique({
        where: { id_producto: productoCreado.id_producto }
    });
    
    // Debería ser null porque ya no existe
    assert.equal(productoEnBD, null); 
});