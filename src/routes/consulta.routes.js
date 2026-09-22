import express from 'express'
import { obtenerConsultas } from '../controllers/consulta.controller.js'
import { validarConsultaConsultas } from '../middlewares/validarConsultaMiddleware.js'

const router = express.Router()

router.get('/', validarConsultaConsultas, obtenerConsultas)

export default router