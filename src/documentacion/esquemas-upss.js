import { nullable, z } from "zod";

export const ErrorApi = {
    type: "object",
    required: ["mensaje"],
    properties: {
        mensaje: { type: "string" }
    },
    example: {
        mensaje: "Descripción detallada del error."
    }
};

export const PabellonDetalle = {
    type: "object",
    required: ["id_pabellon", "nom_pabellon"],
    properties: {
        id_pabellon: { type: "integer" },
        nom_pabellon: { type: "string" },
        desc_pabellon: { type: "string", nullable: true }
    },
    example: {
        id_pabellon: 1,
        nom_pabellon: "Pabellón de las Provincias",
        desc_pabellon: "Espacio principal destinado al turismo e historia."
    }
};

export const NuevoPabellon = {
    type: "object",
    required: ["nom_pabellon"],
    properties: {
        nom_pabellon: { type: "string" },
        desc_pabellon: { type: "string" }
    },
    example: {
        nom_pabellon: "Pabellón Turismo y Diseño",
        desc_pabellon: "Pabellón interactivo y exposiciones."
    }
};

// --- SECTOR ---
export const SectorDetalle = {
    type: "object",
    required: ["id_sector", "nom_sector", "pabellonId"],
    properties: {
        id_sector: { type: "integer" },
        nom_sector: { type: "string" },
        pabellonId: { type: "integer" },
        pabellon: { $ref: "#/components/schemas/PabellonDetalle" }
    },
    example: {
        id_sector: 2,
        nom_sector: "Sector Madera y Metal",
        pabellonId: 1
    }
};

export const NuevoSector = {
    type: "object",
    required: ["nom_sector", "pabellonId"],
    properties: {
        nom_sector: { type: "string" },
        pabellonId: { type: "integer" }
    },
    example: {
        nom_sector: "Sector Cerámica",
        pabellonId: 1
    }
};


export const StandDetalle = {
    type: "object",
    required: ["id_stand", "codigo", "std_stand", "sectorId"],
    properties: {
        id_stand: { type: "integer" },
        codigo: { type: "string" },
        latitud: { type: "number", format: "float", nullable: true },
        longitud: { type: "number", format: "float", nullable: true },
        std_stand: {
            type: "string",
            enum: ["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"]
        },
        sectorId: { type: "integer" },
        sector: { $ref: "#/components/schemas/SectorDetalle" }
    },
    example: {
        id_stand: 5,
        codigo: "ST-05",
        latitud: -28.4682,
        longitud: -65.7795,
        std_stand: "DISPONIBLE",
        sectorId: 2,
        sector: {
            id_sector: 2,
            nom_sector: "Sector Madera y Metal",
            pabellonId: 1
        }
    }
};

export const RespuestaStandsPaginada = {
    type: "object",
    required: ["stands", "paginacion"],
    properties: {
        stands: {
            type: "array",
            items: { $ref: "#/components/schemas/StandDetalle" }
        },
        paginacion: {
            type: "object",
            required: ["pagina", "limite", "total", "totalPaginas"],
            properties: {
                pagina: { type: "integer", example: 1 },
                limite: { type: "integer", example: 10 },
                total: { type: "integer", example: 45 },
                totalPaginas: { type: "integer", example: 5 }
            }
        }
    }
};

export const NuevoStand = {
    type: "object",
    required: ["codigo", "sectorId"],
    properties: {
        codigo: { type: "string" },
        latitud: { type: "number", format: "float", nullable: true },
        longitud: { type: "number", format: "float", nullable: true },
        std_stand: {
            type: "string",
            enum: ["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"],
            default: "MANTENIMIENTO"
        },
        sectorId: { type: "integer" }
    },
    example: {
        codigo: "ST-01",
        latitud: -28.4682,
        longitud: -65.7795,
        std_stand: "MANTENIMIENTO",
        sectorId: 2
    }
};


export const ListadoProvincias = {
    type: "array",
    items: {
        type: "string"
    },
    example: [
        "Catamarca",
        "Córdoba",
        "Jujuy",
        "La Rioja",
        "Salta",
        "Tucumán"
    ]
};

export const ListadoLocalidades = {
    type: "array",
    items: {
        type: "string"
    },
    example: [
        "San Fernando del Valle de Catamarca",
        "Valle Viejo",
        "Fray Mamerto Esquiú",
        "Andalgalá",
        "Belén",
        "Tinogasta"
    ]
};