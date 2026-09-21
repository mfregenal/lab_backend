import { crearError, detallarErroresZod } from "../utils/errores.js"
import { crearUsuarioSchema, ConsultarUsuariosSchema, actualizarUsuarioSchema } from "../validators/usuario.schema.js"

export const validarCreacionUsuario = (req, res, next) => {
  const resultado = crearUsuarioSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de usuario invalidos', 400, detalles))
  }

  req.body = resultado.data // Inyecta los datos transformados por Zod
  next()
}

export const validarConsultaUsuario = (req, res, next) => {
  const resultado = ConsultarUsuariosSchema.safeParse(req.query)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de consulta invalidos', 400, detalles))
  }

  //req.query = resultado.data
  req.queryValido = resultado.data
  next()
}

export const validarActualizacionUsuario = (req, res, next) => {
  const resultado = actualizarUsuarioSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de actualización inválidos', 400, detalles))
  }

  req.body = resultado.data
  next()
}