import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario, iniciarSesion, obtenerMiPerfil, cerrarSesion } from '../controllers/usuario.controller.js'
import { validarId } from '../middlewares/validarIdMiddleware.js'
import { validarCreacionUsuario, validarConsultaUsuario, validarActualizacionUsuario, validarInicioSesion } from '../middlewares/validarUsuarioMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js'

const router = express.Router()

router.get('/', validarConsultaUsuario, obtenerUsuarios )
router.post( '/', validarCreacionUsuario, crearUsuario )
router.post( '/login', validarInicioSesion, iniciarSesion )

router.get('/me', autenticarUsuario, obtenerMiPerfil);
router.post('/logout', autenticarUsuario, cerrarSesion);

router.get( '/:id', validarId, obtenerUsuarioPorId )
router.put( '/:id', validarId, validarActualizacionUsuario, actualizarUsuario )
router.delete( '/:id', validarId, eliminarUsuario )



export default router