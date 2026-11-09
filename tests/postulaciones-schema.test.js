import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
    consultarPostulacionesSchema, 
    actualizarPostulacionSchema, 
    evaluarPostulacionSchema 
} from '../src/validators/postulacion.schema.js';

describe("postulaciones-schema", () => {
    // ==========================================
    // TESTS DE CONSULTA
    // ==========================================
    const casosConsulta = [
        {
            nombre: "Válido: Valores por defecto",
            datos: {},
            esValido: true
        },
        {
            nombre: "Válido: Con estado válido",
            datos: { estado: "PENDIENTE" },
            esValido: true
        }
    ];

    for (const caso of casosConsulta) {
        test(`Esquema Postulación (Consulta) - ${caso.nombre}`, () => {
            const resultado = consultarPostulacionesSchema.safeParse(caso.datos);
            assert.strictEqual(resultado.success, caso.esValido);
        });
    }

    // ==========================================
    // TESTS DE ACTUALIZACIÓN
    // ==========================================
    const casosActualizar = [
        {
            nombre: "Válido: Un solo campo",
            datos: { celular: "3834123456" },
            esValido: true
        },
        {
            nombre: "Inválido: Objeto vacío (falla el refine)",
            datos: {},
            esValido: false
        },
        {
            nombre: "Inválido: DNI muy corto",
            datos: { dni: "123" },
            esValido: false
        }
    ];

    for (const caso of casosActualizar) {
        test(`Esquema Postulación (Actualizar) - ${caso.nombre}`, () => {
            const resultado = actualizarPostulacionSchema.safeParse(caso.datos);
            assert.strictEqual(resultado.success, caso.esValido);
            
            // Mantenemos tu aserción específica para el error del refine
            if (!caso.esValido && Object.keys(caso.datos).length === 0) {
                assert.strictEqual(resultado.error.issues[0].message, "Debe enviar al menos un campo para actualizar.");
            }
        });
    }

    // ==========================================
    // TESTS DE EVALUACIÓN (Solo Admin)
    // ==========================================
    const casosEvaluar = [
        {
            nombre: "Válido: Estado aprobado",
            datos: { std_postulacion: "APROBADA" },
            esValido: true
        },
        {
            nombre: "Inválido: Estado inventado",
            datos: { std_postulacion: "INVENTADO" },
            esValido: false
        }
    ];

    for (const caso of casosEvaluar) {
        test(`Esquema Postulación (Evaluar) - ${caso.nombre}`, () => {
            const resultado = evaluarPostulacionSchema.safeParse(caso.datos);
            assert.strictEqual(resultado.success, caso.esValido);
        });
    }
});
