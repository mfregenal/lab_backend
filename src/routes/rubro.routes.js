import express from "express"
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro } from "../controllers/rubro.controller.js"
import { validarId } from "../middlewares/validarIdMiddleware.js"
import { validarRubro } from '../middlewares/validarRubroMiddleware.js'

const router = express.Router()

router.get( '/', obtenerRubros )
router.get( '/:id', validarId, obtenerRubroPorId )
router.post( '/', validarRubro, crearRubro)
router.put( '/:id', validarId, validarRubro, actualizarRubro )
router.delete( '/:id', validarId, eliminarRubro )

export default router