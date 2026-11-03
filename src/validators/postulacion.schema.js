import { z } from 'zod';
import { obtenerProvinciasService, obtenerLocalidadesPorProvinciaService } from '../services/ubicaciones.service.js';

const provinciasValidas = obtenerProvinciasService();

const datosPostulacionSchema = z.object({
    dni: z.string({
        error: (i) => i.input === undefined ? "El DNI es obligatorio" : "El DNI debe ser texto"
    })
    .min(7, "El DNI debe tener al menos 7 caracteres")
    .max(10, "El DNI no puede superar los 10 caracteres"),

    celular: z.string({
        error: (i) => i.input === undefined ? "El celular es obligatorio" : "El celular debe ser texto"
    })
    .min(8, "El celular debe tener al menos 8 caracteres"),

    nom_emprend: z.string({
        error: (i) => i.input === undefined
            ? "El nombre del emprendimiento es obligatorio"
            : "El nombre debe ser texto"
    })
    .min(3, "El nombre del emprendimiento debe tener al menos 3 caracteres"),

    desc_emprend: z.string({
        error: (i) => i.input === undefined
            ? "La descripción del emprendimiento es obligatoria"
            : "La descripción debe ser texto"
    })
    .min(10, "La descripción debe tener al menos 10 caracteres"),

    trayectoria: z.string({
        error: "La trayectoria debe ser texto"
    }).optional(),

    rubroId: z.number({
        error: (i) => i.input === undefined
            ? "El ID del rubro es obligatorio"
            : "El ID del rubro debe ser un número"
    })
    .int("El ID del rubro debe ser un número entero")
    .positive("El ID del rubro debe ser un número positivo"),

    provincia: z.string({ error: (i) => i.input === undefined ? "La provincia es obligatoria" : undefined })
        .refine((val) => provinciasValidas.includes(val), {
            message: "La provincia ingresada no es válida. Revisa la ortografía."
        }),

    localidad: z.string({ error: (i) => i.input === undefined ? "La localidad es obligatoria" : undefined })
});

const validarLocalidad = (data, contexto) => {
    const localidadesValidas = obtenerLocalidadesPorProvinciaService(data.provincia);

    if (!localidadesValidas.includes(data.localidad.toUpperCase())) {
        contexto.addIssue({
            code: 'custom',
            message: "La localidad no existe dentro de la provincia seleccionada.",
            path: ["localidad"]
        });
    }
};

export const actualizarPostulacionSchema = z.object({
    dni: z.string({ error: "El DNI debe ser texto" })
        .min(7, "El DNI debe tener al menos 7 caracteres")
        .max(10, "El DNI no puede superar los 10 caracteres").optional(),

    celular: z.string({ error: "El celular debe ser texto" })
        .min(8, "El celular debe tener al menos 8 caracteres").optional(),

    nom_emprend: z.string({ error: "El nombre debe ser texto" })
        .min(3, "El nombre del emprendimiento debe tener al menos 3 caracteres").optional(),

    desc_emprend: z.string({ error: "La descripción debe ser texto" })
        .min(10, "La descripción debe tener al menos 10 caracteres").optional(),

    trayectoria: z.string({ error: "La trayectoria debe ser texto" }).optional(),

    rubroId: z.number({ error: "El ID del rubro debe ser un número" })
        .int("El ID del rubro debe ser un número entero")
        .positive("El ID del rubro debe ser un número positivo").optional(),

    provincia: z.string({ error: "La provincia debe ser texto" }).refine((val) => provinciasValidas.includes(val), {
        message: "La provincia ingresada no es válida. Revisa la ortografía."
    }).optional(),

    localidad: z.string({ error: "La localidad debe ser texto" }).optional(),
}).refine((datos) => Object.keys(datos).length > 0, {
    message: "Debe enviar al menos un campo para actualizar."
});

export const evaluarPostulacionSchema = z.object({
    std_postulacion: z.enum(['EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA'], {
        error: (i) => i.input === undefined
            ? "El estado de postulación es obligatorio"
            : "El estado enviado no es válido"
    }),
    observacion: z.string({ error: "La observación debe ser texto" }).nullable().optional()
}).strict();

export const datosPostulacionUsuarioSchema = datosPostulacionSchema.superRefine(validarLocalidad);

export const consultarPostulacionesSchema = z.object({
    estado: z.enum(['PENDIENTE', 'EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA'], {
        error: "El estado proporcionado para filtrar no es válido"
    }).optional(),

    nombre: z.string({ error: "El nombre para filtrar debe ser texto" }).optional(),
    dni: z.string({ error: "El DNI para filtrar debe ser texto" }).optional(),
    provincia: z.string({ error: "La provincia para filtrar debe ser texto" }).optional(),
    localidad: z.string({ error: "La localidad para filtrar debe ser texto" }).optional(),
    rubroId: z.coerce.number().int().positive().optional(),

    pagina: z.coerce.number({ error: "La página debe ser un número" })
        .int("La página debe ser un número entero")
        .positive("La página debe ser mayor a 0").optional().default(1),

    limite: z.coerce.number({ error: "El límite debe ser un número" })
        .int("El límite debe ser un número entero")
        .positive("El límite debe ser mayor a 0").optional().default(10)
});
