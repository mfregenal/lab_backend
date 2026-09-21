import express from "express"
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro } from "../controllers/rubro.controller.js"
import { validarId } from "../middlewares/validarIdMiddleware.js"
import { validarCreacionRubro, validarActualizacionRubro, validarConsultaRubro } from '../middlewares/validarRubroMiddleware.js'

const router = express.Router()

router.get('/', validarConsultaRubro, obtenerRubros)
router.get('/:id', validarId, obtenerRubroPorId)
router.post('/', validarCreacionRubro, crearRubro)
router.put('/:id', validarId, validarActualizacionRubro, actualizarRubro)
router.delete('/:id', validarId, eliminarRubro)

export default router