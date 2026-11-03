//Prueba que las peticiones inválidas sean rechazadas de inmediato por el middleware autenticarUsuario antes de tocar la base de datos o el controlador
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET ??= "secreto-exclusivo-de-pruebas";

const { app } = await import("../src/app.js");

// Estos casos se rechazan en autenticarUsuario, antes de consultar la base de datos.
test("POST /rubros sin token devuelve 401", async () => {
  const respuesta = await request(app).post("/rubros")
    .send({ nom_rubro: "Textiles" }).expect(401)
    .expect("Content-Type", /json/);

  assert.deepEqual(respuesta.body, {
    mensaje: "Se requiere un token de acceso."
  });
});

test("POST /rubros con cabecera mal formada devuelve 400", async () => {
  await request(app).post("/rubros")
    .set("Authorization", "Basic abc")
    .send({ nom_rubro: "Textiles" })
    .expect("Content-Type", /json/)
    .expect(400, {
      mensaje: "Usar Authorization: Bearer <token>."
    });
});

test("POST /rubros con token inválido devuelve 401", async () => {
  await request(app).post("/rubros")
    .set("Authorization", "Bearer token-invalido")
    .send({ nom_rubro: "Textiles" })
    .expect("Content-Type", /json/)
    .expect(401, {
      mensaje: "El token es inválido, ha vencido o fue revocado."
    });
});