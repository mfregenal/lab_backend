import express from 'express';
import { obtenerArtesanos, obtenerArtesanoId, crearArtesano } from '../controllers/artesano.controller.js';

const router = express.Router();

router.get('/artesanos', obtenerArtesanos);
router.get('/artesanos/:id', obtenerArtesanoId);
router.post('/artesanos', crearArtesano);

export default router;