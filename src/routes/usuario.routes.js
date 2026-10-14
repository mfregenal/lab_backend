import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario, iniciarSesion } from '../controllers/usuario.controller.js'
import { validarId } from '../middlewares/validarIdMiddleware.js'
import { validarCreacionUsuario, validarConsultaUsuario, validarActualizacionUsuario, validarInicioSesion } from '../middlewares/validarUsuarioMiddleware.js'

const router = express.Router()

router.get('/', validarConsultaUsuario, obtenerUsuarios )
router.get( '/:id', validarId, obtenerUsuarioPorId )
router.post( '/', validarCreacionUsuario, crearUsuario )
router.post( '/login', validarInicioSesion, iniciarSesion )
router.put( '/:id', validarId, validarActualizacionUsuario, actualizarUsuario )
router.delete( '/:id', validarId, eliminarUsuario )

export default router