import express from 'express';
import { obtenerPostulaciones, obtenerPostulacionId, crearPostulacion,actualizarPostulacion, evaluarPostulacion, eliminarPostulacion } from '../controllers/postulacion.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarCreacionPostulacion, validarConsultaPostulaciones} from "../middlewares/postulacion.middlewares.js";

const router = express.Router();

router.get('/', validarConsultaPostulaciones, obtenerPostulaciones);
router.get('/:id', validarId, obtenerPostulacionId);
router.post('/', validarCreacionPostulacion, crearPostulacion);
router.put('/:id', validarId, actualizarPostulacion);
router.put('/:id/evaluar', validarId, evaluarPostulacion);
router.delete('/:id', validarId, eliminarPostulacion);

export default router;
