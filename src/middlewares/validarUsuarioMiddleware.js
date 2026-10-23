import { crearError, detallarErroresZod } from "../utils/errores.js"
import {
  crearUsuarioSchema,
  crearAdministradorSchema,
  consultarUsuariosSchema,
  actualizarUsuarioSchema,
  actualizarEstadoUsuarioSchema,
  iniciarSesionSchema
} from "../validators/usuario.schema.js"

export const validarCreacionUsuario = (req, res, next) => {
  const resultado = crearUsuarioSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    console.log("ERRORES DE ZOD:", detalles)
    return next(crearError('Datos de usuario invalidos', 400, detalles))
  }

  req.body = resultado.data // Inyecta los datos transformados por Zod
  next()
}

export const validarCreacionAdministrador = (req, res, next) => {
  const resultado = crearAdministradorSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de administrador inválidos', 400, detalles))
  }

  req.body = resultado.data
  next()
}

export const validarConsultaUsuario = (req, res, next) => {
  const resultado = consultarUsuariosSchema.safeParse(req.query)

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

export const validarActualizacionEstadoUsuario = (req, res, next) => {
  const resultado = actualizarEstadoUsuarioSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de estado de usuario inválidos', 400, detalles))
  }

  req.body = resultado.data
  next()
}

export const validarInicioSesion = (req, res, next) => {
  const resultado = iniciarSesionSchema.safeParse(req.body)
  if(!resultado.success){
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError('Datos de inicio de sesión inválidos', 400, detalles))
  }

  req.iniciarSesionDTO = resultado.data
  next()
}