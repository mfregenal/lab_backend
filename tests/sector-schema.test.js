import { test } from "node:test";
import assert from "node:assert/strict";
import { crearSectorSchema } from "../src/validators/sector.schema.js"; 

const casos = [
    ["datos válidos con pabellonId", { nom_sector: "Sector A", pabellonId: 1 }, true],
    ["rechaza nombre ausente", { pabellonId: 1 }, false],
    ["rechaza nombre vacío", { nom_sector: "   ", pabellonId: 1 }, false],
    ["rechaza falta de pabellón", { nom_sector: "Sector B" }, false],
    ["rechaza pabellón negativo", { nom_sector: "Sector C", pabellonId: -1 }, false]
];

for (const [nombre, entrada, valido] of casos) {
    test(`Esquema crearSector: ${nombre}`, () => {
        const resultado = crearSectorSchema.safeParse(entrada);
        assert.equal(resultado.success, valido);
    });
}