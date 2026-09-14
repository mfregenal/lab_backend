import express from 'express';
import { obtenerArtesanos, obtenerArtesanoId, crearArtesano, actualizarArtesano, eliminarArtesano } from '../controllers/artesano.controller.js';

const router = express.Router();

router.get('/', obtenerArtesanos);
router.get('/:id', obtenerArtesanoId);
router.post('/', crearArtesano);
router.put('/:id', actualizarArtesano);
router.delete('/:id', eliminarArtesano);

export default router;