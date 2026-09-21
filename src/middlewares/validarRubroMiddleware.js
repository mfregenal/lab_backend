import { crearError, detallarErroresZod } from "../utils/errores.js"
import { crearRubroSchema, actualizarRubroSchema, ConsultarRubrosSchema } from "../validators/rubro.schema.js"

export const validarCreacionRubro = (req, res, next) => {
  const resultado = crearRubroSchema.safeParse(req.body)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de rubro inválidos', 400, detalles))
  }
  req.body = resultado.data
  next()
}

export const validarConsultaRubro = (req, res, next) => {
  const resultado = ConsultarRubrosSchema.safeParse(req.query)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de consulta inválidos', 400, detalles))
  }
  req.queryValido = resultado.data
  next()
}

export const validarActualizacionRubro = (req, res, next) => {
  const resultado = actualizarRubroSchema.safeParse(req.body)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de actualización inválidos', 400, detalles))
  }
  req.body = resultado.data
  next()
}