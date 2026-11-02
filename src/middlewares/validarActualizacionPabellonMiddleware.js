import { crearError, detallarErroresZod } from "../utils/errores.js";
import { actualizarPabellonSchema } from "../validators/pabellon.schema.js";

export const validarPabellonActualizacion = (req, res, next) => {
  const resultado = actualizarPabellonSchema.safeParse(req.body);

  if (!resultado.success) {
    return next(crearError("Datos inválidos para actualizar el pabellón.", 400, detallarErroresZod(resultado.error)));
  }

  req.body = resultado.data;
  next();
};
