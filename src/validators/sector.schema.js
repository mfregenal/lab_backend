import { z } from "zod";

export const crearSectorSchema = z.object({
    nom_sector: z
        .string({ required_error: "El nombre del sector es requerido." })
        .trim()
        .min(1, "El nombre del sector no puede estar vacío."),
    id_pabellon: z.coerce
        .number({ required_error: "El ID de pabellón es requerido." })
        .int("El ID de pabellón debe ser un número entero.")
        .positive("El ID de pabellón debe ser mayor a 0."),
});

export const actualizarSectorSchema = z
    .object({
        nom_sector: z
            .string()
            .trim()
            .min(1, "El nombre del sector no puede estar vacío.")
            .optional(),
        id_pabellon: z.coerce
            .number()
            .int("El ID de pabellón debe ser un número entero.")
            .positive("El ID de pabellón debe ser mayor a 0.")
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe ingresar al menos un campo para actualizar.",
    });