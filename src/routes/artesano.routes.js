import express from 'express';
import { obtenerArtesanos, obtenerArtesanoId, crearArtesano, eliminarArtesano } from '../controllers/artesano.controller.js';

const router = express.Router();

router.get('/', obtenerArtesanos);
router.get('/:id', obtenerArtesanoId);
router.post('/', crearArtesano);
router.delete('/:id', eliminarArtesano);

export default router;