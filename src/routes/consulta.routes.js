import express from 'express'
import { obtenerConsultas } from '../controllers/consulta.controller.js'
import { validarConsultaConsultas } from '../middlewares/validarConsultaMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js'
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js'

const router = express.Router()

router.get('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarConsultaConsultas, obtenerConsultas)

export default router