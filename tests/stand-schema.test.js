import { test } from "node:test";
import assert from "node:assert/strict";
import { crearStandSchema } from "../src/validators/stand.schema.js"; 

const casos = [
    ["datos válidos con sectorId", { codigo: "ST-01", sectorId: 1 }, true],
    ["datos válidos con id_sector", { codigo: "ST-02", id_sector: 5 }, true],
    ["datos válidos con coordenadas", { codigo: "ST-03", sectorId: 1, latitud: -28.46, longitud: -65.78 }, true],
    

    ["rechaza código ausente", { sectorId: 1 }, false],
    ["rechaza código vacío", { codigo: "   ", sectorId: 1 }, false],
    ["rechaza falta de sector (ambos ausentes)", { codigo: "ST-04" }, false],
    ["rechaza latitud fuera de rango", { codigo: "ST-05", sectorId: 1, latitud: 95 }, false],
    ["rechaza longitud fuera de rango", { codigo: "ST-06", sectorId: 1, longitud: -200 }, false],
    ["rechaza sector negativo", { codigo: "ST-07", sectorId: -2 }, false]
];

for (const [nombre, entrada, valido] of casos) {
    test(`Esquema crearStand: ${nombre}`, () => {
        const resultado = crearStandSchema.safeParse(entrada);
        assert.equal(resultado.success, valido);
    });
}