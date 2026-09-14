import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/usuario.controller.js'
import { validarId } from '../middlewares/validarIdMiddleware.js'
import{ validarUsuario } from '../middlewares/validarUsuarioMiddleware.js'

const router = express.Router()

router.get('/', obtenerUsuarios )
router.get( '/:id', validarId, obtenerUsuarioPorId )
router.post( '/', validarUsuario, crearUsuario )
router.put( '/:id', validarId, validarUsuario, actualizarUsuario )
router.delete( '/:id', validarId, eliminarUsuario )

export default router