import { test, after } from "node:test"; 
import assert from "node:assert/strict";

assert.equal(process.env.NODE_ENV, "test", "El entorno debe ser 'test'");
assert.ok(process.env.DATABASE_URL.includes("_test"));

import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js"; 

test("GET /api/ubicaciones/provincias obtiene la lista (200 OK)", async () => {
    await request(app).get("/api/ubicaciones/provincias").expect(200);
});

test("GET /api/ubicaciones/localidades/:provincia obtiene la lista (200 OK)", async () => {
    await request(app).get("/api/ubicaciones/localidades/Catamarca").expect(200);
});

test("GET /api/ubicaciones/localidades/:provincia devuelve 404 si no existe", async () => {
    await request(app).get("/api/ubicaciones/localidades/ProvinciaFalsa").expect(404);
});

after(async () => {
    await prisma.$disconnect();
});