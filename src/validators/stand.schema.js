import { z } from 'zod';

export const crearStandSchema = z.object({
    codigo: z
        .string({ required_error: "El código del stand es obligatorio." })
        .trim()
        .min(1, "El código no puede estar vacío."),
    latitud: z.coerce
        .number()
        .min(-90)
        .max(90)
        .optional()
        .nullable(),
    longitud: z.coerce
        .number()
        .min(-180)
        .max(180)
        .optional()
        .nullable(),
    sectorId: z.coerce
        .number({ required_error: "El ID del sector es obligatorio." })
        .int("Debe ser un número entero.")
        .positive("Debe ser un número positivo.")
        .optional(),
    id_sector: z.coerce
        .number()
        .int("Debe ser un número entero.")
        .positive("Debe ser un número positivo.")
        .optional(),
}).refine((data) => data.sectorId !== undefined || data.id_sector !== undefined, {
    message: "Debe especificar el sector (sectorId o id_sector).",
    path: ["sectorId"],
});

export const consultarStandsSchemas = z.object({
    std_stand: z.enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"]).optional(),
    sectorId: z.coerce.number().int().positive().optional(),
    id_sector: z.coerce.number().int().positive().optional(),
    nom_emprend: z.string().trim().min(1).optional(),
    rubro: z.string().trim().min(1).optional(),
    ordenPor: z.enum(["codigo", "id_stand"]).default("id_stand"),
    direccion: z.enum(["asc", "desc"]).default("asc"),
    pagina: z.coerce.number().int().positive("La página debe ser mayor a 0.").default(1),
    limite: z.coerce
        .number()
        .int()
        .min(1, "El límite mínimo es 1.")
        .max(50, "El límite máximo es 50.")
        .default(10),
});

export const actualizarStandSchema = z
    .object({
        codigo: z.string().trim().min(1, "El código no puede estar vacío.").optional(),
        latitud: z.coerce.number().min(-90).max(90).optional().nullable(),
        longitud: z.coerce.number().min(-180).max(180).optional().nullable(),
        std_stand: z.enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"]).optional(),
        sectorId: z.coerce.number().int().positive().optional(),
        id_sector: z.coerce.number().int().positive().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe ingresar al menos un campo para actualizar.",
    });