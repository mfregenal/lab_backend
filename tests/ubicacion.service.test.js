import { test } from "node:test";
import assert from "node:assert/strict";
import { obtenerProvinciasService, obtenerLocalidadesPorProvinciaService } from "../src/services/ubicaciones.service.js"; 

test("Servicio Ubicaciones: obtenerProvinciasService devuelve una lista alfabética sin repetidos", () => {
    const provincias = obtenerProvinciasService();
    
    assert.ok(Array.isArray(provincias), "Debe devolver un arreglo");
    assert.ok(provincias.length > 0, "El arreglo no debe estar vacío");
    assert.ok(provincias.includes("Catamarca"), "Debe incluir a Catamarca, sede del Poncho");
});

test("Servicio Ubicaciones: obtenerLocalidadesPorProvinciaService devuelve las localidades correctas", () => {
    const localidades = obtenerLocalidadesPorProvinciaService("catamarca"); 
    
    assert.ok(Array.isArray(localidades));
    assert.ok(localidades.length > 0);
});

test("Servicio Ubicaciones: Devuelve arreglo vacío si la provincia no existe", () => {
    const localidades = obtenerLocalidadesPorProvinciaService("ProvinciaInexistente");
    assert.equal(localidades.length, 0);
});