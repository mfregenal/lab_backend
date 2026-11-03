import express from 'express'
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  crearAdministrador,
  actualizarUsuario,
  actualizarEstadoUsuario,
  eliminarUsuario,
  iniciarSesion,
  obtenerMiPerfil,
  cerrarSesion } from '../controllers/usuario.controller.js'
import { validarId } from '../middlewares/validarIdMiddleware.js'
import {
  validarCreacionUsuario,
  validarCreacionAdministrador,
  validarConsultaUsuario,
  validarActualizacionUsuario,
  validarActualizacionEstadoUsuario,
  validarInicioSesion
} from '../middlewares/validarUsuarioMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js'
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js'

const router = express.Router()

router.get('/',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Listar usuarios"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR. Devuelve los usuarios paginados, con filtros y orden opcionales."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['pagina'] = { in: 'query', schema: { $ref: "#/components/schemas/Pagina" } }
    #swagger.parameters['limite'] = { in: 'query', schema: { $ref: "#/components/schemas/Limite" } }
    #swagger.parameters['nombre'] = { in: 'query', description: 'Filtra por nombre (contiene, sin distinguir mayúsculas).', schema: { type: 'string' } }
    #swagger.parameters['email'] = { in: 'query', description: 'Filtra por email (contiene, sin distinguir mayúsculas).', schema: { type: 'string' } }
    #swagger.parameters['rol'] = { in: 'query', schema: { type: 'string', enum: ['ARTESANO', 'ADMINISTRADOR'] } }
    #swagger.parameters['ordenPor'] = { in: 'query', schema: { $ref: "#/components/schemas/OrdenUsuarios" } }
    #swagger.parameters['direccion'] = { in: 'query', schema: { $ref: "#/components/schemas/Direccion" } }
    #swagger.responses[200] = { description: "Listado paginado de usuarios." }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarConsultaUsuario, obtenerUsuarios)

router.post('/',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Registrar un artesano"
    #swagger.description = "Operación pública. Crea una cuenta de ARTESANO junto con su postulación."
    #swagger.auto = false
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoUsuario" } } } }
    #swagger.responses[201] = { description: "Usuario y postulación creados." }
    #swagger.responses[400] = { description: "Cuerpo inválido." }
    #swagger.responses[404] = { description: "El rubro de la postulación no existe." }
    #swagger.responses[409] = { description: "El email o el DNI ya están en uso." }
  */
  validarCreacionUsuario, crearUsuario)

router.post('/login',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Iniciar sesión"
    #swagger.description = "Operación pública. Devuelve un JWT válido por 1 hora."
    #swagger.auto = false
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/InicioSesion" } } } }
    #swagger.responses[200] = { description: "Sesión iniciada." }
    #swagger.responses[400] = { description: "Cuerpo inválido." }
    #swagger.responses[401] = { description: "Email o contraseña incorrectos." }
    #swagger.responses[403] = { description: "La cuenta está inactiva." }
  */
  validarInicioSesion, iniciarSesion)

  router.get('/me',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Obtener mi perfil"
    #swagger.description = "Requiere JWT y cuenta activa, con cualquier rol."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = { description: "Perfil del usuario autenticado." }
    #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "La cuenta está inactiva." }
  */
  autenticarUsuario, obtenerMiPerfil)

  router.post('/logout',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Cerrar sesión"
    #swagger.description = "Requiere JWT y cuenta activa. Revoca el token usado en la solicitud."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[204] = { description: "Sesión cerrada, sin contenido." }
    #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "La cuenta está inactiva." }
  */
  autenticarUsuario, cerrarSesion)

router.post('/registro-administrador',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Registrar un administrador"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoAdministrador" } } } }
    #swagger.responses[201] = { description: "Administrador creado." }
    #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[409] = { description: "El email ya está en uso." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarCreacionAdministrador, crearAdministrador)

router.patch('/:id/activo',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Activar o desactivar un usuario"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR. No permite dejar el sistema sin administradores activos."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { $ref: "#/components/schemas/IdRuta" } }
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EstadoUsuario" } } } }
    #swagger.responses[200] = { description: "Usuario actualizado." }
    #swagger.responses[400] = { description: "ID o cuerpo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    #swagger.responses[409] = { description: "Debe quedar al menos un administrador activo." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarActualizacionEstadoUsuario, actualizarEstadoUsuario)

router.get('/:id',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Obtener un usuario"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { $ref: "#/components/schemas/IdRuta" } }
    #swagger.responses[200] = { description: "Usuario encontrado." }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, obtenerUsuarioPorId)

router.put('/:id',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Actualizar un usuario"
    #swagger.description = "Requiere JWT y cuenta activa. Un ARTESANO solo puede modificar su propio perfil y no puede cambiar su rol. Admite actualización parcial."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { $ref: "#/components/schemas/IdRuta" } }
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizacionUsuario" } } } }
    #swagger.responses[200] = { description: "Usuario actualizado." }
    #swagger.responses[400] = { description: "ID o cuerpo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva, rol no permitido o perfil de otro usuario." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    #swagger.responses[409] = { description: "El email ya está en uso o debe quedar al menos un administrador activo." }
  */
  autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, validarActualizacionUsuario, actualizarUsuario)

router.delete('/:id',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Eliminar un usuario"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR. No permite eliminar al último administrador activo."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { $ref: "#/components/schemas/IdRuta" } }
    #swagger.responses[200] = { description: "Usuario eliminado." }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    #swagger.responses[409] = { description: "No se puede eliminar al último administrador activo." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, eliminarUsuario)

export default router