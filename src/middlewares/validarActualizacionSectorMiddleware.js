import { crearError, detallarErroresZod } from "../utils/errores.js";
import { actualizarSectorSchema } from "../validators/sector.schema.js";

export const validarSectorActualizacion = (req, res, next) => {
  const resultado = actualizarSectorSchema.safeParse(req.body);
  if (!resultado.success) {
    return next(crearError("Datos inválidos para actualizar el sector.", 400, detallarErroresZod(resultado.error)));
  }
  req.body = resultado.data;
  next();
};
