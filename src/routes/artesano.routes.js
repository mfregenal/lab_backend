import express from 'express';
import { obtenerArtesanos, obtenerArtesanoId, crearArtesano } from '../controllers/artesano.controller.js';

const router = express.Router();

router.get('/', obtenerArtesanos);
router.get('/:id', obtenerArtesanoId);
router.post('/', crearArtesano);

export default router;