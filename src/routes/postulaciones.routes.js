import express from 'express';
import { obtenerPostulaciones, obtenerPostulacionId, crearPostulacion, evaluarPostulacion, eliminarPostulacion } from '../controllers/postulaciones.controller.js';

const router = express.Router();

router.get('/', obtenerPostulaciones);
router.get('/:id', obtenerPostulacionId);
router.post('/', crearPostulacion);
router.put('/:id/evaluar', evaluarPostulacion);
router.delete('/:id', eliminarPostulacion);

export default router;
