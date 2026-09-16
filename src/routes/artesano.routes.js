import express from 'express';
import { obtenerArtesanos, obtenerArtesanoId, crearArtesano, actualizarArtesano, eliminarArtesano } from '../controllers/artesano.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";

const router = express.Router();

router.get('/', obtenerArtesanos);
router.get('/:id', validarId, obtenerArtesanoId);
router.post('/', crearArtesano);
router.put('/:id', validarId, actualizarArtesano);
router.delete('/:id', validarId, eliminarArtesano);

export default router;