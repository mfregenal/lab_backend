import { z } from "zod";

export const crearSectorSchema = z.object({
    nom_sector: z
        .string({ required_error: "El nombre del sector es requerido." })
        .trim()
        .min(1, "El nombre del sector no puede estar vacío."),
    pabellonId: z.coerce
        .number()
        .int("El ID de pabellón debe ser un número entero.")
        .positive("El ID de pabellón debe ser mayor a 0.")
        .optional(),
    id_pabellon: z.coerce
        .number({ required_error: "El ID de pabellón es requerido." })
        .int("El ID de pabellón debe ser un número entero.")
        .positive("El ID de pabellón debe ser mayor a 0.")
        .optional(),
})
    .refine((data) => data.pabellonId !== undefined || data.id_pabellon !== undefined, {
        message: "Debe ingresar el ID del pabellón (pabellonId o id_pabellon).",
        path: ["pabellonId"],
    })
    .transform((data) => ({
        nom_sector: data.nom_sector,
        pabellonId: data.pabellonId ?? data.id_pabellon,
    }));

export const actualizarSectorSchema = z
    .object({
        nom_sector: z
            .string()
            .trim()
            .min(1, "El nombre del sector no puede estar vacío.")
            .optional(),
        pabellonId: z.coerce
            .number()
            .int("El ID de pabellón debe ser un número entero.")
            .positive("El ID de pabellón debe ser mayor a 0.")
            .optional(),
        id_pabellon: z.coerce
            .number()
            .int("El ID de pabellón debe ser un número entero.")
            .positive("El ID de pabellón debe ser mayor a 0.")
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe ingresar al menos un campo para actualizar.",
    })
    .transform((data) => {
        const res = {};
        if (data.nom_sector !== undefined) res.nom_sector = data.nom_sector;
        if (data.pabellonId !== undefined || data.id_pabellon !== undefined) {
            res.pabellonId = data.pabellonId ?? data.id_pabellon;
        }
        return res;
    });