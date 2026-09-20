import { z } from "zod";

export const crearPabellonSchema = z.object({
    nom_pabellon: z.string().trim().min(1,"El nombre del pabellón no puede estar vacío."),
    desc_pabellon: z
        .string()
        .trim()
        .min(1, "No puede estar vacía la descripción en caso de proporcionarla.")
        .optional()
        .nullable(),
});
