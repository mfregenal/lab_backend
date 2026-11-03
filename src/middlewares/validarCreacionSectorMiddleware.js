import { crearError, detallarErroresZod } from "../utils/errores.js";
import { crearSectorSchema } from "../validators/sector.schema.js";

export const validarSectorCreacion = (req, res, next) => {
  const resultado = crearSectorSchema.safeParse(req.body);
  if (!resultado.success) {
    return next(crearError("Datos inválidos para crear el sector.", 400, detallarErroresZod(resultado.error)));
  }
  req.body = resultado.data;
  next();
};