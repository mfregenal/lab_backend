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

// Documentación OpenAPI de este router (comentarios #swagger de cada operación):
// 1.3: protegidas con #swagger.security = [{ bearerAuth: [] }]; las públicas no declaran seguridad.
// 1.4: cada operación tiene tags, summary y parámetros de ruta/consulta ($ref a IdRuta, Pagina, Limite, etc.).
// 1.5: se listan todas las respuestas posibles; una por operación incluye el esquema ErrorApi y un ejemplo.
// 1.6: los códigos, cuerpos y reglas documentados coinciden con los middlewares y servicios.
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
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "No tiene permiso para esta operación."} } } }
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
    #swagger.responses[404] = { description: "El rubro de la postulación no existe.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "El rubro con ID 999 no existe", "detalles": {}} } } }
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
    #swagger.responses[401] = { description: "Email o contraseña incorrectos.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "Email o contraseña incorrectos", "detalles": {}} } } }
    #swagger.responses[403] = { description: "La cuenta está inactiva." }
  */
  validarInicioSesion, iniciarSesion)

router.get('/me',
  /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Obtener mi perfil"
    #swagger.description = "Requiere JWT y cuenta activa. Devuelve los datos del usuario autenticado, incluyendo su postulación si la tiene."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = { description: "Perfil del usuario autenticado y su postulación." }
    #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "Se requiere un token de acceso."} } } }
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
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "El token es inválido, ha vencido o fue revocado."} } } }
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
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "No tiene permiso para esta operación."} } } }
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
    #swagger.responses[409] = { description: "Debe quedar al menos un administrador activo.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "Debe quedar al menos un administrador activo", "detalles": {}} } } }
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
    #swagger.responses[404] = { description: "Usuario inexistente.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "Usuario no encontrado", "detalles": {}} } } }
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
    #swagger.responses[403] = { description: "Cuenta inactiva, rol no permitido o perfil de otro usuario.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "No tienes permisos para modificar el perfil de otro usuario", "detalles": {}} } } }
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
    #swagger.responses[409] = { description: "No se puede eliminar al último administrador activo.", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" }, example: {"mensaje": "No se puede eliminar al último administrador activo", "detalles": {}} } } }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, eliminarUsuario)

export default router