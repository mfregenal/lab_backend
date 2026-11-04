import { zodToJsonSchema } from "zod-to-json-schema";

// 1. IMPORTACIONES DE TUS VALIDADORES ZOD
import { asignarStandSchema } from "../validators/artesano.schema.js"; 
import { crearProductoSchema, actualizarProductoSchema } from "../validators/producto.schema.js"; 
import { actualizarPostulacionSchema, evaluarPostulacionSchema } from "../validators/postulacion.schema.js";

// 2. FUNCIÓN AYUDANTE (Convierte Zod a OpenAPI 3.0 e inyecta el ejemplo)
const desdeZod = (esquema, example) => ({
  ...zodToJsonSchema(esquema, { target: "openapi-3.0", io: "input" }),
  example
});

// ==========================================
// ESQUEMAS DE ARTESANOS
// ==========================================
export const AsignacionStand = desdeZod(asignarStandSchema, {
    standId: 45
});

// ==========================================
// ESQUEMAS DE PRODUCTOS
// ==========================================

const schemaNuevoProductoLimpio = crearProductoSchema.omit({ 
    std_producto: true, 
    artesanoId: true 
});

export const NuevoProducto = desdeZod(schemaNuevoProductoLimpio, {
    nom_producto: "Poncho de vicuña tejido a mano",
    desc_producto: "Poncho tradicional con tintes naturales de la región.",
    precio: 150000
});

export const ActualizarProducto = desdeZod(actualizarProductoSchema, {
    precio: 160000
});

// ==========================================
// ESQUEMAS DE POSTULACIONES
// ==========================================
export const ActualizarPostulacion = desdeZod(actualizarPostulacionSchema, {
    dni: "12345678",
    celular: "3834123456",
    nom_emprend: "Artesanías del Valle",
    desc_emprend: "Fabricación de piezas únicas en arcilla.",
    trayectoria: "5 años de experiencia comprobable",
    rubroId: 2,
    provincia: "Catamarca",
    localidad: "BELEN"
});

export const EvaluarPostulacion = desdeZod(evaluarPostulacionSchema, {
    std_postulacion: "APROBADA",
    observacion: "La postulación cumple con todos los requisitos y fotos solicitadas."
});

// ==========================================
// RESPUESTAS Y PARÁMETROS REUTILIZABLES 
// ==========================================
export const ErrorApi = {
    type: "object",
    properties: {
        mensaje: { type: "string", example: "Datos inválidos" },
        detalles: { type: "array", items: { type: "string" } }
    },
    required: ["mensaje"]
};

export const IdRuta = { type: "integer", minimum: 1 };
export const Pagina = { type: "integer", minimum: 1, default: 1 };
export const Limite = { type: "integer", minimum: 1, maximum: 100, default: 10 };