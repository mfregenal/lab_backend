import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { actualizarUsuarioSchema, actualizarEstadoUsuarioSchema } from "../src/validators/usuario.schema.js";

// 2.3: pruebas unitarias con safeParse, incluidos los casos de campo adicional rechazado (esquemas .strict()).
describe("usuario-schema", () => {
    const casos = [
      ["actualizar usuario: nombre válido", actualizarUsuarioSchema, { nombre: "Ana" }, true],
      ["actualizar usuario: nombre de 1 carácter", actualizarUsuarioSchema, { nombre: "A" }, false],
      ["actualizar usuario: campo adicional rechazado", actualizarUsuarioSchema, { nombre: "Ana", esAdmin: true }, false],
      ["estado: booleano válido", actualizarEstadoUsuarioSchema, { std_usuario: false }, true],
      ["estado: valor no booleano", actualizarEstadoUsuarioSchema, { std_usuario: "no" }, false],
      ["estado: campo adicional rechazado", actualizarEstadoUsuarioSchema, { std_usuario: true, rol: "ADMINISTRADOR" }, false],
    ];

    for (const [nombre, esquema, entrada, valido] of casos) {
      test(`Esquema de usuario: ${nombre}`, () => {
        assert.equal(esquema.safeParse(entrada).success, valido);
      });
    }
});
