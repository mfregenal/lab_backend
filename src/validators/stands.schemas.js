import { z } from 'zod';

export const crearStandSchema = z.object({
    codigo: z
        .string({ required_error: "El código del stand es obligatorio." })
        .trim()
        .min(1, "El código no puede estar vacío."),
    coordenada: z
        .string({ required_error: "La coordenada es obligatoria." })
        .trim()
        .min(1, "La coordenada no puede estar vacía."),
    id_sector: z.coerce
        .number({ required_error: "El id_sector es obligatorio." })
        .int("Debe ser un entero.")
        .positive("Debe ser un número positivo."),
    id_artesano: z.coerce
        .number()
        .int()
        .positive()
        .optional()
        .nullable(),
});

export const consultarStandsSchemas = z.object({
    estado: z.string().trim().min(1).optional(),
    id_sector: z.coerce.number().int().positive().optional(), 
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