import express from 'express'
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  actualizarEstadoUsuario,
  eliminarUsuario,
  iniciarSesion,
  obtenerMiPerfil,
  cerrarSesion } from '../controllers/usuario.controller.js'
import { validarId } from '../middlewares/validarIdMiddleware.js'
import {
  validarCreacionUsuario,
  validarConsultaUsuario,
  validarActualizacionUsuario,
  validarActualizacionEstadoUsuario,
  validarInicioSesion
} from '../middlewares/validarUsuarioMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js'
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js'

const router = express.Router()

router.get('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarConsultaUsuario, obtenerUsuarios )
router.post( '/', validarCreacionUsuario, crearUsuario )
router.post( '/login', validarInicioSesion, iniciarSesion )

router.get('/me', autenticarUsuario, obtenerMiPerfil);
router.post('/logout', autenticarUsuario, cerrarSesion);

router.patch('/:id/activo', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarActualizacionEstadoUsuario, actualizarEstadoUsuario)
router.get( '/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, obtenerUsuarioPorId )
router.put( '/:id', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, validarActualizacionUsuario, actualizarUsuario )
router.delete( '/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, eliminarUsuario )

export default router