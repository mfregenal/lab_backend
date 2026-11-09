import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { crearProductoSchema } from "../src/validators/producto.schema.js"; 

describe("productos-schema", () => {
    const casos = [
        {
            nombre: "Válido: Datos correctos",
            datos: { nom_producto: "Poncho", desc_producto: "Lana", precio: 20000 },
            esValido: true
        },
        {
            nombre: "Inválido: Falta nombre",
            datos: { desc_producto: "Lana", precio: 20000 },
            esValido: false
        },
        {
            nombre: "Inválido: Precio negativo",
            datos: { nom_producto: "Poncho", precio: -500 },
            esValido: false
        },
        {
            nombre: "Inválido: Campo adicional rechazado (artesanoId inyectado)",
            datos: { nom_producto: "Poncho", desc_producto: "Lana", precio: 20000, artesanoId: 1 },
            esValido: false
        }
    ];

    for (const caso of casos) {
        test(`Esquema Producto - ${caso.nombre}`, () => {
            const esquemaEstricto = crearProductoSchema.omit({ artesanoId: true }).strict();
            
            const resultado = esquemaEstricto.safeParse(caso.datos);
            assert.equal(resultado.success, caso.esValido);
        });
    }
});
