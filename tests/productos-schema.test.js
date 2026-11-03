import test from "node:test";
import assert from "node:assert/strict";
import { crearProductoSchema } from "../src/validators/producto.schema.js"; // Ajustá tu ruta

const casos = [
    ["Válido: Datos correctos", { nom_producto: "Poncho", desc_producto: "Lana", precio: 20000, artesanoId: 1 }, true],
    ["Inválido: Falta nombre", { desc_producto: "Lana", precio: 20000, artesanoId: 1 }, false],
    ["Inválido: Precio negativo", { nom_producto: "Poncho", precio: -500, artesanoId: 1 }, false],
    ["Inválido: ID en texto", { nom_producto: "Poncho", precio: 20000, artesanoId: "1" }, false]
];

for (const [nombre, entrada, valido] of casos) {
    test(`Esquema Producto - ${nombre}`, () => {
        const resultado = crearProductoSchema.safeParse(entrada);
        assert.equal(resultado.success, valido);
    });
}