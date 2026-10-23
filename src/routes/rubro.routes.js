import express from "express"
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro } from "../controllers/rubro.controller.js"
import { validarId } from "../middlewares/validarIdMiddleware.js"
import { validarCreacionRubro, validarActualizacionRubro, validarConsultaRubro } from '../middlewares/validarRubroMiddleware.js'
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js'
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js'

const router = express.Router()

router.get('/', loggerConsultas, validarConsultaRubro, obtenerRubros)
router.get('/:id', validarId, obtenerRubroPorId)
router.post('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarCreacionRubro, crearRubro)
router.put('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarActualizacionRubro, actualizarRubro)
router.delete('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, eliminarRubro)

export default router