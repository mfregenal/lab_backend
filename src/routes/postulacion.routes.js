import express from 'express';
import { obtenerPostulaciones, obtenerPostulacionId, crearPostulacion,actualizarPostulacion, evaluarPostulacion, eliminarPostulacion } from '../controllers/postulacion.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";

const router = express.Router();

router.get('/', obtenerPostulaciones);
router.get('/:id', validarId, obtenerPostulacionId);
router.post('/', crearPostulacion);
router.put('/:id', validarId, actualizarPostulacion);
router.put('/:id/evaluar', validarId, evaluarPostulacion);
router.delete('/:id', validarId, eliminarPostulacion);

export default router;
