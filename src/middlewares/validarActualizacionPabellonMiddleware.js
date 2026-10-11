import { actualizarPabellonSchema } from "../schemas/pabellon.schema.js";

export const validarPabellonActualizacion = (req, res, next) => {
  const resultado = actualizarPabellonSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({
      mensaje: "Datos inválidos para actualizar el pabellón.",
      errores: resultado.error.issues,
    });
  }

  req.body = resultado.data;
  next();
};