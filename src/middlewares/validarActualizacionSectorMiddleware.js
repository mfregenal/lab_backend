import { actualizarSectorSchema } from "../schemas/sector.schema.js";

export const validarSectorActualizacion = (req, res, next) => {
  const resultado = actualizarSectorSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({
      mensaje: "Datos inválidos para actualizar el sector.",
      errores: resultado.error.issues,
    });
  }
  req.body = resultado.data;
  next();
};