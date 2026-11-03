// ==========================================
// ESQUEMAS DE PRODUCTOS
// ==========================================
export const NuevoProducto = {
    type: "object",
    properties: {
        nom_producto: { type: "string", example: "Poncho de vicuña tejido a mano" },
        desc_producto: { type: "string", example: "Poncho tradicional con tintes naturales de la región." },
        precio: { type: "number", example: 150000 },
        std_producto: { type: "boolean", example: true },
        artesanoId: { type: "integer", example: 1 }
    },
    required: ["nom_producto", "precio"]
};

// ==========================================
// ESQUEMAS DE ARTESANOS
// ==========================================
export const AsignacionStand = {
    type: "object",
    properties: {
        standId: { type: "integer", example: 45 }
    },
    required: ["standId"]
};

export const ActualizarArtesano = {
    type: "object",
    properties: {
        nombre: { type: "string", example: "María" },
        apellido: { type: "string", example: "Gómez" },
        celular: { type: "string", example: "3834123456" },
        rubro: { type: "string", example: "Textil" }
    }
};

// ==========================================
// ESQUEMAS DE POSTULACIONES
// ==========================================
export const ActualizarPostulacion = {
    type: "object",
    properties: {
        dni: { type: "string", example: "12345678" },
        celular: { type: "string", example: "3834123456" },
        nom_emprend: { type: "string", example: "Artesanías del Valle" },
        desc_emprend: { type: "string", example: "Fabricación de piezas únicas en arcilla." },
        trayectoria: { type: "string", example: "5 años de experiencia comprobable" },
        rubroId: { type: "integer", example: 2 },
        provincia: { type: "string", example: "Catamarca" },
        localidad: { type: "string", example: "BELEN" }
    }
};

export const EvaluarPostulacion = {
    type: "object",
    properties: {
        std_postulacion: { 
            type: "string", 
            enum: ['EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA'], 
            example: "APROBADA" 
        },
        observacion: { type: "string", example: "La postulación cumple con todos los requisitos y fotos solicitadas." }
    },
    required: ["std_postulacion"]
};