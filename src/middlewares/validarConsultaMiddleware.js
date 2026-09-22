import { crearError, detallarErroresZod } from "../utils/errores.js"
import { ConsultarConsultasSchema } from "../validators/consulta.schema.js"

export const validarConsultaConsultas = (req, res, next) => {
  const resultado = ConsultarConsultasSchema.safeParse(req.query)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de consulta inválidos', 400, detalles))
  }

  req.queryValido = resultado.data
  next()
}