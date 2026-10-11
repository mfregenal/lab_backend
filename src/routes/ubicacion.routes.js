import { Router } from 'express';
import { obtenerProvincias, obtenerLocalidades } from '../controllers/ubicacion.controller.js';

const router = Router();

// GET /api/ubicaciones/provincias
router.get('/provincias', obtenerProvincias);

// GET /api/ubicaciones/localidades/:provincia
// IMPORTANTE: Cuando el frontend mande provincias con espacios (ej: "Buenos Aires"), 
// la URL debe enviarse codificada (ej: /api/ubicaciones/localidades/Buenos%20Aires)
router.get('/localidades/:provincia', obtenerLocalidades);

export default router;