import { test } from 'node:test';
import assert from 'node:assert';
import { consultarArtesanosSchema, asignarStandSchema } from '../src/middlewares/validarArtesanoMiddleware.js'; // Ajustá la ruta si es distinta

// ==========================================
// TESTS DE CONSULTA (GET /artesanos)
// ==========================================

test("Esquema Artesano (Consulta) - Válido: Sin parámetros (usa defaults)", () => {
    const resultado = consultarArtesanosSchema.safeParse({});
    assert.strictEqual(resultado.success, true);
    assert.strictEqual(resultado.data.pagina, 1);
    assert.strictEqual(resultado.data.limite, 10);
});

test("Esquema Artesano (Consulta) - Válido: Con filtros de texto", () => {
    const resultado = consultarArtesanosSchema.safeParse({ 
        provincia: "Catamarca", 
        pagina: "2" // Se coerce a número 
    });
    assert.strictEqual(resultado.success, true);
    assert.strictEqual(resultado.data.pagina, 2);
});

test("Esquema Artesano (Consulta) - Inválido: Página negativa", () => {
    const resultado = consultarArtesanosSchema.safeParse({ pagina: -5 });
    assert.strictEqual(resultado.success, false);
});

// ==========================================
// TESTS DE ASIGNACIÓN DE STAND
// ==========================================

test("Esquema Artesano (Asignar Stand) - Válido: ID numérico positivo", () => {
    const resultado = asignarStandSchema.safeParse({ standId: 10 });
    assert.strictEqual(resultado.success, true);
});

test("Esquema Artesano (Asignar Stand) - Inválido: ID negativo o cero", () => {
    const resultado1 = asignarStandSchema.safeParse({ standId: -1 });
    const resultado2 = asignarStandSchema.safeParse({ standId: 0 });
    assert.strictEqual(resultado1.success, false);
    assert.strictEqual(resultado2.success, false);
});
