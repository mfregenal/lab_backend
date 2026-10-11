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

export const actualizarPabellonSchema = z.object({
    nom_pabellon: z.string().trim().min(1, "El nombre no puede estar vacío.").optional(),
    desc_pabellon: z
      .string()
      .trim()
      .min(1, "La descripción no puede estar vacía.")
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe ingresar al menos un campo para actualizar.",
  });
