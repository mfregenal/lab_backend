import { test } from 'node:test';
import assert from 'node:assert';
import { 
    consultarPostulacionesSchema, 
    actualizarPostulacionSchema, 
    evaluarPostulacionSchema 
} from '../src/middlewares/validarPostulacionMiddleware.js';

// ==========================================
// TESTS DE CONSULTA
// ==========================================

test("Esquema Postulación (Consulta) - Válido: Valores por defecto", () => {
    const resultado = consultarPostulacionesSchema.safeParse({});
    assert.strictEqual(resultado.success, true);
    assert.strictEqual(resultado.data.pagina, 1);
    assert.strictEqual(resultado.data.limite, 10);
});

test("Esquema Postulación (Consulta) - Válido: Con estado válido", () => {
    const resultado = consultarPostulacionesSchema.safeParse({ estado: "PENDIENTE" });
    assert.strictEqual(resultado.success, true);
});

// ==========================================
// TESTS DE ACTUALIZACIÓN
// ==========================================

test("Esquema Postulación (Actualizar) - Válido: Un solo campo", () => {
    const resultado = actualizarPostulacionSchema.safeParse({ celular: "3834123456" });
    assert.strictEqual(resultado.success, true);
});

test("Esquema Postulación (Actualizar) - Inválido: Objeto vacío (falla el refine)", () => {
    const resultado = actualizarPostulacionSchema.safeParse({});
    assert.strictEqual(resultado.success, false);
    assert.strictEqual(resultado.error.issues[0].message, "Debe enviar al menos un campo para actualizar.");
});

test("Esquema Postulación (Actualizar) - Inválido: DNI muy corto", () => {
    const resultado = actualizarPostulacionSchema.safeParse({ dni: "123" });
    assert.strictEqual(resultado.success, false);
});

// ==========================================
// TESTS DE EVALUACIÓN (Solo Admin)
// ==========================================

test("Esquema Postulación (Evaluar) - Válido: Estado aprobado", () => {
    const resultado = evaluarPostulacionSchema.safeParse({ std_postulacion: "APROBADA" });
    assert.strictEqual(resultado.success, true);
});

test("Esquema Postulación (Evaluar) - Inválido: Estado inventado", () => {
    const resultado = evaluarPostulacionSchema.safeParse({ std_postulacion: "INVENTADO" });
    assert.strictEqual(resultado.success, false);
});