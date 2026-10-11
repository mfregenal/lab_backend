import { crearSectorSchema } from "../schemas/sector.schema.js";

export const validarSectorCreacion = (req, res, next) => {
  const resultado = crearSectorSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({
      mensaje: "Datos inválidos para crear el sector.",
      errores: resultado.error.issues,
    });
  }
  req.body = resultado.data;
  next();
};