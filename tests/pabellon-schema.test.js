import { test } from "node:test";
import assert from "node:assert/strict";
import { crearPabellonSchema } from "../src/validators/pabellon.schema.js"; 

const casos = [
    ["datos válidos", { nom_pabellon: "Pabellón Central" }, true],
    ["rechaza nombre ausente", { otro_campo: "algo" }, false],
    ["rechaza nombre vacío", { nom_pabellon: "   " }, false]
];

for (const [nombre, entrada, valido] of casos) {
    test(`Esquema crearPabellon: ${nombre}`, () => {
        const resultado = crearPabellonSchema.safeParse(entrada);
        assert.equal(resultado.success, valido);
    });
}