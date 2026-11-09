import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { consultarArtesanosSchema, asignarStandSchema } from '../src/validators/artesano.schema.js';

describe("artesanos-schema", () => {
    // ==========================================
    // TESTS DE CONSULTA (GET /artesanos)
    // ==========================================

    const casosConsulta = [
        {
            nombre: "Válido: Sin parámetros (usa defaults)",
            datos: {},
            esValido: true
        },
        {
            nombre: "Válido: Con filtros de texto",
            datos: { provincia: "Catamarca", pagina: "2" },
            esValido: true
        },
        {
            nombre: "Inválido: Página negativa",
            datos: { pagina: -5 },
            esValido: false
        }
    ];

    for (const caso of casosConsulta) {
        test(`Esquema Consulta Artesano - ${caso.nombre}`, () => {
            const resultado = consultarArtesanosSchema.safeParse(caso.datos);
            assert.strictEqual(resultado.success, caso.esValido);
        });
    }

    // ==========================================
    // TESTS DE ASIGNACIÓN DE STAND
    // ==========================================

    const casosStand = [
        {
            nombre: "Válido: ID numérico positivo",
            datos: { standId: 10 },
            esValido: true
        },
        {
            nombre: "Inválido: ID negativo o cero",
            datos: { standId: 0 },
            esValido: false
        },
        {
            nombre: "Inválido: Campo extra rechazado por .strict()",
            datos: { standId: 10, campoInventado: "trampa" },
            esValido: false
        }
    ];

    for (const caso of casosStand) {
        test(`Esquema Asignar Stand - ${caso.nombre}`, () => {
            const resultado = asignarStandSchema.safeParse(caso.datos);
            assert.strictEqual(resultado.success, caso.esValido);
        });
    }
});
