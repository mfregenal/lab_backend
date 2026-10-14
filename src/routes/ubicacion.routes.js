import { Router } from 'express';
import { obtenerProvincias, obtenerLocalidades } from '../controllers/ubicacion.controller.js';

const router = Router();

router.get('/provincias', obtenerProvincias);
router.get('/localidades/:provincia', obtenerLocalidades);

export default router;