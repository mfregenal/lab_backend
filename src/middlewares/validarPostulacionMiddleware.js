import { crearError, detallarErroresZod } from "../utils/errores.js";
import { actualizarPostulacionSchema, evaluarPostulacionSchema, consultarPostulacionesSchema } from "../validators/postulacion.schema.js";

export const validarActualizacionPostulacion = (req, res, next) => {
  // Verificar si el usuario es un artesano y está intentando modificar campos restringidos
  if (req.usuario.rol === 'ARTESANO'
    && req.body !== null
    && typeof req.body === 'object'
    && ['std_postulacion', 'observacion', 'adminId'].some((campo) => campo in req.body)) {
    return res.status(403).json({
      mensaje: "Usted no puede modificar el estado ni la evaluación de su postulación."
    });
  }

  const resultado = actualizarPostulacionSchema.safeParse(req.body);


  if (!resultado.success) {
    return next(crearError("Los datos enviados son inválidos.", 400, detallarErroresZod(resultado.error)));
  }


  req.body = resultado.data;
  return next();
};


export const validarEvaluacionPostulacion = (req, res, next) => {
  const resultado = evaluarPostulacionSchema.safeParse(req.body);


  if (!resultado.success) {
    return next(crearError("Los datos de evaluación son inválidos.", 400, detallarErroresZod(resultado.error)));
  }


  req.body = resultado.data;
  return next();
};


export const validarConsultaPostulaciones = (req, res, next) => {
  if (req.query.estado) {
    req.query.estado = req.query.estado.toUpperCase();
  }


  const resultado = consultarPostulacionesSchema.safeParse(req.query);


  if (!resultado.success) {
    return next(crearError("Los parámetros de búsqueda son inválidos.", 400, detallarErroresZod(resultado.error)));
  }


  req.queryValido = resultado.data;


  return next();
};