import express from 'express';
import { obtenerArtesanos, obtenerArtesanoId, crearArtesano, actualizarArtesano, eliminarArtesano } from '../controllers/artesano.controller.js';
import { validarCreacionArtesano, validarConsultaArtesanos } from '../middlewares/validarArtesanoMiddleware.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'

const router = express.Router();

router.get('/', loggerConsultas, validarConsultaArtesanos, obtenerArtesanos);
router.get('/:id', validarId, obtenerArtesanoId);
router.post('/', validarCreacionArtesano, crearArtesano);
router.put('/:id', validarId, actualizarArtesano);
router.delete('/:id', validarId, eliminarArtesano);

export default router;