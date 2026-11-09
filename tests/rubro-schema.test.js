import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { crearRubroSchema } from "../src/validators/rubro.schema.js";

// 2.3: pruebas unitarias con safeParse y una tabla de casos válidos e inválidos.
describe("rubro-schema", () => {
    const casos = [
      ["nombre válido", { nom_rubro: "Textiles" }, true],
      ["con descripción", { nom_rubro: "Textiles", desc_rubro: "Tejidos" }, true],
      ["descripción nula", { nom_rubro: "Textiles", desc_rubro: null }, true],
      ["nombre ausente", {}, false],
      ["nombre de 1 carácter", { nom_rubro: "A" }, false],
      ["nombre de 2 caracteres", { nom_rubro: "AB" }, true],
      ["nombre de 100 caracteres", { nom_rubro: "a".repeat(100) }, true],
      ["nombre de 101 caracteres", { nom_rubro: "a".repeat(101) }, false],
      ["nombre numérico", { nom_rubro: 123 }, false],
      ["descripción de 255 caracteres", { nom_rubro: "Textiles", desc_rubro: "a".repeat(255) }, true],
      ["descripción de 256 caracteres", { nom_rubro: "Textiles", desc_rubro: "a".repeat(256) }, false],
    ];

    for (const [nombre, entrada, valido] of casos) {
      test(`Esquema de rubro: ${nombre}`, () => {
        const resultado = crearRubroSchema.safeParse(entrada);
        assert.equal(resultado.success, valido);
      });
    }
});
